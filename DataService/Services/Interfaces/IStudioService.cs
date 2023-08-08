using DataAccess.Models;
using DataAccess.ViewModels;
using DataService.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DataService.Services.Interfaces
{
    public interface IStudioService
    {
        public IEnumerable<Studio> GetStudios(int groupId, int userId);
        public IEnumerable<TimeZoneInfo> GetTimeZoneAsync();
        public Task<List<MemberAchievementRewardViewModel>> GetMemberAchievement(AchievementParamViewModel param);
        public Task<int> GetStudioIdAsync(int studioId, string user);
        public int GetStudioId(int studioId, string user);

        public Task<int> GetStatusIdAsync(int statusId, string user);
        public int GetStatusId(int statusId, string user);

        public Task<int> GetParentStudioIdAsync(int parentStudioId, string user);
        public int GetParentStudioId(int parentStudioId, string user);
    }
}
