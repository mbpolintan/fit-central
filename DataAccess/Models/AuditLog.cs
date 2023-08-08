using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Models
{
    public partial class AuditLog
    {
        public Guid AuditLogId { get; set; }
        public DateTime TimeStamp { get; set; }
        public string AuditType { get; set; }
        public string Username { get; set; }
        public string TableName { get; set; }
        public string KeyValues { get; set; }
        public string OldValues { get; set; }
        public string NewValues { get; set; }
        public string ChangedColumns { get; set; }
    }
}
