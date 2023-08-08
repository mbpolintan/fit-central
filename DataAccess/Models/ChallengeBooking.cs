using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ChallengeBooking
    {
        public ChallengeBooking()
        {
            ChallengeAppointment = new HashSet<ChallengeAppointment>();
        }

        public int ChallengeBookingId { get; set; }
        public int? StudioId { get; set; }
        public int? ChallengeId { get; set; }
        public DateTime? DateTimeSlot { get; set; }
        public int? AppointmentTimeSpan { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Challenge Challenge { get; set; }
        public virtual Studio Studio { get; set; }
        public virtual ICollection<ChallengeAppointment> ChallengeAppointment { get; set; }
    }
}
