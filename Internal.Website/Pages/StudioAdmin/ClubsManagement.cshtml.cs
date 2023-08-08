using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using DataAccess.Models;
using DataAccess.Contexts;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using DataAccess.ViewModels;
using DataService.Constants.Policy;
using DataService.Utilities;

namespace Internal.Website.Pages.StudioAdmin
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllAdmin)]
    public class ClubsManagementModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ClubsManagementModel> _logger;

        public ClubsManagementModel(StudioCentralContext context,
                                        IMemoryCache cache,
                                        ILogger<ClubsManagementModel> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }

        [BindProperty]
        public IEnumerable<ClubViewModel> Clubs { get; set; }        
        [BindProperty]
        public IEnumerable<StudioViewModel> Studios { get; set; }
        [BindProperty]
        public TrainingGymUser UserGym { get; set; }
        [BindProperty]
        public GlobalTrainingGym SelectedGym { get; set; }

        public void OnGet()
        {
            try
            {
                var userId = UserUtility.GetUserId(User);

                //// get user's Gym
                UserGym = _context.TrainingGymUser
                    .Where(x => x.AppUserId == userId)
                    .Select(x => new TrainingGymUser { GlobalTrainingGymId = x.GlobalTrainingGymId })
                    .OrderBy(x => x.GlobalTrainingGymId)
                    .FirstOrDefault();

                var gymId = UserGym.GlobalTrainingGymId;

                _cache.Set<GlobalTrainingGym>($"{User.Identity.Name}_Gym", null);
                if (_cache.Get<GlobalTrainingGym>($"{User.Identity.Name}_Gym") == null)
                {
                    var Gym = _context.GlobalTrainingGym
                        .Where(x => x.GlobalTrainingGymId == gymId)
                        .Select(x => new GlobalTrainingGym()
                        {
                            GlobalTrainingGymId = x.GlobalTrainingGymId,
                            GymName = x.GymName
                        })
                        .FirstOrDefault();

                    SelectedGym = Gym;

                    _cache.Set<GlobalTrainingGym>($"{User.Identity.Name}_Gym", Gym);
                }
                else
                {
                    var Gym = _cache.Get<GlobalTrainingGym>($"{User.Identity.Name}_Gym");
                    SelectedGym = Gym;
                }

                PopulateList(gymId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }
        private void PopulateList(int gymId)
        {
            try
            {
                ViewData["gym"] = _context.TrainingGymUser
                    .Where(x => x.AppUserId == UserUtility.GetUserId(User))
                    .Select(c => new GlobalTrainingGym
                    {
                        GlobalTrainingGymId = c.GlobalTrainingGymId,
                        GymName = c.GlobalTrainingGym.GymName
                    }).ToList();

                ViewData["studios"] = _context.GlobalStudio
                    .Include(x => x.Studio)
                    .Where(x => x.GlobalTrainingGymId == gymId)
                    .Select(c => new StudioViewModel
                    {
                        StudioId = c.StudioId,
                        StudioName = c.Studio.StudioName
                    }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

        }        
        public JsonResult OnGetReadGlobalStudio(string text)
        {
            try
            {
                var gym = _cache.Get<GlobalTrainingGym>($"{User.Identity.Name}_Gym");
                var gymId = gym.GlobalTrainingGymId;

                Studios = _context.GlobalStudio
                    .Include(x => x.Studio)
                    .Where(x => x.GlobalTrainingGymId == gymId)
                    .Select(c => new StudioViewModel
                    {
                        StudioId = c.StudioId,
                        StudioName = c.Studio.StudioName
                    }).ToList();


                if (!string.IsNullOrEmpty(text))
                {
                    Studios = Studios.Where(p => p.StudioName.Contains(text));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Studios);
        }

        public JsonResult OnPostRead(int gymId, [DataSourceRequest] DataSourceRequest roRequest)
        {
            try
            {
                if (gymId != 0)
                {
                    var Gym = _context.GlobalTrainingGym
                       .Where(x => x.GlobalTrainingGymId == gymId)
                       .Select(x => new GlobalTrainingGym()
                       {
                           GlobalTrainingGymId = x.GlobalTrainingGymId,
                           GymName = x.GymName
                       })
                       .FirstOrDefault();

                    _cache.Set<GlobalTrainingGym>($"{User.Identity.Name}_Gym", Gym);
                }
                else
                {
                    var gym = _cache.Get<GlobalTrainingGym>($"{User.Identity.Name}_Gym");
                    gymId = gym.GlobalTrainingGymId;
                }

                var studios = _context.GlobalStudio.Where(x => x.GlobalTrainingGymId == gymId).ToList();

                List<int> studioIds = new List<int>();

                foreach (var studio in studios)
                {
                    studioIds.Add(studio.StudioId);
                }

                Clubs = _context.VisitAchievement.Include(x => x.Studio)
                    .Where(x => studioIds.Contains(x.StudioId.Value))
                    .Select(x => new ClubViewModel
                    {
                        VisitAchievementId = x.VisitAchievementId,
                        StudioId = x.StudioId,
                        StudioName = x.Studio.StudioName,
                        VisitCount = x.VisitCount
                    })
                    .OrderBy(x => x.StudioId)
                    .ThenBy(x => x.VisitCount)
                    .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Clubs.ToDataSourceResult(roRequest));
        }
        public JsonResult OnPostCreate([DataSourceRequest] DataSourceRequest roRequest, ClubViewModel club)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var studio = _context.Studio.FirstOrDefault(x => x.StudioId == club.StudioId);

                    var existingClub = _context.VisitAchievement
                        .Where(x => x.StudioId == club.StudioId
                        && x.VisitCount == club.VisitCount).FirstOrDefault();

                    if (existingClub != null)
                    {
                        ModelState.AddModelError("error", "Club " + club.VisitCount + " for studio " + studio.StudioName + " already exist.");
                    }
                    else
                    {
                        VisitAchievement studioclub = new VisitAchievement()
                        {
                            StudioId = club.StudioId,
                            VisitCount = club.VisitCount,
                            DateCreated = DateTime.Now
                        };
                        _context.VisitAchievement.Add(studioclub);
                        _context.SaveChanges(User.Identity.Name);
                    }               
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(new[] { club }.ToDataSourceResult(roRequest, ModelState));
        }
        public JsonResult OnPostUpdate([DataSourceRequest] DataSourceRequest roRequest, ClubViewModel club)
        {
            try
            {
                var studio = _context.Studio.FirstOrDefault(x => x.StudioId == club.StudioId);

                var existing = _context.VisitAchievement
                    .Where(x => x.StudioId == club.StudioId
                    && x.VisitCount == club.VisitCount
                    && x.VisitAchievementId != club.VisitAchievementId).FirstOrDefault();

                if (existing != null)
                {
                    ModelState.AddModelError("error", "Club " + club.VisitCount + " for studio " + studio.StudioName + " already exist.");
                }
                else
                {
                    var existingClub = _context.VisitAchievement.FirstOrDefault(x => x.VisitAchievementId == club.VisitAchievementId);
                    existingClub.StudioId = club.StudioId;
                    existingClub.VisitCount = club.VisitCount;
                    existingClub.DateModified = DateTime.Now;

                    _context.Update(existingClub);
                    _context.SaveChanges(User.Identity.Name);
                }               
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { club }.ToDataSourceResult(roRequest, ModelState));
        }
        public JsonResult OnPostDestroy([DataSourceRequest] DataSourceRequest roRequest, ClubViewModel club)
        {
            try
            {
                var Club = _context.VisitAchievement
                   .Where(x => x.VisitAchievementId == club.VisitAchievementId)
                   .FirstOrDefault();

                _context.VisitAchievement.Remove(Club);
                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                ModelState.AddModelError("error", "Unable to delete this record because it is already used in transaction.");
            }
            return new JsonResult(new[] { club }.ToDataSourceResult(roRequest, ModelState));
        }
    }
}
