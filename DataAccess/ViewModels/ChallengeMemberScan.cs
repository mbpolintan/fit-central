namespace DataAccess.ViewModels
{
    public class ChallengeMemberScanViewModel
    {
        public int ChallengeId { get; set; }
        public int ChallengeMemberId { get; set; }
        public int MemberId { get; set; }
        public string DisplayName { get; set; }
        public int? ImageScore { get; set; }
        public int IsBilled { get; set; }
        public decimal? SWeight { get; set; }
        public decimal? MWeight { get; set; }
        public decimal? EWeight { get; set; }
        public decimal? SInBodyScore { get; set; }
        public decimal? MInBodyScore { get; set; }
        public decimal? EInBodyScore { get; set; }
        public decimal? SPBF { get; set; }
        public decimal? MPBF { get; set; }
        public decimal? EPBF { get; set; }
        public int? SVFL { get; set; }
        public int? MVFL { get; set; }
        public int? EVFL { get; set; }
        public decimal? SSMM { get; set; }
        public decimal? MSMM { get; set; }
        public decimal? ESMM { get; set; }
    }
}
