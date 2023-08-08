using System.Collections.Generic;

namespace DataService.ViewModels
{
    public class AppointmentsViewModel
    {
        public string GenderPreference { get; set; }
        public int Duration { get; set; }
        public string ProviderId { get; set; }
        public int Id { get; set; }
        public string Status { get; set; }
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
        public string Notes { get; set; }
        public bool StaffRequested { get; set; }
        public int ProgramId { get; set; }
        public int SessionTypeId { get; set; }
        public List<ResourceViewModel> Resources { get; set; }
        public List<AddOnsViewModel> AddOns { get; set; }
    }

}
