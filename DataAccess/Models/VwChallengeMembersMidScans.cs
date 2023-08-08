using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class VwChallengeMembersMidScans
    {
        public int ChallengeMemberId { get; set; }
        public int MemberId { get; set; }
        public int? MidScanId { get; set; }
        public int? ScansImportId { get; set; }
        public int ChallengeId { get; set; }
    }
}
