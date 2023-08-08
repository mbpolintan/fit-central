using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class PurchasedItems
    {
        public int PurchasedItemId { get; set; }
        public int PurchaseId { get; set; }
        public int Id { get; set; }
        public bool IsService { get; set; }
        public string BarcodeId { get; set; }

        public virtual Purchases Purchase { get; set; }
    }
}
