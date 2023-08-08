using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class AppGroupAccess
    {
        public int AppGroupAccessId { get; set; }
        public int AppGroupId { get; set; }
        public int AppModuleId { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual AppGroup AppGroup { get; set; }
        public virtual AppModule AppModule { get; set; }
        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
    }
}
