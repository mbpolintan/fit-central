using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ClassDescriptionSessionType
    {
        public int ScclassDescriptionSessionTypeId { get; set; }
        public int ScclassDescriptionId { get; set; }
        public string Type { get; set; }
        public int? DefaultTimeLength { get; set; }
        public int? Id { get; set; }
        public string Name { get; set; }
        public int? NumDeducted { get; set; }
        public int? ProgramId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ClassDescription ScclassDescription { get; set; }
    }
}
