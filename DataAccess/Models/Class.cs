using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Class
    {
        public Class()
        {
            ClassStaff = new HashSet<ClassStaff>();
        }

        public int ScclassId { get; set; }
        public int StudioId { get; set; }
        public int? MbclassScheduleId { get; set; }
        public int? MblocationId { get; set; }
        public int? MbresourceId { get; set; }
        public int? MbclassDescriptionId { get; set; }
        public int? MbstaffId { get; set; }
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
        public int? Id { get; set; }
        public bool? IsAvailable { get; set; }
        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public DateTime? LastModifiedDateTime { get; set; }
        public DateTime? BookingWindowStartDateTime { get; set; }
        public DateTime? BookingWindowEndDateTime { get; set; }
        public DateTime? BookingWindowDailyStartTime { get; set; }
        public DateTime? BookingWindowDailyEndTime { get; set; }
        public string BookingStatus { get; set; }
        public string VirtualStreamLink { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Studio Studio { get; set; }
        public virtual ICollection<ClassStaff> ClassStaff { get; set; }
    }
}
