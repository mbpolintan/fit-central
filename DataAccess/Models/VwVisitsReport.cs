using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class VwVisitsReport
    {
        public string ClientId { get; set; }
        public string DisplayName { get; set; }
        public int? SignedIn { get; set; }
        public int? AbsencesCancelled { get; set; }
        public int? LateCancelled { get; set; }
        public int? TotalVisits { get; set; }
    }
}
