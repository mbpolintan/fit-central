using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PushSiteLocation
    {
        public int PushSiteLocationId { get; set; }
        public int ClientWebhookId { get; set; }
        public bool? IsSynced { get; set; }
        public int? SiteId { get; set; }
        public int? LocationId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool? HasClasses { get; set; }
        public string PhoneExtension { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Phone { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public decimal? Tax1 { get; set; }
        public decimal? Tax2 { get; set; }
        public decimal? Tax3 { get; set; }
        public decimal? Tax4 { get; set; }
        public decimal? Tax5 { get; set; }
        public string WebColor5 { get; set; }
        public DateTime? DateCreated { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ClientWebhook ClientWebhook { get; set; }
    }
}
