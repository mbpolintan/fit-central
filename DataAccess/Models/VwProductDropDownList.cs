using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class VwProductDropDownList
    {
        public int ProductId { get; set; }
        public int? SiteId { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
    }
}
