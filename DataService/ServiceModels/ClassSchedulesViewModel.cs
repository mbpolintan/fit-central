using DataAccess.Models;
using DataService.ViewModels;
using System.Collections.Generic;

namespace DataService.ServiceModels
{
    public class ClassSchedulesViewModel
    {
        public List<ClassesViewModel> Classes { get; set; }
        public List<MbclientInfo> Clients { get; set; }
        public CourseViewModel Course { get; set; }
        public int? SemesterId { get; set; }
        public bool IsAvailable { get; set; }
        public int Id { get; set; }
        public ClassDescriptionViewModel ClassDescription { get; set; }
        public bool DaySunday { get; set; }
        public bool DayMonday { get; set; }
        public bool DayTuesday { get; set; }
        public bool DayWednesday { get; set; }
        public bool DayThursday { get; set; }
        public bool DayFriday { get; set; }       
        public bool DaySaturday { get; set; }
        public bool AllowOpenEnrollment { get; set; }         
        public bool AllowDateForwardEnrollment { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public StaffViewModel Staff { get; set; }
        public LocationViewModel Location { get; set; }
    }
}
