using System;

namespace DataService.ViewModels
{
    public class BaseWebhookModel
    {
        public string EventId { get; set; }
        public decimal EventSchemaVersion { get; set; }
        public DateTime EventInstanceOriginationDateTime { get; set; }
        public string MessageId { get; set; }
    }
}
