using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class VwChallengeAppointment
    {
        public int ChallengeAppointmentId { get; set; }
        public int? ChallengeBookingId { get; set; }
        public int? ChallengeId { get; set; }
        public int? StudioId { get; set; }
        public int? MemberId { get; set; }
        public bool? IsAvailable { get; set; }
        public int? ScanTypeId { get; set; }
        public string TypeDescription { get; set; }
    }
}
