using System.Collections.Generic;

namespace DataAccess.ViewModels
{
    public class SubscriptionViewModel
    {
        public string SubscriptionId { get; set; }
        public string Status { get; set; }
        public string SubscriptionCreationDateTime { get; set; }
        public string StatusChangeDate { get; set; }
        public string StatusChangeMessage { get; set; }
        public string StatusChangeUser { get; set; }
        public List<string> EventIds { get; set; }
        public decimal EventSchemaVersion { get; set; }
        public string ReferenceId { get; set; }
        public string WebhookUrl { get; set; }
        public string MessageSignatureKey { get; set; }

    }
}
