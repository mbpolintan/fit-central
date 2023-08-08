using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.ViewModels
{
    public class BillingClientViewModel
    {
        //public string CardId { get; set; }
        public string ClientId { get; set; }
        public bool Test { get; set; }
        public List<Items> Items { get; set; }
        public bool InStore { get; set; }
        public List<PaymentsBillingViewModel> Payments { get; set; }
        public bool SendEmail { get; set; }
        //public int LocationId { get; set; }
    }
}
