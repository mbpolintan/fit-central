using System;

namespace DataAccess.ViewModels
{
    public class ProductViewModel
    {
        public int ProductId { get; set; }
        public int? SiteId { get; set; }
        public decimal? Price { get; set; }
        public decimal? TaxIncluded { get; set; }
        public decimal? TaxRate { get; set; }
        public string Id { get; set; }
        public int? GroupId { get; set; }
        public string Name { get; set; }
        public string NameDisplay { get; set; }
        public string Color { get; set; }
        public string Size { get; set; }
        public decimal? OnlinePrice { get; set; }
        public string ShortDescription { get; set; }
        public string LongDescription { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
    }
}
