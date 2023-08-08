using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PaymentTransactionLog
    {
        public int PaymentTransactionLogId { get; set; }
        public int StudioId { get; set; }
        public int? PaymentGatewayId { get; set; }
        public DateTime? TransactionDate { get; set; }
        public int? ProcessedById { get; set; }
        public int? MemberId { get; set; }
        public int? PaymentMethodId { get; set; }
        public decimal? Amount { get; set; }
        public bool? Status { get; set; }
        public string StatusDescription { get; set; }
        public bool? Reconciled { get; set; }
        public string ReconciledComments { get; set; }
        public DateTime DateCreated { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Member Member { get; set; }
        public virtual PaymentGateway PaymentGateway { get; set; }
        public virtual PaymentMethod PaymentMethod { get; set; }
        public virtual AppUser ProcessedBy { get; set; }
        public virtual Studio Studio { get; set; }
    }
}
