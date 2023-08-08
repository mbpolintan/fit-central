using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class MbwebApi
    {
        public MbwebApi()
        {
            Mbapilog = new HashSet<Mbapilog>();
        }

        public int MbwebApiid { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ICollection<Mbapilog> Mbapilog { get; set; }
    }
}
