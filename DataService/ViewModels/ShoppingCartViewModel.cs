using System.Collections.Generic;

namespace DataService.ViewModels
{
    public class ShoppingCartViewModel
    {
        public string Id { get; set; }
        public List<CartItemsViewModel> CartItems { get; set; }
        public decimal SubTotal { get; set; }
        public decimal DiscountTotal { get; set; }
        public decimal TaxTotal { get; set; }
        public decimal GrandTotal { get; set; }

    }
}
