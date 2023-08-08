using System;
using System.ComponentModel;

namespace DataAccess.ViewModels
{
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

    }

}
