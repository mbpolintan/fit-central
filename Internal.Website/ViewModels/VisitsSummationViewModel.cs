using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class VisitsSummationViewModel
    {
        public int Absences { get; set; }
        public int LateCancelled { get; set; }
        public int SignedIn { get; set; }
        public int TotalVisits { get; set; }

    }
}
