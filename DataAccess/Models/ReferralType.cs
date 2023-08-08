using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ReferralType
    {
        public int ReferralTypeId { get; set; }
        public int StudioId { get; set; }
        public string Description { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }
    }
}
