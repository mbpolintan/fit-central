using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class VwScanBillable
    {
        public int? MemberId { get; set; }
        public string DisplayName { get; set; }
        public int? StudioId { get; set; }
        public int? Billed { get; set; }
        public int? ForBilling { get; set; }
        public int? Ingnored { get; set; }
    }
}
