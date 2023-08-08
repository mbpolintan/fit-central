using DataAccess.Models;
using System.Collections.Generic;

namespace DataService.ServiceModels
{
    public class MindBodyStaffMembers
    {
        public MindBodyStaffMembers()
        {
            StaffMembers = new List<Staff>();
        }
        public PaginationResponse PaginationResponse { get; set; }
        public IEnumerable<Staff> StaffMembers { get; set; }
    }
}
