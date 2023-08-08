using DataAccess.Models;
using System.Collections.Generic;

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
