using DataAccess.Models;
using System.Collections.Generic;

namespace DataAccess.ViewModels
{
    public class ValidateMemberVisitsViewModel
    {
        public List<Member> Members { get; set; }
        public int StudioId { get; set; }
        public string DateFrom { get; set; }
        public string DateTo { get; set; }
        public string User { get; set; }

    }
}
