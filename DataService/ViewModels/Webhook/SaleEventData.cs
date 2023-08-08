using System;
using System.Collections.Generic;

namespace DataService.ViewModels
{
    public class SaleEventData
    {        
        public int SiteId { get; set; }
        public int SaleId { get; set; }
        public string PurchasingClientId { get; set; }    
        public DateTime? SaleDateTime { get; set; }
        public int SoldById { get; set; }
        public string SoldByName { get; set; }       
        public int LocationId { get; set; }
        public decimal? TotalAmountPaid { get; set; }
        public List<SalePayments> Payments { get; set; }
        public List<SaleItems> Items { get; set; }
    }
}
