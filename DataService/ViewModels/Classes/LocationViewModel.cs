using System.Collections.Generic;

namespace DataService.ViewModels
{
    public class LocationViewModel
    {
        public List<string> AdditionalImageURLs { get; set; }
       
        public string Address { get; set; }
        public string Address2 { get; set; }
        public List<AmenitiesViewModel> Amenities { get; set; }
        public string BusinessDescription { get; set; }
        public string City { get; set; }
        public string Description { get; set; }
        public bool? HasClasses { get; set; }
        public int? Id { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string PhoneExtension { get; set; }
        public string PostalCode { get; set; }
        public int SiteId { get; set; }
        public string StateProvCode { get; set; }
        public decimal? Tax1 { get; set; }
        public decimal? Tax2 { get; set; }
        public decimal? Tax3 { get; set; }
        public decimal? Tax4 { get; set; }
        public decimal? Tax5 { get; set; }
        public byte? TotalNumberOfRatings { get; set; }
        public decimal? AverageRating { get; set; }
        public int? TotalNumberOfDeals { get; set; }
    }


}
