using System.Collections.Generic;

namespace DataService.ViewModels
{
    public class ProgramViewModel
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string ScheduleType { get; set; }
        public int CancelOffset { get; set; }
        public string[] ContentFormats { get; set; }
    }


}
