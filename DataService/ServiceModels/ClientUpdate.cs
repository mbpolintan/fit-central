using DataService.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.ServiceModels
{
    public class ClientUpdate
    {
        public ClientViewModel Client { get; set; }
        public bool CrossRegionalUpdate { get; set; }
        public bool Test { get; set; }
    }
}
