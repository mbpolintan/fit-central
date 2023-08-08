using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Payments
    {
        public int PaymentId { get; set; }
        public int PurchaseId { get; set; }
        public int? Id { get; set; }
        public decimal? Amount { get; set; }
        public int? Method { get; set; }
        public string Type { get; set; }
        public string Notes { get; set; }
        public int? ReconciledById { get; set; }
        public bool Reconciled { get; set; }
        public DateTime? ReconciledDatetime { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Purchases Purchase { get; set; }
        public virtual AppUser ReconciledBy { get; set; }
    }
}
