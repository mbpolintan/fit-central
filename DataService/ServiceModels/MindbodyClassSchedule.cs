using System.Collections.Generic;

namespace DataService.ServiceModels
{
    public class MindbodyClassSchedule
    {
        public MindbodyClassSchedule()
        {
            ClassSchedules = new List<ClassSchedulesViewModel>();
        }
        public PaginationResponse PaginationResponse { get; set; }
        public IEnumerable<ClassSchedulesViewModel> ClassSchedules { get; set; }

    }

}
