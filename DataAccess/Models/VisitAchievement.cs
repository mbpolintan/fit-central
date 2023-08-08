using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class VisitAchievement
    {
        public VisitAchievement()
        {
            MemberAchievementReward = new HashSet<MemberAchievementReward>();
        }

        public int VisitAchievementId { get; set; }
        public int? StudioId { get; set; }
        public int? VisitCount { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Studio Studio { get; set; }
        public virtual ICollection<MemberAchievementReward> MemberAchievementReward { get; set; }
    }
}
