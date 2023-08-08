using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class PurchasedItemsViewModel
    {
        public int PurchasedItemId { get; set; }
        public int PurchaseId { get; set; }
        public int Id { get; set; }
        public bool IsService { get; set; }
        public string BarcodeId { get; set; }
    }
}
