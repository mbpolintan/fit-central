using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class VwIndividualScansBillable
    {
        public int ScanId { get; set; }
        public int? MemberId { get; set; }
        public int? StudioId { get; set; }
        public DateTime? TestDateTime { get; set; }
    }
}
