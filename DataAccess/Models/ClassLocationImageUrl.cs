using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ClassLocationImageUrl
    {
        public int ScclassLocationImageUrlId { get; set; }
        public int ScclassLocationId { get; set; }
        public string AdditionalImageUrl { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ClassLocation ScclassLocation { get; set; }
    }
}
