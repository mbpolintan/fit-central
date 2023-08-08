namespace DataAccess.ViewModels
{
    public class MemberAchievementRewardViewModel
    {
        public int MemberAchievementRewardId { get; set; }
        public int MemberId { get; set; }
        public int VisitAchievementId { get; set; }
        public bool IsGiven { get; set; }
        public int VisitCount { get; set; }
        public string IsClaimed { get; set; }
    }

   
}
