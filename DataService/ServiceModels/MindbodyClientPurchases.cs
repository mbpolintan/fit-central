
using System.Collections.Generic;

namespace DataService.ServiceModels
{
    public class MindbodyClientPurchases
    {
        public MindbodyClientPurchases()
        {
            Purchases = new List<Mbpurchases>();
        }
        public PaginationResponse PaginationResponse { get; set; }
        public IEnumerable<Mbpurchases> Purchases { get; set; }
      

    }
}
