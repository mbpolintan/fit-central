using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PaymentSource
    {
        public PaymentSource()
        {
            PaymentMethod = new HashSet<PaymentMethod>();
        }

        public int PaymentSourceId { get; set; }
        public string Description { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ICollection<PaymentMethod> PaymentMethod { get; set; }
    }
}
