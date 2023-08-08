using System;

namespace DataAccess.ViewModels
{
    public class ScansBillableViewModel
    {
        public int ScanId { get; set; }
        public int? MemberId { get; set; }
        public int? StudioId { get; set; }
        public DateTime? TestDateTime { get; set; }
    }
}
