using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models
{
    public partial class StudioScanner
    {
        public int StudioScannerId { get; set; }
        [DisplayName("Studio")]
        public int StudioId { get; set; }
        [DisplayName("Scanner")]
        public int ScannerId { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        [Timestamp]
        public byte[] TimeStamp { get; set; }

        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
        public virtual Scanner Scanner { get; set; }
        public virtual Studio Studio { get; set; }
    }
}
