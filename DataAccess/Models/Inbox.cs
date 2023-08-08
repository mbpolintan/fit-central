using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Inbox
    {
        public int InboxId { get; set; }
        public int? StudioId { get; set; }
        public int? MessageTypeId { get; set; }
        public string Subject { get; set; }
        public string BodyContentType { get; set; }
        public string BodyContent { get; set; }
        public bool? IsRead { get; set; }
        public bool IsAnonymousSender { get; set; }
        public DateTime? ReceivedDateTime { get; set; }
        public DateTime? SentDateTime { get; set; }
        public string SenderName { get; set; }
        public string SenderEmail { get; set; }
        public string SenderMobilePhone { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual MessageType MessageType { get; set; }
        public virtual Studio Studio { get; set; }
    }
}
