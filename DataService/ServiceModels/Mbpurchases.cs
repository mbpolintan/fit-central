using System;
using System.Collections.Generic;

namespace DataService.ServiceModels
{
    public partial class Mbpurchases
    {
        public Mbsales Sale { get; set; }
        public string Description { get; set; }
        public string AccountPayment { get; set; }
        public string Price { get; set; }
        public string AmountPaid { get; set; }
        public string Discount { get; set; }
        public string Tax { get; set; }
        public string Returned { get; set; }
        public string Quantity { get; set; }       

    }
}
