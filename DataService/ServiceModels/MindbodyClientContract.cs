using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.ServiceModels
{
    public class MindbodyClientContract
    {
        public MindbodyClientContract()
        {
            Contracts = new List<Mbcontract>();
        }
        public PaginationResponse PaginationResponse { get; set; }
        public IEnumerable<Mbcontract> Contracts { get; set; }
       
    }
}
