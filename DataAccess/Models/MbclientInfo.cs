using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DataAccess.Models
{
    public partial class MbclientInfo
    {       
        public Guid MbclientId { get; set; }
        public int SiteId { get; set; }
        public string Id { get; set; }
        public int? UniqueId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Email { get; set; }
        public string MobilePhone { get; set; }
        public string MobileProvider { get; set; }
        public string HomePhone { get; set; }
        public string WorkPhone { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Gender { get; set; }
        public bool? Active { get; set; }
        public string Status { get; set; }
        public string Action { get; set; }
        public string PhotoUrl { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime? LastModifiedDateTime { get; set; }
        public bool? SendAccountEmails { get; set; }
        public bool? SendAccountTexts { get; set; }
        public bool? SendPromotionalEmails { get; set; }
        public bool? SendPromotionalTexts { get; set; }
        public bool? SendScheduleEmails { get; set; }
        public bool? SendScheduleTexts { get; set; }
        public string AppointmentGenderPreference { get; set; }
        public DateTime? FirstAppointmentDate { get; set; }
        public string IsCompany { get; set; }
        public string IsProspect { get; set; }
        public string LiabilityRelease { get; set; }
        public int? MembershipIcon { get; set; }
        public string Notes { get; set; }
        public string RedAlert { get; set; }
        public string YellowAlert { get; set; }
        public string ReferredBy { get; set; }
        public string EmergencyContactInfoName { get; set; }
        public string EmergencyContactInfoEmail { get; set; }
        public string EmergencyContactInfoPhone { get; set; }
        public string EmergencyContactInfoRelationship { get; set; }        
    }
}
