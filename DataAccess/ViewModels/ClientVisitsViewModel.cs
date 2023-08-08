using System;

namespace DataAccess.ViewModels
{
    public class ClientVisitsViewModel
    {
        public int MbclientVisitId { get; set; }
        public int? Id { get; set; }
        public string ClientId { get; set; }
        public int? ClientUniqueId { get; set; }
        public int? ClassId { get; set; }
        public int? SiteId { get; set; }
        public int? LocationId { get; set; }
        public int? AppointmentId { get; set; }
        public int? ServiceId { get; set; }
        public int? ProductId { get; set; }
        public int? StaffId { get; set; }
        public string StaffName { get; set; }
        public string AppointmentGenderPreference { get; set; }
        public string AppointmentStatus { get; set; }
        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public DateTime? LastModifiedDateTime { get; set; }
        public string LateCancelled { get; set; }
        public string MakeUp { get; set; }
        public string Name { get; set; }
        public string ServiceName { get; set; }
        public string SignedIn { get; set; }
        public string WebSignup { get; set; }
        public string Action { get; set; }
        public string SignedInStatus { get; set; }
        public int? MaxCapacity { get; set; }
        public int? WebCapacity { get; set; }
        public int? TotalBooked { get; set; }
        public int? WebBooked { get; set; }
        public int? TotalWaitlisted { get; set; }
        public string ClientPassId { get; set; }
        public int? ClientPassSessionsTotal { get; set; }
        public int? ClientPassSessionsDeducted { get; set; }
        public int? ClientPassSessionsRemaining { get; set; }
        public DateTime? ClientPassActivationDateTime { get; set; }
        public DateTime? ClientPassExpirationDateTime { get; set; }
        public bool? BookingOriginatedFromWaitlist { get; set; }
        public int? ClientsNumberOfVisitsAtSite { get; set; }
        public int? ItemSiteId { get; set; }

        public string DisplayName { get; set; }
        public int? MemberStatusId { get; set; }
     
        public int StudioId { get; set; }
        public string Time { get; set; }
        public string Description { get; set; }
        public string Teacher { get; set; }
        public string Status { get; set; }
        public string PaymentInfo { get; set; }
      
    }
}
