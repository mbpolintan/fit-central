namespace DataAccess.ViewModels
{
    public class ScanForBillingViewModel
    {
        public int ScanId { get; set; }
        public int MemberId { get; set; }
        public string DisplayName { get; set; }
        public int StudioId { get; set; }
        public int Quantity { get; set; }
        public string ScanType { get; set; }
        public int? ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal? BillableAmount { get; set; }
        public string PaymentType { get; set; }
        public int SiteId { get; set; }
        public string MBProductId { get; set; }
        public bool IsChallengeScan { get; set; }
        public int ChallengeNo { get; set; }        
    }
}
