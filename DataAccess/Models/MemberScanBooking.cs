using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class MemberScanBooking
    {
        public int MemberScanBookingId { get; set; }
        public int MemberId { get; set; }
        public int ChallengeId { get; set; }
        public DateTime? StartScanBookingDate { get; set; }
        public DateTime? MidScanBookingDate { get; set; }
        public DateTime? EndScanBookingDate { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Challenge Challenge { get; set; }
        public virtual Member Member { get; set; }
    }
}
