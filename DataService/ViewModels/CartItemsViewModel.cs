using System.Collections.Generic;

namespace DataService.ViewModels
{
    public class CartItemsViewModel
    {
        public ItemsViewModel Item { get; set; }       
        public double DiscountAmount { get; set; }
        public List<int> VisitIds { get; set; }
        public List<int> AppointmentIds { get; set; }
       // public List<Appointments> Appointments { get; set; }
        public int Id { get; set; }
        public int Quantity { get; set; }
    }
}
