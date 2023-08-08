using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class VwChallengeMembers
    {
        public int ChallengeId { get; set; }
        public int ChallengeMemberId { get; set; }
        public int? ChallengeNo { get; set; }
        public int MemberId { get; set; }
        public string Mbid { get; set; }
        public int? MbuniqueId { get; set; }
        public string DisplayName { get; set; }
        public int? StudioId { get; set; }
        public int? SiteId { get; set; }
        public int? StartScanId { get; set; }
        public int? MidScanId { get; set; }
        public int? EndScanId { get; set; }
        public byte? BillStatus { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? StartScanFromDate { get; set; }
        public DateTime? StartScanToDate { get; set; }
        public DateTime? MidScanFromDate { get; set; }
        public DateTime? MidScanToDate { get; set; }
        public DateTime? EndScanFromDate { get; set; }
        public DateTime? EndScanToDate { get; set; }
    }
}
