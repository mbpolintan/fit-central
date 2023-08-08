using DataAccess.Contexts;
using DataAccess.Models;
using DataAccess.ViewModels;
using DataService.Constants.Policy;
using DataService.Utilities;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.GlobalAdmin)]
    public class UserAdminModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly ILogger<UserAdminModel> _logger;

        public UserAdminModel(StudioCentralContext context,
                            ILogger<UserAdminModel> logger)
        {
            _context = context;
            _logger = logger;
        }

        [BindProperty]
        public IEnumerable<AppUserAccess> UserAccess { get; set; }
        [BindProperty]
        public IEnumerable<UserViewModel> Users { get; set; }
        [BindProperty]
        public IEnumerable<TrainingGymUserViewModel> UserTrainingGyms { get; set; }

        public void OnGet()
        {
            ViewData["groups"] = _context.AppGroup.Where(x => x.AppGroupId != (int)DataAccess.Enums.AppGroup.StudioManager).Select(c => new AppGroup
            {
                AppGroupId = c.AppGroupId,
                Description = c.Description
            }).ToList();
            ViewData["trainingGyms"] = _context.GlobalTrainingGym.Select(c => new GlobalTrainingGym
            {
                GlobalTrainingGymId = c.GlobalTrainingGymId,
                GymName = c.GymName
            }).ToList();
        }

        /* User Details */
        public JsonResult OnPostRead([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                int[] AppUserGroupIds = { (int)DataAccess.Enums.AppGroup.GlobalAdministrator, (int)DataAccess.Enums.AppGroup.StudioOwner };

                Users = _context.AppUser
                 .Where(x => AppUserGroupIds.Contains(x.AppGroupId))
                 .Select(x => new UserViewModel
                 {
                     AppUserId = x.AppUserId,
                     UserEmail = x.UserEmail,
                     AppGroupId = x.AppGroupId,
                     CreatedById = x.CreatedById,
                     DateCreated = x.DateCreated,
                     TimeStamp = x.TimeStamp
                 }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Users.ToDataSourceResult(request));
        }
        public JsonResult OnPostCreate([DataSourceRequest] DataSourceRequest request, UserViewModel userView)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var exist = _context.AppUser.Where(x => x.UserEmail == userView.UserEmail).FirstOrDefault();

                    if (exist != null)
                    {
                        ModelState.AddModelError("error", "User with email address " + userView.UserEmail + " already exist.");
                    }
                    else
                    {
                        AppUser user = new AppUser
                        {
                            AppGroupId = userView.AppGroupId,
                            UserEmail = userView.UserEmail,
                            CreatedById = UserUtility.GetUserId(User),
                            DateCreated = DateTime.Now
                        };
                        _context.AppUser.Add(user);
                        _context.SaveChanges(User.Identity.Name);

                        var groupAccess = _context.AppGroupAccess
                            .Where(x => x.AppGroupId == user.AppGroupId)
                            .Select(x => new AppGroupAccess
                            {
                                AppModuleId = x.AppModuleId
                            }).ToList();

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

                        if (user.AppGroupId == 1)
                        {
                            // assign all Training Gyms
                            var globalTrainingGyms = _context.GlobalTrainingGym.ToList();
                            foreach (var globalTrainingGym in globalTrainingGyms)
                            {
                                TrainingGymUser trainingGymUser = new TrainingGymUser()
                                {
                                    AppUserId = user.AppUserId,
                                    GlobalTrainingGymId = globalTrainingGym.GlobalTrainingGymId,
                                    CreatedById = UserUtility.GetUserId(User),
                                    DateCreated = DateTime.Now
                                };
                                _context.TrainingGymUser.Add(trainingGymUser);
                            }
                        }
                        _context.SaveChanges(User.Identity.Name);
                    }
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { userView }.ToDataSourceResult(request, ModelState));
        }
        public JsonResult OnPostUpdate([DataSourceRequest] DataSourceRequest request, UserViewModel userView)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var exist = _context.AppUser
                 .Where(x => x.UserEmail == userView.UserEmail && x.AppUserId != userView.AppUserId)
                 .FirstOrDefault();

                    if (exist != null)
                    {
                        ModelState.AddModelError("error", "User with email address " + userView.UserEmail + " already exist.");
                    }
                    else
                    {
                        var user = _context.AppUser.FirstOrDefault(x => x.AppUserId == userView.AppUserId);

                        if (user.AppGroupId != userView.AppGroupId)
                        {
                            //remove all access
                            var existingUserAccess = _context.AppUserAccess.Where(x => x.AppUserId == userView.AppUserId).ToList();
                            if (existingUserAccess != null)
                                _context.RemoveRange(existingUserAccess);
                            //remove all training gym assignment
                            var existingUserTrainingGyms = _context.TrainingGymUser.Where(x => x.AppUserId == userView.AppUserId).ToList();
                            if (existingUserTrainingGyms != null)
                                _context.RemoveRange(existingUserTrainingGyms);

                            //assign new access
                            var groupAccess = _context.AppGroupAccess
                               .Where(x => x.AppGroupId == userView.AppGroupId)
                               .Select(x => new AppGroupAccess
                               {
                                   AppModuleId = x.AppModuleId
                               }).ToList();

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

                            if (userView.AppGroupId == 1)
                            {
                                // assign all Training Gyms
                                var globalTrainingGyms = _context.GlobalTrainingGym.ToList();
                                foreach (var globalTrainingGym in globalTrainingGyms)
                                {
                                    TrainingGymUser trainingGymUser = new TrainingGymUser()
                                    {
                                        AppUserId = user.AppUserId,
                                        GlobalTrainingGymId = globalTrainingGym.GlobalTrainingGymId,
                                        CreatedById = UserUtility.GetUserId(User),
                                        DateCreated = DateTime.Now
                                    };
                                    _context.TrainingGymUser.Add(trainingGymUser);
                                }
                            }
                        }

                        //update user's group and email
                        user.AppGroupId = userView.AppGroupId;
                        user.UserEmail = userView.UserEmail;
                        user.ModifiedById = UserUtility.GetUserId(User);
                        user.DateModified = DateTime.Now;
                        _context.Update(user);
                        _context.SaveChanges(User.Identity.Name);
                    }
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { userView }.ToDataSourceResult(request, ModelState));
        }
        public JsonResult OnPostDestroy([DataSourceRequest] DataSourceRequest request, UserViewModel userView)
        {
            try
            {
                var userStudio = _context.StudioUser.Where(x => x.AppUserId == userView.AppUserId).ToList();
                _context.StudioUser.RemoveRange(userStudio);

                var user = _context.AppUser.FirstOrDefault(x => x.AppUserId == userView.AppUserId);
                _context.AppUser.Remove(user);

                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { userView }.ToDataSourceResult(request, ModelState));
        }

        /* User Gym/Parent Studio Assignment */
        public JsonResult OnPostReadGym(int userId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                UserTrainingGyms = _context.TrainingGymUser
                      .Where(x => x.AppUserId == userId)
                      .Select(x => new TrainingGymUserViewModel
                      {
                          TrainingGymUserId = x.TrainingGymUserId,
                          AppUserId = x.AppUserId,
                          GlobalTrainingGymId = x.GlobalTrainingGymId,
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

            return new JsonResult(UserTrainingGyms.ToDataSourceResult(request));
        }
        public JsonResult OnPostAssignGym(int userId, [DataSourceRequest] DataSourceRequest request, TrainingGymUser userGym)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var exist = _context.TrainingGymUser
                    .Where(x => x.GlobalTrainingGymId == userGym.GlobalTrainingGymId && x.AppUserId == userId)
                    .FirstOrDefault();

                    if (exist != null)
                    {
                        ModelState.AddModelError("error", userId.ToString());
                    }
                    else
                    {
                        // assign training Gym
                        TrainingGymUser trainingGym = new TrainingGymUser()
                        {
                            AppUserId = userId,
                            GlobalTrainingGymId = userGym.GlobalTrainingGymId,
                            CreatedById = UserUtility.GetUserId(User),
                            DateCreated = DateTime.Now
                        };
                        _context.TrainingGymUser.Add(trainingGym);
                        _context.SaveChanges(User.Identity.Name);
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { userGym }.ToDataSourceResult(request, ModelState));
        }
        public JsonResult OnPostDestroyGym([DataSourceRequest] DataSourceRequest request, TrainingGymUser userGym)
        {
            try
            {
                var userTrainingGym = _context.TrainingGymUser
               .Where(x => x.AppUserId == userGym.AppUserId
                   && x.GlobalTrainingGymId == userGym.GlobalTrainingGymId)
               .FirstOrDefault();

                _context.TrainingGymUser.Remove(userTrainingGym);
                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(new[] { userGym }.ToDataSourceResult(request, ModelState));
        }
    }
}