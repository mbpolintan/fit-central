using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Gender
    {
        public Gender()
        {
            Member = new HashSet<Member>();
            Scan = new HashSet<Scan>();
        }

        public int GenderId { get; set; }
        public string Description { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
        public virtual ICollection<Member> Member { get; set; }
        public virtual ICollection<Scan> Scan { get; set; }
    }
}
