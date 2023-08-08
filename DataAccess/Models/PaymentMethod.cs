using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PaymentMethod
    {
        public PaymentMethod()
        {
            PaymentTransaction = new HashSet<PaymentTransaction>();
            PaymentTransactionLog = new HashSet<PaymentTransactionLog>();
        }

        public int PaymentMethodId { get; set; }
        public int? MemberId { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public int? PaymentSourceId { get; set; }
        public int? PaymentMethodTypeId { get; set; }
        public int? PaidByOtherMemberId { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Member Member { get; set; }
        public virtual Member PaidByOtherMember { get; set; }
        public virtual PaymentMethodType PaymentMethodType { get; set; }
        public virtual PaymentSource PaymentSource { get; set; }
        public virtual ICollection<PaymentTransaction> PaymentTransaction { get; set; }
        public virtual ICollection<PaymentTransactionLog> PaymentTransactionLog { get; set; }
    }
}
