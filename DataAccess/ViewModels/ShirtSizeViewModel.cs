using System;

namespace DataAccess.ViewModels
{
    public class ShirtSizeViewModel
    {
        public int ShirtSizeId { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }

    }
}
