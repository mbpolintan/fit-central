using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class SentItem
    {
        public SentItem()
        {
            Recipient = new HashSet<Recipient>();
        }

        public int SentItemId { get; set; }
        public int? StudioId { get; set; }
        public int? MessageTypeId { get; set; }
        public string Subject { get; set; }
        public string BodyContentType { get; set; }
        public string BodyContent { get; set; }
        public int? SenderUserId { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual MessageType MessageType { get; set; }
        public virtual AppUser SenderUser { get; set; }
        public virtual Studio Studio { get; set; }
        public virtual ICollection<Recipient> Recipient { get; set; }
    }
}
