using System;

namespace DataAccess.ViewModels
{
    public class UnsycnedClientMembership
    {
        public int PushClientMembershipId { get; set; }
        public int ClientWebhookId { get; set; }
        public bool IsSynced { get; set; }
        public int? SiteId { get; set; }
        public string ClientId { get; set; }
        public int? ClientUniqueId { get; set; }
        public string ClientFirstName { get; set; }
        public string ClientLastName { get; set; }
        public string ClientEmail { get; set; }
        public int MembershipId { get; set; }
        public string MembershipName { get; set; }
        public string EventId { get; set; }
        public DateTime EventInstanceOriginationDateTime { get; set; }
    }

}
