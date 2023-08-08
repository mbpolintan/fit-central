using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class SyncLog
    {
        public Guid SyncLogId { get; set; }
        public DateTime DateSynced { get; set; }
        public int MbsiteId { get; set; }
        public int StudioId { get; set; }
        public int UpdatedMember { get; set; }
        public int CreatedMember { get; set; }

        public virtual Studio Studio { get; set; }
    }
}
