using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class AuditLogUpdate
    {
        public long AuditLogUpdateId { get; set; }
        public int AppUserId { get; set; }
        public string UserName { get; set; }
        public DateTime DateUpdated { get; set; }
        public string TableName { get; set; }
        public int RecordId { get; set; }
        public int? RecordHeaderId { get; set; }
        public string PropertyName { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
        public string Details { get; set; }

        public virtual AppUser AppUser { get; set; }
    }
}
