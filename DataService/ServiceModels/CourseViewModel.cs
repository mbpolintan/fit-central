using DataService.ViewModels;

namespace DataService.ServiceModels
{
    public class CourseViewModel
    {       
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public LocationViewModel Location { get; set; }
        public StaffViewModel Organizer { get; set; }
        public ProgramViewModel Program { get; set; }       
        public string ImageUrl { get; set; }
       
    }
}
