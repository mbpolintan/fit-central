using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PushSiteClassScheduleDow
    {
        public int PushSiteClassScheduleDowid { get; set; }
        public int? PushSiteClassScheduleId { get; set; }
        public string Day { get; set; }
        public DateTime? DateCreated { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual PushSiteClassSchedule PushSiteClassSchedule { get; set; }
    }
}
