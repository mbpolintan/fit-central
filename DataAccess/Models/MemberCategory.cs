using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class MemberCategory
    {
        public MemberCategory()
        {
            Member = new HashSet<Member>();
        }
        public int MemberCategoryId { get; set; }
        public int StudioId { get; set; }
        public string Category { get; set; }
        public decimal? StdRate { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
        public virtual Studio Studio { get; set; }
        public virtual ICollection<Member> Member { get; set; }
    }
}
