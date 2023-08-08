using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.ServiceModels
{
    public class Mbsales
    {
        public string Id { get; set; }
        public string SaleDate { get; set; }
        public string SaleTime { get; set; }
        public string SaleDateTime { get; set; }
        public string ClientId { get; set; }
        public string LocationId { get; set; }
        public List<MbpurchasedItem> PurchasedItems { get; set; }
        public List<Mbpayments> Payments { get; set; }
    }
}
