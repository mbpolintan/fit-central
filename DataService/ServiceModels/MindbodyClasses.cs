using DataService.ViewModels;
using System.Collections.Generic;

namespace DataService.ServiceModels
{
    public class MindbodyClasses
    {
        public MindbodyClasses()
        {
            Classes = new List<ClassesViewModel>();
        }
        public PaginationResponse PaginationResponse { get; set; }
        public IEnumerable<ClassesViewModel> Classes { get; set; }

    }
}
