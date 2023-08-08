using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.ViewModels
{
    public class StudioViewModel
    {
        public int StudioId { get; set; }
        [DisplayName("Studio Name")]
        public string StudioName { get; set; }
        [DisplayName("Contact Number")]
        [RegularExpression(@"([0-9]+)", ErrorMessage = "Not a valid mobile number")]
        public string ContactNumber { get; set; }
        [DisplayName("Email Address")]
        [RegularExpression("^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$", ErrorMessage = "E-mail is not valid")]
        public string Email { get; set; }
        [DisplayName("Postal Code")]
        public string Postcode { get; set; }
        [DisplayName("Activation Code")]
        public string ActivationCode { get; set; }
        [DisplayName("Activation Link")]
        public string ActivationLink { get; set; }
        [DisplayName("Site Id")]
        public int? SiteId { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }
        [DisplayName("Challenge Scan Billing")]
        public int? ChallengeScanProductId { get; set; }
        [DisplayName("Individual Scan Billing")]
        public int? IndividualScanProductId { get; set; }
        [DisplayName("TimeZone")]
        public string TimeZoneId { get; set; }
        public bool IsMindBody { get; set; }
    }
}
