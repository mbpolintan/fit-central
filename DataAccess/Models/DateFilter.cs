using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class DateFilter
    {
        public int DateFilterId { get; set; }
        public string Description { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }
    }
}
