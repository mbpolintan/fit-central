using System;

namespace DataAccess.ViewModels
{
    public class PaymentTransactionLogViewModel
    {
        public int PaymentTransactionLogId { get; set; }
        public int StudioId { get; set; }
        public int? PaymentGatewayId { get; set; }
        public string Gateway { get; set; }
        public DateTime? TransactionDate { get; set; }
        public int? ProcessedById { get; set; }
        public string ProcessedByDisplayName{ get; set; }
        public int? MemberId { get; set; }
        public string DisplayName { get; set; }
        public int? PaymentMethodId { get; set; }
        public string PaymentMethodType { get; set; }
        public decimal? Amount { get; set; }
        public bool? Status { get; set; }
        public string StatusDescription { get; set; }
        public bool? Reconciled { get; set; }
        public string ReconciledComments { get; set; }
        public DateTime DateCreated { get; set; }
        public byte[] TimeStamp { get; set; }

       
    }
}
