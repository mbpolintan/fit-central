using DataAccess.Contexts;
using DataAccess.Enums;
using DataAccess.Models;
using DataAccess.ViewModels;
using DataService.Services.Interfaces;
using DataService.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataService.Services
{
    public class StudioService : IStudioService
    {
        public readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;

        public StudioService(StudioCentralContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }

        [BindProperty]
        public IEnumerable<VisitAchievement> VisitAchievements { get; set; }

        public IEnumerable<Studio> GetStudios(int groupId, int userId)
        {

            if (groupId == (int)DataAccess.Enums.AppGroup.StudioManager)
            {
                Studios = _context.StudioUser
                .Include(x => x.Studio)
                .Where(x => x.AppUserId == userId)
                .Select(c => new Studio
                {
                    StudioId = c.StudioId,
                    StudioName = c.Studio.StudioName
                }).OrderBy(x => x.StudioId).ToList();
            }
            else
            {
                var trainingGyms = _context.TrainingGymUser
                    .Where(x => x.AppUserId == userId).ToList();

                List<int> GymIds = new List<int>();

                foreach (var gym in trainingGyms)
                {
                    GymIds.Add(gym.GlobalTrainingGymId);
                }

                Studios = _context.GlobalStudio
                .Include(x => x.Studio)
                .Where(x => GymIds.Contains(x.GlobalTrainingGymId))
                .Select(c => new Studio
                {
                    StudioId = c.StudioId,
                    StudioName = c.Studio.StudioName
                }).OrderBy(x => x.StudioId).ToList();
            }

            return Studios;
        }

        public IEnumerable<TimeZoneInfo> GetTimeZoneAsync()
        {
            IEnumerable<TimeZoneInfo> timeZones = TimeZoneInfo.GetSystemTimeZones();

            return timeZones;
        }

        public async Task<List<MemberAchievementRewardViewModel>> GetMemberAchievement(AchievementParamViewModel param)
        {
            List<MemberAchievementRewardViewModel> rewards = new List<MemberAchievementRewardViewModel>();
            VisitAchievements = await _context.VisitAchievement
                .Where(x => x.VisitCount <= param.SignedIn
                        && x.StudioId == param.StudioId)
                .OrderBy(x => x.VisitCount).ToListAsync();

            foreach (var achievement in VisitAchievements)
            {
                MemberAchievementRewardViewModel rewardView = new MemberAchievementRewardViewModel();
                var MemberAchievementReward = await _context.MemberAchievementReward
                    .Where(x => x.VisitAchievementId == achievement.VisitAchievementId
                            && x.MemberId == param.MemberId)
                    .FirstOrDefaultAsync();

                if (MemberAchievementReward == null)
                {
                    MemberAchievementReward reward = new MemberAchievementReward()
                    {
                        MemberId = param.MemberId,
                        VisitAchievementId = achievement.VisitAchievementId,
                        IsGiven = false,
                        DateCreated = DateTime.Now
                    };
                    await _context.MemberAchievementReward.AddAsync(reward);
                    await _context.SaveChangesAsync(param.Username);

                    rewardView.MemberAchievementRewardId = reward.MemberAchievementRewardId;
                    rewardView.MemberId = reward.MemberId;
                    rewardView.VisitAchievementId = reward.VisitAchievementId;
                    rewardView.VisitCount = achievement.VisitCount.Value;
                    rewardView.IsClaimed = string.Empty;
                }
                else
                {
                    rewardView.MemberAchievementRewardId = MemberAchievementReward.MemberAchievementRewardId;
                    rewardView.MemberId = MemberAchievementReward.MemberId;
                    rewardView.VisitAchievementId = MemberAchievementReward.VisitAchievementId;
                    rewardView.VisitCount = achievement.VisitCount.Value;
                    rewardView.IsClaimed = MemberAchievementReward.IsGiven ? "checked" : string.Empty;
                }
                rewards.Add(rewardView);
            }

            return rewards;
        }

        public async Task<int> GetStudioIdAsync(int studioId, string user)
        {
            if (studioId != 0)
            {
                var Studio = await _context.Studio
                  .Where(x => x.StudioId == studioId)
                  .Select(x => new Studio()
                  {
                      StudioId = x.StudioId,
                      StudioName = x.StudioName
                  }).FirstOrDefaultAsync();

                _cache.Set<Studio>($"{user}_Studio", Studio);
            }
            else
            {
                var loc = _cache.Get<Studio>($"{user}_Studio");
                studioId = loc.StudioId;
            }

            return studioId;
        }

        public int GetStudioId(int studioId, string user)
        {
            if (studioId != 0)
            {
                var Studio = _context.Studio
                  .Where(x => x.StudioId == studioId)
                  .Select(x => new Studio()
                  {
                      StudioId = x.StudioId,
                      StudioName = x.StudioName
                  }).FirstOrDefault();

                _cache.Set<Studio>($"{user}_Studio", Studio);
            }
            else
            {
                var loc = _cache.Get<Studio>($"{user}_Studio");
                studioId = loc.StudioId;
            }

            return studioId;
        }

        public async Task<int> GetStatusIdAsync(int statusId, string user)
        {
            if (statusId != 0)
            {
                var Status = await _context.MemberStatus
                  .Where(x => x.MemberStatusId == statusId)
                  .Select(x => new MemberStatus()
                  {
                      MemberStatusId = x.MemberStatusId,
                      Status = x.Status
                  }).FirstOrDefaultAsync();

                _cache.Set<MemberStatus>($"{user}_Status", Status);
            }
            else
            {
                var status = _cache.Get<MemberStatus>($"{user}_Status");
                statusId = (int)MemberStatuses.ActiveSuspended;
            }
            return statusId;
        }

        public int GetStatusId(int statusId, string user)
        {
            if (statusId != 0)
            {
                var Status = _context.MemberStatus
                  .Where(x => x.MemberStatusId == statusId)
                  .Select(x => new MemberStatus()
                  {
                      MemberStatusId = x.MemberStatusId,
                      Status = x.Status
                  }).FirstOrDefault();

                _cache.Set<MemberStatus>($"{user}_Status", Status);
            }
            else
            {
                var status = _cache.Get<MemberStatus>($"{user}_Status");
                statusId = (int)MemberStatuses.ActiveSuspended;
            }
            return statusId;
        }

        public async Task<int> GetParentStudioIdAsync(int parentStudioId, string user)
        {
            if (parentStudioId != 0)
            {
                var Gym = await _context.GlobalTrainingGym
                   .Where(x => x.GlobalTrainingGymId == parentStudioId)
                   .Select(x => new GlobalTrainingGym()
                   {
                       GlobalTrainingGymId = x.GlobalTrainingGymId,
                       GymName = x.GymName
                   })
                   .FirstOrDefaultAsync();

                _cache.Set<GlobalTrainingGym>($"{user}_Gym", Gym);
            }
            else
            {
                var gym = _cache.Get<GlobalTrainingGym>($"{user}_Gym");
                parentStudioId = gym.GlobalTrainingGymId;
            }

            return parentStudioId;

        }

        public int GetParentStudioId(int parentStudioId, string user)
        {
            if (parentStudioId != 0)
            {
                var Gym = _context.GlobalTrainingGym
                   .Where(x => x.GlobalTrainingGymId == parentStudioId)
                   .Select(x => new GlobalTrainingGym()
                   {
                       GlobalTrainingGymId = x.GlobalTrainingGymId,
                       GymName = x.GymName
                   })
                   .FirstOrDefault();

                _cache.Set<GlobalTrainingGym>($"{user}_Gym", Gym);
            }
            else
            {
                var gym = _cache.Get<GlobalTrainingGym>($"{user}_Gym");
                parentStudioId = gym.GlobalTrainingGymId;
            }

            return parentStudioId;
        }

    }
}
