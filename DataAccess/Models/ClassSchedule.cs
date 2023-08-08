using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ClassSchedule
    {
        public int ScclassScheduleId { get; set; }
        public int StudioId { get; set; }
        public int? Id { get; set; }
        public int? SemesterId { get; set; }
        public bool? IsAvailable { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public bool? DaySunday { get; set; }
        public bool? DayMonday { get; set; }
        public bool? DayTuesday { get; set; }
        public bool? DayWednesday { get; set; }
        public bool? DayThursday { get; set; }
        public bool? DayFriday { get; set; }
        public bool? DaySaturday { get; set; }
        public bool? AllowOpenEnrollment { get; set; }
        public bool? AllowDateForwardEnrollment { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Studio Studio { get; set; }
    }
}
