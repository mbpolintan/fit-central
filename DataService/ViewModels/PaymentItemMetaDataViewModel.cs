namespace DataService.ViewModels
{
    public class PaymentItemMetaDataViewModel
    {
        public string Id { get; set; }       
        public decimal Amount { get; set; }
        public string CardNumber { get; set; }
        public string CreditCardNumber { get; set; }
        public string Notes { get; set; }
        public string TrackData { get; set; }
        public string LastFour { get; set; }
        public bool SaveInfo { get; set; }
        public int ExpMonth { get; set; }
        public int ExpYear { get; set; }
        public string Cvv { get; set; }
        public string BillingName { get; set; }
        public string BillingAddress { get; set; }
        public string BillingCity { get; set; }
        public string BillingState { get; set; }
        public string BillingPostalCode { get; set; }

    }
}
