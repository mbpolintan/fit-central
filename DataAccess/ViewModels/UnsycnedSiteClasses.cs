using System;

namespace DataAccess.ViewModels
{
    public class UnsycnedSiteClasses
    {
        public int PushSiteClassId { get; set; }
        public int ClientWebhookId { get; set; }
        public bool? IsSynced { get; set; }
        public int? SiteId { get; set; }
        public int? LocationId { get; set; }
        public int? ClassId { get; set; }
        public int? ClassScheduleId { get; set; }
        public bool? IsCancelled { get; set; }
        public bool? IsStaffAsubstitute { get; set; }
        public bool? IsWaitlistAvailable { get; set; }
        public bool? IsIntendedForOnlineViewing { get; set; }
        public int? StaffId { get; set; }
        public string StaffName { get; set; }
        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public int? ClassDescriptionId { get; set; }
        public int? AssistantOneId { get; set; }
        public string AssistantOneName { get; set; }
        public int? AssistantTwoId { get; set; }
        public string AssistantTwoName { get; set; }
        public DateTime? DateCreated { get; set; }
        public byte[] TimeStamp { get; set; }
        public string EventId { get; set; }
        public DateTime EventInstanceOriginationDateTime { get; set; }
    }


}
