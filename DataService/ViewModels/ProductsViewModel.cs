using System;
using System.Collections.Generic;
using System.Reflection.Metadata.Ecma335;
using System.Text;

namespace DataService.ViewModels
{
    public class ProductsViewModel
    {     
        public decimal Price { get; set; }
        public decimal TaxIncluded { get; set; }
        public decimal TaxRate { get; set; }
        public string Id { get; set; }
        public int GroupId { get; set; }
        public string Name { get; set; }
        public decimal OnlinePrice { get; set; }
        public string ShortDescription { get; set; }
        public string LongDescription { get; set; }
        public ColorViewModel Color { get; set; }
        public SizeViewModel Size { get; set; }

    }
}
