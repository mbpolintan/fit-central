using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PaymentGateway
    {
        public PaymentGateway()
        {
            PaymentTransactionLog = new HashSet<PaymentTransactionLog>();
        }

        public int PaymentGatewayId { get; set; }
        public string Gateway { get; set; }
        public DateTime DateCreated { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ICollection<PaymentTransactionLog> PaymentTransactionLog { get; set; }
    }
}
