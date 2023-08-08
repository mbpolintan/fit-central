using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PushClientSalePayment
    {
        public int PushClientSalePaymentId { get; set; }
        public int PushClientSaleId { get; set; }
        public int? PaymentId { get; set; }
        public int? PaymentMethodId { get; set; }
        public string PaymentMethod { get; set; }
        public decimal? PaymentAmountPaid { get; set; }
        public string PaymentLastFour { get; set; }
        public string PaymentNotes { get; set; }

        public virtual PushClientSale PushClientSale { get; set; }
    }
}
