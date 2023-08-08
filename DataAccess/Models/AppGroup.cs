using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class AppGroup
    {
        public AppGroup()
        {
            AppGroupAccess = new HashSet<AppGroupAccess>();
            AppUser = new HashSet<AppUser>();
        }

        public int AppGroupId { get; set; }
        public string Description { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
        public virtual ICollection<AppGroupAccess> AppGroupAccess { get; set; }
        public virtual ICollection<AppUser> AppUser { get; set; }
    }
}
