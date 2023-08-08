using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ClassResource
    {
        public int ScclassResourceId { get; set; }
        public int StudioId { get; set; }
        public int? Id { get; set; }
        public string Name { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Studio Studio { get; set; }
    }
}
