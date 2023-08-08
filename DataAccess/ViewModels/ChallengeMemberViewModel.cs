namespace DataAccess.ViewModels
{
    public class ChallengeMemberViewModel
    {
        public int ChallengeMemberId { get; set; }       
        public int ChallengeId { get; set; }
        public int MemberId { get; set; }
        public string DisplayName { get; set; }
        public int MbuniqueId { get; set; }
        public string Mbid { get; set; }
        public bool IsStartScanBooked { get; set; }
        public bool IsMidScanBooked { get; set; }
        public bool IsEndScanBooked { get; set; }
        public bool IsAvailableStartScan { get; set; }
        public bool IsAvailableMidScan { get; set; }
        public bool IsAvailableEndScan { get; set; }
        public bool IsAvailableBeforePhoto { get; set; }
        public bool IsAvailableAfterPhoto { get; set; }
        public int IsBilled { get; set; }


        //public int? StartScanId { get; set; }
        //public int? MidScanId { get; set; }
        //public int? EndScanId { get; set; }
        //public int CreatedById { get; set; }       
        //public int ImageScore { get; set; }
        //public int IsBilled { get; set; }

    } 
}
