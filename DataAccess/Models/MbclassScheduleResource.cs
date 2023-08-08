using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class MbclassScheduleResource
    {
        public Guid MbclassScheduleResourceId { get; set; }
        public int? MbclassScheduleId { get; set; }
        public int? Id { get; set; }
        public string Name { get; set; }

        public virtual MbclassSchedule MbclassSchedule { get; set; }
    }
}
