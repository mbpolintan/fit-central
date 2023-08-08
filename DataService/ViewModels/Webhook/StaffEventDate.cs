using System.Collections.Generic;

namespace DataService.ViewModels
{
    public class StaffEventDate
    {
        public int StaffId { get; set; }
        public int SiteId { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string StaffFirstName { get; set; }
        public string StaffLastName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
        public int SortOrder { get; set; }
        public bool IsIndependentContractor { get; set; }
        public bool AlwaysAllowDoubleBooking { get; set; }
        //public List<string> ProviderIds { get; set; }
        public string ImageUrl { get; set; }
        public string Biography { get; set; }
        public string Gender { get; set; }

    }
}
