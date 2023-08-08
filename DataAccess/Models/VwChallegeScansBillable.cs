using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class VwChallegeScansBillable
    {
        public int ScanId { get; set; }
        public int? MemberId { get; set; }
        public int? StudioId { get; set; }
        public DateTime? TestDateTime { get; set; }
        public int? ChallengeNo { get; set; }
    }
}
