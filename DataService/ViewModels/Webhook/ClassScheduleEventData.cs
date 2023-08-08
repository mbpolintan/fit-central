using System;
using System.Collections.Generic;

namespace DataService.ViewModels
{
    public class ClassScheduleEventData
    {
        public int SiteId { get; set; }
        public int LocationId { get; set; }
        public int ClassScheduleId { get; set; }
        public int ClassDescriptionId { get; set; }
        public List<Resource> Resources { get; set; }
        public int MaxCapacity { get; set; }
        public int WebCapacity { get; set; }
        public int StaffId { get; set; }
        public string StaffName { get; set; }
        public bool IsActive { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public List<string> DaysOfWeek { get; set; }
        public int? AssistantOneId { get; set; }
        public string AssistantOneName { get; set; }
        public int? AssistantTwoId { get; set; }
        public string AssistantTwoName { get; set; }
    }


}
