using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class ContractsViewModel
    {
        public int Id { get; set; }
        public int? SiteId { get; set; }
        public string ClientId { get; set; }
        public int? OriginationLocationId { get; set; }
        public string ContractName { get; set; }
        public DateTime? AgreementDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string AutopayStatus { get; set; }
    }

    public class ChallengeSetup
    {
        public int ChallengeId { get; set; }
        [DisplayName("Challenge Number")]
        public int ChallengeNo { get; set; }
        [DisplayName("Start Date")]
        public DateTime StartDate { get; set; }
        [DisplayName("End Date")]
        public DateTime EndDate { get; set; }
        [DisplayName("Start Scan From Date")]
        public DateTime? StartScanFromDate { get; set; }
        [DisplayName("Start Scan To Date")]
        public DateTime? StartScanToDate { get; set; }
        [DisplayName("Mid Scan From Date")]
        public DateTime? MidScanFromDate { get; set; }
        [DisplayName("Mid Scan To Date")]
        public DateTime? MidScanToDate { get; set; }
        [DisplayName("End Scan From Date")]
        public DateTime? EndScanFromDate { get; set; }
        [DisplayName("End Scan To Date")]
        public DateTime? EndScanToDate { get; set; }
        public int ScoringSystemId { get; set; }
        public int ImageScore { get; set; }

    }

}
