using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ChallengeMember
    {
        public ChallengeMember()
        {
            ScanImage = new HashSet<ScanImage>();
        }

        public int ChallengeMemberId { get; set; }
        public int ChallengeId { get; set; }
        public int MemberId { get; set; }
        public int? StartScanId { get; set; }
        public int? MidScanId { get; set; }
        public int? EndScanId { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }
        public int? PaymentTransactionId { get; set; }
        public int ImageScore { get; set; }

        public virtual Challenge Challenge { get; set; }
        public virtual AppUser CreatedBy { get; set; }
        public virtual Scan EndScan { get; set; }
        public virtual Member Member { get; set; }
        public virtual Scan MidScan { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
        public virtual PaymentTransaction PaymentTransaction { get; set; }
        public virtual Scan StartScan { get; set; }
        public virtual ICollection<ScanImage> ScanImage { get; set; }
    }
}
