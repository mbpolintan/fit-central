using System.Collections.Generic;

namespace DataAccess.ViewModels
{
    public class ValidateChallengeMemberVisitsViewModel
    {
        public List<ChallengeMemberViewModel> Members { get; set; }
        public int StudioId { get; set; }
        public string DateFrom { get; set; }
        public string DateTo { get; set; }
        public string User { get; set; }

    }
}
