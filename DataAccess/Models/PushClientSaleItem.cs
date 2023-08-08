using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PushClientSaleItem
    {
        public int PushClientSaleItemId { get; set; }
        public int PushClientSaleId { get; set; }
        public int? ItemId { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public decimal? AmountPaid { get; set; }
        public decimal? AmountDiscounted { get; set; }
        public int? Quantity { get; set; }
        public string RecipientClientId { get; set; }
        public int? PaymentReferenceId { get; set; }

        public virtual PushClientSale PushClientSale { get; set; }
    }
}
