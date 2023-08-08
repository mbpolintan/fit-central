namespace DataService.ViewModels
{
    public class SyncVisitsParamViewModel
    {
        public int Offset { get; set; }
        public string SiteId { get; set; }
        public string ClientId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int StudioId { get; set; }
        public string Token { get; set; }
        public int Retry { get; set; }
    }
}
