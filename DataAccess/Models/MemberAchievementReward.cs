using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class MemberAchievementReward
    {
        public int MemberAchievementRewardId { get; set; }
        public int MemberId { get; set; }
        public int VisitAchievementId { get; set; }
        public bool IsGiven { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Member Member { get; set; }
        public virtual VisitAchievement VisitAchievement { get; set; }
    }
}
