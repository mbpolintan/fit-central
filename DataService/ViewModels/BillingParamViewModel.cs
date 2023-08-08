using DataAccess.Models;

namespace DataService.ViewModels
{
    public class BillingParamViewModel
    {

        public Member PaidBy { get; set; }
        public string Token { get; set; }
        public int SiteId { get; set; }   
        public string MBProductId { get; set; }
        public string Username { get; set; }
        public string PaymentType { get; set; }
        public int PaymentMethodTypeId { get; set; }
        public int Quantity { get; set; }     
        public decimal Amount { get; set; }
    }
}
