using System;

namespace DataAccess.ViewModels
{
    public class PurchasesViewModel
    {
        

        public int PurchaseId { get; set; }
        public int SiteId { get; set; }
        public int Id { get; set; }
        public DateTime? SaleDate { get; set; }
        //public TimeSpan? SaleTime { get; set; }
        public string SaleTime { get; set; }
        public DateTime? SaleDateTime { get; set; }
        public string ClientId { get; set; }
        public int? LocationId { get; set; }
        public string Description { get; set; }
        public bool AccountPayment { get; set; }
        public decimal? Price { get; set; }
        public decimal? AmountPaid { get; set; }
        public decimal? Discount { get; set; }
        public decimal? Tax { get; set; }
        public bool Returned { get; set; }
        public int? Quantity { get; set; }

    }
}
