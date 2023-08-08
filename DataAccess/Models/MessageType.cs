using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class MessageType
    {
        public MessageType()
        {
            Inbox = new HashSet<Inbox>();
            SentItem = new HashSet<SentItem>();
        }

        public int MessageTypeId { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ICollection<Inbox> Inbox { get; set; }
        public virtual ICollection<SentItem> SentItem { get; set; }
    }
}
