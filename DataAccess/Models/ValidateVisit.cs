using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ValidateVisit
    {
        public int ValidateVisitId { get; set; }
        public int StudioId { get; set; }
        public DateTime FromDateValidation { get; set; }
        public DateTime ToDateValidation { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Studio Studio { get; set; }
    }
}
