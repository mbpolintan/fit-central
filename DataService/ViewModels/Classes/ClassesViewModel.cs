using DataAccess.Models;
using System;
using System.Collections.Generic;

namespace DataService.ViewModels
{
    public class ClassesViewModel
    {
        public int ClassScheduleId { get; set; }
        //public List<MbclientVisits> Visits { get; set; }
        //public List<MbclientInfo> Clients { get; set; }
        public LocationViewModel Location { get; set; }
        public ResourceViewModel Resource { get; set; }
        public int? MaxCapacity { get; set; }
        public int? WebCapacity { get; set; }
        public int? TotalBooked { get; set; }
        public int? TotalBookedWaitlist { get; set; }
        public int? WebBooked { get; set; }
        public int? SemesterId { get; set; }
        public bool? IsCanceled { get; set; }
        public bool? Substitute { get; set; }
        public bool? Active { get; set; }
        public bool? IsWaitlistAvailable { get; set; }
        public bool? IsEnrolled { get; set; }
        public bool? HideCancel { get; set; }
        public int Id { get; set; }
        public bool? IsAvailable { get; set; }
        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public DateTime? LastModifiedDateTime { get; set; }
        public ClassDescriptionViewModel ClassDescription { get; set; }
        public StaffViewModel Staff { get; set; }
        public BookingWindowViewModel BookingWindow { get; set; }
        public string BookingStatus { get; set; }
        public string VirtualStreamLink { get; set; }
    }
}
