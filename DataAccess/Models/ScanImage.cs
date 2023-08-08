using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ScanImage
    {
        public int ScanImageId { get; set; }
        public int MemberId { get; set; }
        public int ChallengeMemberId { get; set; }
        public byte[] BeforeFrontImage { get; set; }
        public byte[] BeforeSideImage { get; set; }
        public byte[] BeforeBackImage { get; set; }
        public byte[] AfterFrontImage { get; set; }
        public byte[] AfterSideImage { get; set; }
        public byte[] AfterBackImage { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ChallengeMember ChallengeMember { get; set; }
        public virtual AppUser CreatedBy { get; set; }
        public virtual Member Member { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
    }
}
