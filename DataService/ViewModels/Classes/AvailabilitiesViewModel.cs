namespace DataService.ViewModels
{
    public class AvailabilitiesViewModel
    {       
        public int Id { get; set; }
        public StaffViewModel Staff { get; set; }
        public SessionTypeViewModel SessionType { get; set; }
        public ProgramViewModel Program { get; set; }
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
        public string BookableEndDateTime { get; set; }
        public LocationViewModel Location { get; set; }     
    }



}
