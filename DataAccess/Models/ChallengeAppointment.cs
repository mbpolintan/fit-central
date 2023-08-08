using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ChallengeAppointment
    {
        public int ChallengeAppointmentId { get; set; }
        public int? ChallengeBookingId { get; set; }
        public int? MemberId { get; set; }
        public DateTime? AppointmentTimeSlot { get; set; }
        public bool? IsAvailable { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ChallengeBooking ChallengeBooking { get; set; }
        public virtual Member Member { get; set; }
    }
}
