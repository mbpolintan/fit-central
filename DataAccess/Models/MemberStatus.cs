using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class MemberStatus
    {
        public MemberStatus()
        {
            Member = new HashSet<Member>();
        }

        public int MemberStatusId { get; set; }
        public string Status { get; set; }
        public int StatusOrder { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
        public virtual ICollection<Member> Member { get; set; }
    }
}
