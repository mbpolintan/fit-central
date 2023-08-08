using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.ServiceModels
{
    public class MindbodyClients
    {
        public MindbodyClients()
        {
            Clients = new List<ClientInfo>();
        }
        public PaginationResponse PaginationResponse { get; set; }
        public IEnumerable<ClientInfo> Clients { get; set; }
    }
}
