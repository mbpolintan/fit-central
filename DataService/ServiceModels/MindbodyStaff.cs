using DataService.ViewModels;
using System.Collections.Generic;

namespace DataService.ServiceModels
{
    public class MindbodyStaff
    {
        public MindbodyStaff()
        {
            Staff = new List<StaffViewModel>();
        }
        public PaginationResponse PaginationResponse { get; set; }
        public IEnumerable<StaffViewModel> Staff { get; set; }

    }

}
