using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PaymentType
    {
        public int PaymentTypeId { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }
    }
}
