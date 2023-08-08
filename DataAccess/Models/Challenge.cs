using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace DataAccess.Models
{
    public partial class Challenge
    {
        public Challenge()
        {
            ChallengeBooking = new HashSet<ChallengeBooking>();
            ChallengeMember = new HashSet<ChallengeMember>();
            ChallengeStudio = new HashSet<ChallengeStudio>();
            MemberScanBooking = new HashSet<MemberScanBooking>();
        }

        public int ChallengeId { get; set; }
        [DisplayName("Challenge Number")]
        public int ChallengeNo { get; set; }
        [DisplayName("Start Date")]
        public DateTime StartDate { get; set; }
        [DisplayName("End Date")]
        public DateTime EndDate { get; set; }
        [DisplayName("Start Scan From Date")]
        public DateTime? StartScanFromDate { get; set; }
        [DisplayName("Start Scan To Date")]
        public DateTime? StartScanToDate { get; set; }
        [DisplayName("Mid Scan From Date")]
        public DateTime? MidScanFromDate { get; set; }
        [DisplayName("Mid Scan To Date")]
        public DateTime? MidScanToDate { get; set; }
        [DisplayName("End Scan From Date")]
        public DateTime? EndScanFromDate { get; set; }
        [DisplayName("End Scan To Date")]
        public DateTime? EndScanToDate { get; set; }
        public DateTime DateCreated { get; set; }
        public int CreatedById { get; set; }
        public DateTime? DateModified { get; set; }
        public int? ModifiedById { get; set; }
        public byte[] TimeStamp { get; set; }
        public int GlobalTrainingGymId { get; set; }

        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }

        public virtual ICollection<ChallengeBooking> ChallengeBooking { get; set; }
        public virtual ICollection<ChallengeMember> ChallengeMember { get; set; }     
        public virtual ICollection<ChallengeStudio> ChallengeStudio { get; set; }
        public virtual ICollection<MemberScanBooking> MemberScanBooking { get; set; }
    }
}
