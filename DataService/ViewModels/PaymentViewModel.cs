using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class PaymentViewModel
    {
        public int PaymentId { get; set; }
        public int PurchaseId { get; set; }
        public int? Id { get; set; }
        public decimal? Amount { get; set; }
        public int? Method { get; set; }
        public string Type { get; set; }
        public string Notes { get; set; }
    }
}
