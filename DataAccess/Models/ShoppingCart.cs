using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ShoppingCart
    {
        public int ShoppingCartId { get; set; }
        public string Id { get; set; }
        public string ClientId { get; set; }
        public int SiteId { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? DiscountTotal { get; set; }
        public decimal? TaxTotal { get; set; }
        public decimal? GrandTotal { get; set; }
        public DateTime? TransactionDate { get; set; }
        public byte[] TimeStamp { get; set; }
    }
}
