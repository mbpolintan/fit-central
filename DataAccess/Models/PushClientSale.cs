using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PushClientSale
    {
        public PushClientSale()
        {
            PushClientSaleItem = new HashSet<PushClientSaleItem>();
            PushClientSalePayment = new HashSet<PushClientSalePayment>();
        }

        public int PushClientSaleId { get; set; }
        public int ClientWebhookId { get; set; }
        public bool IsSynced { get; set; }
        public int? SiteId { get; set; }
        public int? SaleId { get; set; }
        public string PurchasingClientId { get; set; }
        public DateTime? SaleDateTime { get; set; }
        public int? SoldById { get; set; }
        public string SoldByName { get; set; }
        public int? LocationId { get; set; }
        public decimal? TotalAmountPaid { get; set; }

        public virtual ClientWebhook ClientWebhook { get; set; }
        public virtual ICollection<PushClientSaleItem> PushClientSaleItem { get; set; }
        public virtual ICollection<PushClientSalePayment> PushClientSalePayment { get; set; }
    }
}
