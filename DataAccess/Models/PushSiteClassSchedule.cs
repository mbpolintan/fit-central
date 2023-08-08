using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PushSiteClassSchedule
    {
        public PushSiteClassSchedule()
        {
            PushSiteClassScheduleDow = new HashSet<PushSiteClassScheduleDow>();
        }

        public int PushSiteClassScheduleId { get; set; }
        public int ClientWebhookId { get; set; }
        public bool? IsSynced { get; set; }
        public int? SiteId { get; set; }
        public int? LocationId { get; set; }
        public int? ClassScheduleId { get; set; }
        public int? ClassDescriptionId { get; set; }
        public int? MaxCapacity { get; set; }
        public int? WebCapacity { get; set; }
        public int? StaffId { get; set; }
        public string StaffName { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int? AssistantOneId { get; set; }
        public string AssistantOneName { get; set; }
        public int? AssistantTwoId { get; set; }
        public string AssistantTwoName { get; set; }
        public DateTime? DateCreated { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ClientWebhook ClientWebhook { get; set; }
        public virtual ICollection<PushSiteClassScheduleDow> PushSiteClassScheduleDow { get; set; }
    }
}

