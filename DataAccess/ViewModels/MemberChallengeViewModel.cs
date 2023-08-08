namespace DataAccess.ViewModels
{
    public class MemberChallengeViewModel
    {
        public int ChallengeMemberId { get; set; }
        public int ChallengeNo { get; set; }
        public int ChallengeId { get; set; } 
        public int ChallengeTypeId { get; set; }
        public string Type { get; set; }
        public int StartScanId  { get; set; }
        public string StartScanDates { get; set; }
        public string MidScanDates { get; set; }
        public string EndScanDates { get; set; }
        public int MidScanId { get; set; }
        public int FinalScanId { get; set; }

    }
}
