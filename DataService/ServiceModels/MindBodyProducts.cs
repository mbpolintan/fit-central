using DataService.ViewModels;
using System.Collections.Generic;

namespace DataService.ServiceModels
{
    public class MindBodyProducts
    {

        public MindBodyProducts()
        {
            Products = new List<ProductsViewModel>();
        }
        public PaginationResponse PaginationResponse { get; set; }
        public IEnumerable<ProductsViewModel> Products { get; set; }

    }
}
