using System;

namespace DataService.ViewModels
{
    public class ClassBookingEventData
    {
        public int SiteId { get; set; }
        public int LocationId { get; set; }
        public int ClassId { get; set; }
        public int ClassRosterBookingId { get; set; }
        public DateTime? ClassStartDateTime { get; set; }
        public DateTime? ClassEndDateTime { get; set; }
        public string SignedInStatus { get; set; }
        public int StaffId { get; set; }
        public string StaffName { get; set; }
        public int MaxCapacity { get; set; }
        public int WebCapacity { get; set; }
        public int TotalBooked { get; set; }
        public int WebBooked { get; set; }
        public int TotalWaitlisted { get; set; }
        public string ClientId { get; set; }
        public int ClientUniqueId { get; set; }     
        public string ClientFirstName { get; set; }
        public string ClientLastName { get; set; }
        public string ClientEmail { get; set; }
        public string ClientPhone { get; set; }
        public string ClientPassId { get; set; }
        public int? ClientPassSessionsTotal { get; set; }
        public int? ClientPassSessionsDeducted { get; set; }
        public int? ClientPassSessionsRemaining { get; set; }
        public DateTime? ClientPassActivationDateTime { get; set; }
        public DateTime? ClientPassExpirationDateTime { get; set; }
        public bool? BookingOriginatedFromWaitlist { get; set; }
        public int? ClientsNumberOfVisitsAtSite { get; set; }
        public int? ItemId { get; set; }
        public string ItemName { get; set; }
        public int? ItemSiteId { get; set; }

    }


}
