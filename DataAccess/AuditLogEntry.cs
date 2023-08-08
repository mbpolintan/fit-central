using System.Collections.Generic;
using DataAccess.Enums;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;

namespace DataAccess
{
    public class AuditLogEntry
    {
        public EntityEntry Entry { get; }
        public AuditType AuditType { get; set; }
        public string Username { get; set; }
        public string TableName { get; set; }
        public Dictionary<string, object> KeyValues { get; } = new Dictionary<string, object>();
        public Dictionary<string, object> OldValues { get; } = new Dictionary<string, object>();
        public Dictionary<string, object> NewValues { get; } = new Dictionary<string, object>();
        public List<string> ChangedColumns { get; } = new List<string>();

        public AuditLogEntry(EntityEntry entry, string username)
        {
            Entry = entry;
            Username = username;
            SetChanges();
        }

        private void SetChanges()
        {
            //TableName = Entry.Metadata.Relational().TableName;
            TableName = Entry.Metadata.GetTableName();
            foreach (PropertyEntry property in Entry.Properties)
            {
                string propertyName = property.Metadata.Name;
                //string dbColumnName = property.Metadata.Relational().ColumnName;
                string dbColumnName = property.Metadata.GetColumnName();

                if (property.Metadata.IsPrimaryKey())
                {
                    KeyValues[propertyName] = property.CurrentValue;
                    continue;
                }

                switch (Entry.State)
                {
                    case EntityState.Added:
                        NewValues[propertyName] = property.CurrentValue;
                        AuditType = AuditType.Create;
                        break;

                    case EntityState.Deleted:
                        OldValues[propertyName] = property.OriginalValue;
                        AuditType = AuditType.Delete;
                        break;

                    case EntityState.Modified:
                        if (property.IsModified)
                        {
                            var databaseValues = Entry.GetDatabaseValues();
                            foreach (var databaseValuesProperty in databaseValues.Properties)
                            {
                                if (databaseValuesProperty.Name == propertyName)
                                {
                                    var value = databaseValues[databaseValuesProperty.Name];

                                    // Database Value is null and Current Value is not null
                                    if (property.CurrentValue != null)
                                    {
                                        if (value == null)
                                        {
                                            ChangedColumns.Add(dbColumnName);

                                            OldValues[propertyName] = databaseValues[databaseValuesProperty.Name];
                                            NewValues[propertyName] = property.CurrentValue;
                                            AuditType = AuditType.Update;
                                        }
                                    }
                                    // Database Value is not null and Current Value is null
                                    else if (value != null)
                                    {
                                        if (property.CurrentValue == null)
                                        {
                                            ChangedColumns.Add(dbColumnName);

                                            OldValues[propertyName] = databaseValues[databaseValuesProperty.Name];
                                            NewValues[propertyName] = property.CurrentValue;
                                            AuditType = AuditType.Update;
                                        }
                                    }

                                    if (property.CurrentValue != null && value != null)
                                    {
                                        if (!property.CurrentValue.Equals(value))
                                        {
                                            ChangedColumns.Add(dbColumnName);

                                            OldValues[propertyName] = databaseValues[databaseValuesProperty.Name];
                                            NewValues[propertyName] = property.CurrentValue;
                                            AuditType = AuditType.Update;
                                        }
                                    }

                                    break;
                                }
                            }
                        }
                        break;
                }
            }
        }

        public AuditLog ToAuditLog()
        {
            var audit = new AuditLog
            {
                AuditType = AuditType.ToString(),
                Username = Username,
                TableName = TableName,
                KeyValues = JsonConvert.SerializeObject(KeyValues),
                OldValues = OldValues.Count == 0 ? null : JsonConvert.SerializeObject(OldValues),
                NewValues = NewValues.Count == 0 ? null : JsonConvert.SerializeObject(NewValues),
                ChangedColumns = ChangedColumns.Count == 0 ? null : JsonConvert.SerializeObject(ChangedColumns)
            };

            return audit;
        }
    }
}
