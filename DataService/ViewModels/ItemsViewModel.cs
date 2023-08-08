namespace DataService.ViewModels
{
    public class ItemsViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Count { get; set; }
        public double OnlinePrice { get; set; }
        public double Price { get; set; }
        public double TaxRate { get; set; }
        public string ProductId { get; set; }
        public int ProgramId { get; set; }
        public double TaxIncluded { get; set; }

    }
}
