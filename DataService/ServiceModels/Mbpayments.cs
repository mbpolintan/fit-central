using System;
using System.Collections.Generic;

namespace DataService.ServiceModels
{
    public partial class Mbpayments
    {       
        public string Id { get; set; }
        public string Amount { get; set; }
        public string Method { get; set; }
        public string Type { get; set; }
        public string Notes { get; set; }      
    }
}
