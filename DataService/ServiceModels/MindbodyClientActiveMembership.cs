using System.Collections.Generic;
using DataAccess.Models;

namespace DataService.ServiceModels
{
    public class MindbodyClientActiveMembership
    {
        public MindbodyClientActiveMembership()
        {
            ClientMemberships = new List<ActiveMembershipViewModel>();
        }
        public PaginationResponse PaginationResponse { get; set; }
        public IEnumerable<ActiveMembershipViewModel> ClientMemberships { get; set; }
        
    }
}
