﻿using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class AppConfig
    {
        public int AppConfigId { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
    }
}
