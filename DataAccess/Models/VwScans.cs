using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class VwScans
    {
        public int? StudioId { get; set; }
        public int? Age { get; set; }
        public string Gender { get; set; }
        public int ChallengeId { get; set; }
        public int ChallengeMemberId { get; set; }
        public int? MemberId { get; set; }
        public string DisplayName { get; set; }
        public int? ChallengeNo { get; set; }
        public int? AttendedClass { get; set; }
        public int ImageScore { get; set; }
        public decimal? MidInBodyTotal { get; set; }
        public decimal? MidWeightTotal { get; set; }
        public decimal? MidPbftotal { get; set; }
        public int? MidVfltotal { get; set; }
        public decimal? MidSmmtotal { get; set; }
        public decimal? EndInBodyTotal { get; set; }
        public decimal? EndWeightTotal { get; set; }
        public decimal? EndPbftotal { get; set; }
        public int? EndVfltotal { get; set; }
        public decimal? EndSmmtotal { get; set; }
        public int WithMidScan { get; set; }
        public int WithEndScan { get; set; }

    }
}
