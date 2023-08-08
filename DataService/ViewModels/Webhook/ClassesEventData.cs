using System;
using System.Collections.Generic;

namespace DataService.ViewModels
{
    public class ClassesEventData
    {
        public int SiteId { get; set; }      
        public int LocationId { get; set; }
        public int ClassId { get; set; }
        public int ClassScheduleId { get; set; }
        public bool IsCanceled { get; set; }
        public bool IsStaffASubstitute { get; set; }
        public bool IsWaitlistAvailable { get; set; }               
        public bool IsIntendedForOnlineViewing { get; set; }
        public int StaffId { get; set; }
        public string StaffName { get; set; }
        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public int ClassDescriptionId { get; set; }
        public int? AssistantOneId { get; set; }   
        public string AssistantOneName { get; set; }
        public int? AssistantTwoId { get; set; }
        public string AssistantTwoName { get; set; }
        public List<ResourceViewModel> Resources { get; set; }       
       
    }
}
