using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models
{
    public partial class VwChallegeScans
    {
        public int? ChallengeMemberId { get; set; }
        public int? MemberId { get; set; }
        public int? ChallengeNo { get; set; }
        public string DisplayName { get; set; }
        public int? StudioId { get; set; }
        public DateTime? StartTestDate { get; set; }
        public int? StartScanId { get; set; }
        public DateTime? MidTestDate { get; set; }
        public int? MidScanId { get; set; }
        public DateTime? EndTestDate { get; set; }
        public int? EndScanId { get; set; }
        public byte BillStatus { get; set; }
    }
}
