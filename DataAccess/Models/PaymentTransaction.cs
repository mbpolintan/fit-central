using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PaymentTransaction
    {
        public PaymentTransaction()
        {
            ChallengeMember = new HashSet<ChallengeMember>();
        }

        public int PaymentTransactionId { get; set; }
        public int? PaymentMethodTypeId { get; set; }
        public int? PaymentMethodId { get; set; }
        public int MemberId { get; set; }
        public int? ProductId { get; set; }
        public int StudioId { get; set; }
        public int? Quantity { get; set; }
        public decimal? Amount { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Member Member { get; set; }
        public virtual PaymentMethod PaymentMethod { get; set; }
        public virtual Product Product { get; set; }
        public virtual Studio Studio { get; set; }
        public virtual ICollection<ChallengeMember> ChallengeMember { get; set; }
    }
}
