using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class AuditLogDelete
    {
        public long AuditLogDeleteId { get; set; }
        public int AppUserId { get; set; }
        public string UserName { get; set; }
        public DateTime DateDeleted { get; set; }
        public string TableName { get; set; }
        public int RecordId { get; set; }
        public string Details { get; set; }

        public virtual AppUser AppUser { get; set; }
    }
}
