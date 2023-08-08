namespace DataService.ViewModels
{
    public class SalePayments
    {
        public int PaymentId { get; set; }
        public int PaymentMethodId { get; set; }
        public string PaymentMethodName { get; set; }
        public decimal? PaymentAmountPaid { get; set; }
        public string PaymentLastFour { get; set; }
        public string PaymentNotes { get; set; }
    }
}
