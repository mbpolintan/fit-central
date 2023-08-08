using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ClassLocationAmenities
    {
        public int ScclassLocationAmenitiesId { get; set; }
        public int ScclassLocationId { get; set; }
        public int? Id { get; set; }
        public string Name { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ClassLocation ScclassLocation { get; set; }
    }
}
