using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class VisitsReportViewModel
    {
        public string ClientId { get; set; }
        public string DisplayName { get; set; }
        public int MemberStatusId { get; set; }
        public int SignedIn { get; set; }
        public int AbsencesCancelled { get; set; }
        public int LateCancelled { get; set; }
        public int TotalVisits { get; set; }
    }
}
