using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ShirtSize
    {
        public ShirtSize()
        {
            Member = new HashSet<Member>();
        }

        public int ShirtSizeId { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ICollection<Member> Member { get; set; }
    }
}
