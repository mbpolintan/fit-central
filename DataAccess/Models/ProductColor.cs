using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ProductColor
    {
        public int ProductColorId { get; set; }
        public int ProductId { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }

        public virtual Product Product { get; set; }
    }
}
