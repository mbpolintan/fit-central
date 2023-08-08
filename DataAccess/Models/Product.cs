using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Product
    {
        public Product()
        {
            PaymentTransaction = new HashSet<PaymentTransaction>();
            ProductColor = new HashSet<ProductColor>();
            ProductSize = new HashSet<ProductSize>();
        }

        public int ProductId { get; set; }
        public int? SiteId { get; set; }
        public decimal? Price { get; set; }
        public decimal? TaxIncluded { get; set; }
        public decimal? TaxRate { get; set; }
        public string Id { get; set; }
        public int? GroupId { get; set; }
        public string Name { get; set; }
        public decimal? OnlinePrice { get; set; }
        public string ShortDescription { get; set; }
        public string LongDescription { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }

        public virtual ICollection<PaymentTransaction> PaymentTransaction { get; set; }
        public virtual ICollection<ProductColor> ProductColor { get; set; }
        public virtual ICollection<ProductSize> ProductSize { get; set; }
    }
}
