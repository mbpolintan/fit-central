using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class MbclassSchedule
    {
        public MbclassSchedule()
        {
            MbclassScheduleResource = new HashSet<MbclassScheduleResource>();
        }

        public int MbclassScheduleId { get; set; }
        public int? SiteId { get; set; }
        public int? LocationId { get; set; }
        public int? ClassScheduleId { get; set; }
        public int? ClassDescriptionId { get; set; }
        public int? MaxCapacity { get; set; }
        public int? WebCapacity { get; set; }
        public int? StaffId { get; set; }
        public string StaffName { get; set; }
        public bool? IsActive { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int? AssistantOneId { get; set; }
        public string AssistantOneName { get; set; }
        public int? AssistantTwoId { get; set; }
        public string AssistantTwoName { get; set; }
        public string DaysOfWeek { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ICollection<MbclassScheduleResource> MbclassScheduleResource { get; set; }
    }
}
