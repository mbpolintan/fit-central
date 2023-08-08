using System;

namespace DataService.ViewModels
{
    public class BookingWindowViewModel
    {
        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public DateTime? DailyStartTime { get; set; }
        public DateTime? DailyEndTime { get; set; }
    }

}
