namespace DataAccess.ViewModels
{
    public class ChallengeScanImageViewModel
    {
        public int MemberId { get; set; }
        public int ChallengeMemberId { get; set; }
        public string BeforeFrontImage { get; set; }
        public string BeforeSideImage { get; set; }
        public string BeforeBackImage { get; set; }
        public string AfterFrontImage { get; set; }
        public string AfterSideImage { get; set; }
        public string AfterBackImage { get; set; }

    }
}
