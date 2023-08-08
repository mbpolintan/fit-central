using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using DataAccess.Contexts;
using DataAccess.Models;
using DataService.Constants.Policy;
using DataService.Utilities;
using DataAccess.ViewModels;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.EntityFrameworkCore;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllAdmin)]
    public class ManagerAdminModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ManagerAdminModel> _logger;

        public ManagerAdminModel(StudioCentralContext context,
                            IMemoryCache cache,
                            ILogger<ManagerAdminModel> logger)
        {
            _context = context;
            _logger = logger;
            _cache = cache;
        }
        [BindProperty]
        public IEnumerable<ManagerViewModel> Managers { get; set; }
        [BindProperty]
        public IEnumerable<TrainingGymUser> UserGyms { get; set; }
        [BindProperty]
        public IEnumerable<UserStudioViewModel> UserStudios { get; set; }
        [BindProperty]
        public IEnumerable<StudioViewModel> Studios { get; set; }
        [BindProperty]
        public IEnumerable<AppUserAccess> UserAccess { get; set; }
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
        public void AddManager(int gymId, int appUserId)
        {
            Manager userManager = new Manager()
            {
                GlobalTrainingGymId = gymId,
                AppUserId = appUserId,
                CreatedById = UserUtility.GetUserId(User),
                DateCreated = DateTime.Now
            };
            _context.Manager.Add(userManager);
            _context.SaveChanges(User.Identity.Name);
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

        public JsonResult OnPostRead(int gymId, [DataSourceRequest] DataSourceRequest request)
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

                Managers = _context.Manager
                    .Where(x => x.GlobalTrainingGymId == gymId)
                     .Select(x => new ManagerViewModel
                     {
                         ManagerId = x.ManagerId,
                         AppUserId = x.AppUserId,
                         UserEmail = x.AppUser.UserEmail,
                         CreatedById = x.CreatedById,
                         DateCreated = x.DateCreated,
                         TimeStamp = x.TimeStamp
                     }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Managers.ToDataSourceResult(request));
        }
        public JsonResult OnPostCreate(int gymId, [DataSourceRequest] DataSourceRequest request, ManagerViewModel manager)
        {
            try
            {
                var appGroupId = (int)DataAccess.Enums.AppGroup.StudioManager;

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

                var exist = _context.AppUser.Where(x => x.UserEmail == manager.UserEmail).FirstOrDefault();

                if (exist != null)
                {
                    if (exist.AppGroupId != (int)DataAccess.Enums.AppGroup.StudioManager)
                    {
                        ModelState.AddModelError("error", manager.UserEmail + " already assign to a different role.");
                    }
                    else
                    {
                        AddManager(gymId, exist.AppUserId);
                    }
                }
                else
                {
                    AppUser user = new AppUser
                    {
                        AppGroupId = appGroupId,
                        UserEmail = manager.UserEmail,
                        CreatedById = UserUtility.GetUserId(User),
                        DateCreated = DateTime.Now
                    };
                    _context.AppUser.Add(user);
                    _context.SaveChanges(User.Identity.Name);

                    //Get Studio Manager Group Access
                    var groupAccess = _context.AppGroupAccess
                        .Where(x => x.AppGroupId == appGroupId)
                        .Select(x => new AppGroupAccess
                        {
                            AppModuleId = x.AppModuleId
                        }).ToList();

                    //Assign User Access based on the Manager Group Access
                    foreach (var group in groupAccess)
                    {
                        AppUserAccess userAccess = new AppUserAccess
                        {
                            AppUserId = user.AppUserId,
                            AppModuleId = group.AppModuleId,
                            AccessType = true,
                            CreatedById = UserUtility.GetUserId(User),
                            DateCreated = DateTime.Now
                        };
                        _context.AppUserAccess.Add(userAccess);
                    }
                    _context.SaveChanges(User.Identity.Name);

                    //Add User to manager Table
                    AddManager(gymId, user.AppUserId);

                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { manager }.ToDataSourceResult(request, ModelState));
        }
        public JsonResult OnPostUpdate(int gymId, [DataSourceRequest] DataSourceRequest request, ManagerViewModel manager)
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

                var exist = _context.AppUser
                   .Where(x => x.UserEmail == manager.UserEmail
                            && x.AppUserId != manager.AppUserId)
                   .FirstOrDefault();

                if (exist != null)
                {
                    ModelState.AddModelError("error", "User with email address " + manager.UserEmail + " already exist.");
                }
                else
                {
                    var managerUser = _context.Manager.FirstOrDefault(x => x.AppUserId == manager.AppUserId && x.GlobalTrainingGymId == gymId);

                    var user = _context.AppUser.FirstOrDefault(x => x.AppUserId == manager.AppUserId);

                    //update user's group and email                
                    user.UserEmail = manager.UserEmail;
                    user.ModifiedById = UserUtility.GetUserId(User);
                    user.DateModified = DateTime.Now;
                    _context.Update(user);
                    _context.SaveChanges(User.Identity.Name);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { manager }.ToDataSourceResult(request, ModelState));
        }
        public JsonResult OnPostDestroy([DataSourceRequest] DataSourceRequest request, ManagerViewModel manager)
        {
            try
            {
                var user = _context.AppUser.FirstOrDefault(x => x.AppUserId == manager.AppUserId);
                _context.AppUser.Remove(user);
                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { manager }.ToDataSourceResult(request, ModelState));
        }

        public JsonResult OnPostReadStudio(int userId, int gymId, [DataSourceRequest] DataSourceRequest roRequest)
        {
            try
            {

                var gym = _cache.Get<GlobalTrainingGym>($"{User.Identity.Name}_Gym");
                gymId = gym.GlobalTrainingGymId;

                var studios = _context.GlobalStudio.Where(x => x.GlobalTrainingGymId == gymId).ToList();

                List<int> Ids = new List<int>();
                foreach (var studio in studios)
                {
                    Ids.Add(studio.StudioId);
                }

                UserStudios = _context.StudioUser
                      .Where(x => x.AppUserId == userId && Ids.Contains(x.StudioId))
                      .Select(x => new UserStudioViewModel
                      {
                          StudioUserId = x.StudioUserId,
                          StudioName = x.Studio.StudioName,
                          AppUserId = x.AppUserId,
                          StudioId = x.StudioId,
                          CreatedById = x.CreatedById,
                          DateCreated = x.DateCreated,
                          TimeStamp = x.TimeStamp
                      })
                      .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(UserStudios.ToDataSourceResult(roRequest));
        }
        public JsonResult OnPostAssignStudio(int userId, [DataSourceRequest] DataSourceRequest roRequest, UserStudioViewModel studio)
        {
            try
            {
                var exist = _context.StudioUser
                .Where(x => x.StudioId == studio.StudioId && x.AppUserId == userId)
                .FirstOrDefault();

                if (exist != null)
                {
                    ModelState.AddModelError("error", userId.ToString());
                }
                else
                {
                    StudioUser studioUser = new StudioUser()
                    {
                        StudioId = studio.StudioId,
                        AppUserId = userId,
                        CreatedById = UserUtility.GetUserId(User),
                        DateCreated = DateTime.Now
                    };

                    _context.StudioUser.Add(studioUser);
                    _context.SaveChanges(User.Identity.Name);

                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { studio }.ToDataSourceResult(roRequest, ModelState));
        }
        public JsonResult OnPostDestroyStudio([DataSourceRequest] DataSourceRequest roRequest, UserStudioViewModel studio)
        {
            try
            {
                var studioUser = _context.StudioUser
                   .Where(x => x.AppUserId == studio.AppUserId
                       && x.StudioId == studio.StudioId)
                   .FirstOrDefault();

                _context.StudioUser.Remove(studioUser);
                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { studio }.ToDataSourceResult(roRequest, ModelState));
        }

    }
}
