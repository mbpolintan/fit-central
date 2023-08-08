using System.Collections.Generic;

namespace DataService.ViewModels
{
    public partial class ClientViewModel
    {
       // public string AppointmentGenderPreference { get; set; }
        public string BirthDate { get; set; }
        public string CreationDate { get; set; }
        //public List<string> CustomClientFields { get; set; }
        //public ClientCreditCard ClientCreditCard { get; set; }
        //public List<AssignedClientIndex> ClientIndexes { get; set; } // Contains the IDs of the client’s assigned ClientIndexes and ClientIndexValues. See AssignedClientIndex for a description of the AssignedClientIndex information
        //public List<ClientRelationship> ClientRelationships { get; set; } //Contains information about the relationship between two clients. See ClientRelationship for a description of the ClientRelationship information.
        //public string FirstAppointmentDate { get; set; }
        public string FirstName { get; set; }
        public string Id { get; set; }
        //public bool IsCompany { get; set; }
        //public bool IsProspect { get; set; }
        public string LastName { get; set; }
        //public Liability Liability { get; set; }
        //public bool LiabilityRelease { get; set; }
        //public int MembershipIcon { get; set; }
        //public string Notes { get; set; }
        //public bool SendAccountEmails { get; set; }
        //public bool SendAccountTexts { get; set; }
        //public bool SendPromotionalEmails { get; set; }
        //public bool SendPromotionalTexts { get; set; }
        //public bool SendScheduleEmails { get; set; }
        //public bool SendScheduleTexts { get; set; }
        public string State { get; set; }
        public int UniqueId { get; set; }
        public string LastModifiedDateTime { get; set; }
        //public string RedAlert { get; set; }
        //public string YellowAlert { get; set; }
        //public string MiddleName { get; set; }
        //public ProspectStage ProspectStage { get; set; }
        public string Email { get; set; }
        //public string MobileProvider { get; set; }
        public string MobilePhone { get; set; }
        public string HomePhone { get; set; }
        public string WorkPhone { get; set; }
        //public float AccountBalance { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        //public string WorkExtension { get; set; }
        public string ReferredBy { get; set; }
        //public string PhotoUrl { get; set; }
        public string EmergencyContactInfoName { get; set; }
        public string EmergencyContactInfoEmail { get; set; }
        public string EmergencyContactInfoPhone { get; set; }
        public string EmergencyContactInfoRelationship { get; set; }
        public string Gender { get; set; }
        //public string LastFormulaNotes { get; set; }
        public bool Active { get; set; }
        //public SalesRep SalesRep { get; set; }
        public string Status { get; set; }
        public string Action { get; set; }

        public string Message { get; set; }
    }
}
