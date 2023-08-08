namespace DataAccess.ViewModels
{
    public class PaymentTransactionViewModel
    {
        public int PaymentTransactionId { get; set; }
        public int? PaymentMethodTypeId { get; set; }
        public int? PaymentMethodId { get; set; }
        public int MemberId { get; set; }
        public int? ProductId { get; set; }
        public int StudioId { get; set; }
        public int? Quantity { get; set; }
        public decimal? Amount { get; set; }
        public int ChallengeMemberId { get; set; }      
    }
}
