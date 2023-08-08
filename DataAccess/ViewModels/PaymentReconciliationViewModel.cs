using System;

namespace DataAccess.ViewModels
{
    public class PaymentReconciliationViewModel
    {
        public int PaymentId { get; set; }
        public string DisplayName { get; set; }
        public int MemberId { get; set; }
        public DateTime SaleDateTime { get; set; }
        public string SaleTime { get; set; }
        public string Description { get; set; }
        public string PaymentType { get; set; }
        public decimal? Amount { get; set; }
        public int? Quantity { get; set; }
        public int? ReconciledById { get; set; }
        public bool Reconciled { get; set; }
        public DateTime? ReconciledDatetime { get; set; }
        public string ReconciledByEmail { get; set; }

    }
}
