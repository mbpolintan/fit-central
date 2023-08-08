using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ClientWebhook
    {
        public ClientWebhook()
        {
            PushClientClassBooking = new HashSet<PushClientClassBooking>();
            PushClientContract = new HashSet<PushClientContract>();
            PushClientDetail = new HashSet<PushClientDetail>();
            PushClientMembership = new HashSet<PushClientMembership>();
            PushClientSale = new HashSet<PushClientSale>();
            PushSiteClass = new HashSet<PushSiteClass>();
            PushSiteClassDescription = new HashSet<PushSiteClassDescription>();
            PushSiteClassSchedule = new HashSet<PushSiteClassSchedule>();
            PushSiteLocation = new HashSet<PushSiteLocation>();
            PushSiteStaff = new HashSet<PushSiteStaff>();
        }

        public int ClientWebhookId { get; set; }
        public string EventId { get; set; }
        public decimal? EventSchemaVersion { get; set; }
        public DateTime? EventInstanceOriginationDateTime { get; set; }
        public string MessageId { get; set; }

        public virtual ICollection<PushClientClassBooking> PushClientClassBooking { get; set; }
        public virtual ICollection<PushClientContract> PushClientContract { get; set; }
        public virtual ICollection<PushClientDetail> PushClientDetail { get; set; }
        public virtual ICollection<PushClientMembership> PushClientMembership { get; set; }
        public virtual ICollection<PushClientSale> PushClientSale { get; set; }
        public virtual ICollection<PushSiteClass> PushSiteClass { get; set; }
        public virtual ICollection<PushSiteClassDescription> PushSiteClassDescription { get; set; }
        public virtual ICollection<PushSiteClassSchedule> PushSiteClassSchedule { get; set; }
        public virtual ICollection<PushSiteLocation> PushSiteLocation { get; set; }
        public virtual ICollection<PushSiteStaff> PushSiteStaff { get; set; }
    }
}
