using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PushSiteClassDescription
    {
        public int PushSiteClassDescriptionId { get; set; }
        public int ClientWebhookId { get; set; }
        public bool? IsSynced { get; set; }
        public int? SiteId { get; set; }
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime? DateCreated { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ClientWebhook ClientWebhook { get; set; }
    }
}
