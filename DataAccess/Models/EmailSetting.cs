using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class EmailSetting
    {
        public int EmailSettingId { get; set; }
        public int StudioId { get; set; }
        public string MailServer { get; set; }
        public int MailPort { get; set; }
        public string SenderName { get; set; }
        public string Sender { get; set; }
        public string Password { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
        public virtual Studio Studio { get; set; }
    }
}
