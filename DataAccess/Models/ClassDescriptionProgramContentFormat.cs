using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ClassDescriptionProgramContentFormat
    {
        public int ScclassDescriptionProgramContentFormatId { get; set; }
        public int? ScclassDescriptionProgramId { get; set; }
        public string ContentFormat { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ClassDescriptionProgram ScclassDescriptionProgram { get; set; }
    }
}
