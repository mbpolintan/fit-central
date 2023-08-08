using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class VisitsViewModel
    {
        public DateTime Date { get; set; }
        public string Time { get; set; }
        public string Name { get; set; }
        public string  Teacher { get; set; }
        public string AppointmentStatus { get; set; }
        public string LateCancelled { get; set; }       
        public string ServiceName { get; set; }
        public string Status { get; set; }

        //public string SignedIn { get; set; }
        //public string WebSignup { get; set; }
        //public string Action { get; set; }
    }
}
