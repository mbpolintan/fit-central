using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Recipient
    {
        public int RecipientId { get; set; }
        public int? SentItemId { get; set; }
        public string Name { get; set; }
        public string EmailAddress { get; set; }
        public string MobilePhone { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual SentItem SentItem { get; set; }
    }
}
