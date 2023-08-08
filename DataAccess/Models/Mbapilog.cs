using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Mbapilog
    {
        public int MbapilogId { get; set; }
        public int? StudioId { get; set; }
        public int? MbsiteId { get; set; }
        public int MbwebApiid { get; set; }
        public int TotalCalls { get; set; }
        public DateTime DateSynced { get; set; }

        public virtual MbwebApi MbwebApi { get; set; }
    }
}
