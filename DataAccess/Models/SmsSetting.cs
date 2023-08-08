using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class SmsSetting
    {
        public int SmsSettingId { get; set; }
        public int StudioId { get; set; }
        public string AccountSid { get; set; }
        public string AuthToken { get; set; }
        public string Number { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }

        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
        public virtual Studio Studio { get; set; }
    }
}
