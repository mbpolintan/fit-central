using System.Collections.Generic;

namespace DataService.ViewModels
{
    public class StaffViewModel
    {
        public string Address { get; set; }
        public bool AppointmentInstructor { get; set; }
        public bool AlwaysAllowDoubleBooking { get; set; }
        public string Bio { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string HomePhone { get; set; }
        public int? Id { get; set; }
        public bool IndependentContractor { get; set; }
        public bool IsMale { get; set; }
        public string LastName { get; set; }
        public string MobilePhone { get; set; }
        public string Name { get; set; }
        public string PostalCode { get; set; }
        public bool ClassTeacher { get; set; }
        public int SortOrder { get; set; }
        public string State { get; set; }
        public string WorkPhone { get; set; }
        public string ImageUrl { get; set; }
        public bool ClassAssistant { get; set; }
        public bool ClassAssistant2 { get; set; }
    
        public List<AppointmentsViewModel> Appointments { get; set; }
        public List<UnavailabilitiesViewModel> Unavailabilities { get; set; }
        public List<AvailabilitiesViewModel> Availabilities { get; set; }
    }



}
