using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class ChallengeMemberViewModel
    {
        public int ChallengeMemberId { get; set; }

        public string DisplayName { get; set; }
        public int ChallengeId { get; set; }
        public int MemberId { get; set; }
        public int? StartScanId { get; set; }
        public int? MidScanId { get; set; }
        public int? EndScanId { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }
        public int ImageScore { get; set; }
        public byte? BillStatus { get; set; }
    }
}
