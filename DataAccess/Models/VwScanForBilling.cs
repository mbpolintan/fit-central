using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class VwScanForBilling
    {
        public int? MemberId { get; set; }
        public string DisplayName { get; set; }
        public int? StudioId { get; set; }
        public string PaymentType { get; set; }
        public int? ForBillingChallenge { get; set; }
        public decimal? TotalChallengeScanPrice { get; set; }
        public int? ForBillingIndividual { get; set; }
        public decimal? TotalIndividualScanPrice { get; set; }
    }
}
