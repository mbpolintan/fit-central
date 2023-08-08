namespace DataService.ViewModels
{
    public class SaleItems
    {
        public int ItemId { get; set; }     
        public string Type { get; set; }
        public string Name { get; set; }
        public decimal? AmountPaid { get; set; }
        public decimal? AmountDiscounted { get; set; }
        public int Quantity { get; set; }
        public string RecipientClientId { get; set; }
        public int? PaymentReferenceId { get; set; }
    }
}
