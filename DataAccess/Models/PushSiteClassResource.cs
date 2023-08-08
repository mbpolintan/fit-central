using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PushSiteClassResource
    {
        public int PushSiteClassResourceId { get; set; }
        public int PushSiteClassId { get; set; }
        public int? Id { get; set; }
        public string Name { get; set; }
        public DateTime? DateCreated { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual PushSiteClass PushSiteClass { get; set; }
    }
}
