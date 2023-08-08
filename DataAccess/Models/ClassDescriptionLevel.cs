using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ClassDescriptionLevel
    {
        public int ScclassDescriptionLevelId { get; set; }
        public int ScclassDescriptionId { get; set; }
        public int? Id { get; set; }
        public string Name { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ClassDescription ScclassDescription { get; set; }
    }
}
