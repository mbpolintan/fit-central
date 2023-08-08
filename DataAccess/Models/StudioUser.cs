using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models
{
    public partial class StudioUser
    {
        public int StudioUserId { get; set; }
        [DisplayName("Studio")]
        public int StudioId { get; set; }
        [DisplayName("User")]
        public int AppUserId { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        [Timestamp]
        public byte[] TimeStamp { get; set; }

        public virtual AppUser AppUser { get; set; }
        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
        public virtual Studio Studio { get; set; }
    }
}
