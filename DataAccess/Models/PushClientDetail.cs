using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PushClientDetail
    {
        public int PushClientDetailId { get; set; }
        public int? ClientWebhookId { get; set; }
        public bool? IsSynced { get; set; }
        public int? SiteId { get; set; }
        public string ClientId { get; set; }
        public int? ClientUniqueId { get; set; }
        public string CreationDateTime { get; set; }
        public string Status { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string Email { get; set; }
        public string MobilePhone { get; set; }
        public string HomePhone { get; set; }
        public string WorkPhone { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
        public string BirthDateTime { get; set; }
        public string Gender { get; set; }
        public string AppointmentGenderPreference { get; set; }
        public string FirstAppointmentDateTime { get; set; }
        public string ReferredBy { get; set; }
        public bool? IsProspect { get; set; }
        public bool? IsCompany { get; set; }
        public bool? IsLiabilityRelease { get; set; }
        public string LiabilityAgreementDateTime { get; set; }
        public int? HomeLocation { get; set; }
        public int? ClientNumberOfVisitsAtSite { get; set; }
        public bool? SendAccountEmails { get; set; }
        public bool? SendAccountTexts { get; set; }
        public bool? SendPromotionalEmails { get; set; }
        public bool? SendPromotionalTexts { get; set; }
        public bool? SendScheduleEmails { get; set; }
        public bool? SendScheduleTexts { get; set; }
        public string CreditCardLastFour { get; set; }
        public DateTime? CreditCardExpDate { get; set; }
        public string DirectDebitLastFour { get; set; }
        public string Notes { get; set; }
        public DateTime? LastModifiedDateTime { get; set; }
        public string PhotoUrl { get; set; }
        public string PreviousEmail { get; set; }

        public virtual ClientWebhook ClientWebhook { get; set; }
    }
}
