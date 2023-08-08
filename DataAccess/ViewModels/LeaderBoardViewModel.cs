namespace DataAccess.ViewModels
{
    public class LeaderBoardViewModel
    {
        public int MemberId { get; set; }
        public string DisplayName { get; set; }
        public string? InitialScan { get; set; }
        public string? MidScan { get; set; }
        public string? FinalScan { get; set; }

        public int? InitialScanId { get; set; }
        public int? MidScanId { get; set; }
        public int? FinalScanId { get; set; }
        public string TotalScan { get; set; }        

    }
}
