using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.ServiceModels
{
    public class Program
    {
        public Program()
        {
            MbclientActiveMembership = new HashSet<MbclientActiveMembership>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string ScheduleType { get; set; }
        public int? CancelOffset { get; set; }
        public string[] ContentFormats { get; set; }

        public virtual ICollection<MbclientActiveMembership> MbclientActiveMembership { get; set; }
    }
}
