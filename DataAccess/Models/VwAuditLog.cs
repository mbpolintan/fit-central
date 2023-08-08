using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class VwAuditLog
    {
        public int RecordId { get; set; }
        public int RecordHeaderId { get; set; }
        public string LogAction { get; set; }
        public string LogBy { get; set; }
        public int LogById { get; set; }
        public DateTime LogDate { get; set; }
        public string PropertyName { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
        public string Details { get; set; }
    }
}
