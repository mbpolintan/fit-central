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
using DataService.Services.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllAdmin)]
    public class ChallengeManagementModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ChallengeManagementModel> _logger;
        private readonly IStudioService _studioService;
        private readonly IMindBodyService _mindBodyService;
        public ChallengeManagementModel(StudioCentralContext context,
                                        IMemoryCache cache,
                                        ILogger<ChallengeManagementModel> logger,
                                        IStudioService studioService,
                                        IMindBodyService mindBodyService)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
            _studioService = studioService;
            _mindBodyService = mindBodyService;
        }

        [BindProperty]
        public List<Challenge> Challenges { get; set; }
        [BindProperty]
        public IEnumerable<StudioViewModel> Studios { get; set; }
        [BindProperty]
        public IEnumerable<ChallengeMemberViewModel> ChallengeMembers { get; set; }
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

        public JsonResult OnPostRead(int gymId, [DataSourceRequest] DataSourceRequest roRequest)
        {
            try
            {
                gymId = _studioService.GetParentStudioId(gymId, User.Identity.Name);  
                Challenges = _context.Challenge
                   .Where(x => x.GlobalTrainingGymId == gymId)
                   .Select(c => new Challenge
                   {
                       ChallengeId = c.ChallengeId,
                       ChallengeNo = c.ChallengeNo,
                       StartDate = c.StartDate,
                       EndDate = c.EndDate,
                       StartScanFromDate = c.StartScanFromDate,
                       StartScanToDate = c.StartScanToDate,
                       MidScanFromDate = c.MidScanFromDate,
                       MidScanToDate = c.MidScanToDate,
                       EndScanFromDate = c.EndScanFromDate,
                       EndScanToDate = c.EndScanToDate,
                       CreatedById = c.CreatedById,
                       DateCreated = c.DateCreated,
                       TimeStamp = c.TimeStamp,
                       GlobalTrainingGymId = c.GlobalTrainingGymId
                   })
                   .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Challenges.ToDataSourceResult(roRequest));
        }
        public JsonResult OnPostCreate(int gymId, [DataSourceRequest] DataSourceRequest roRequest, Challenge challenge)
        {
            try
            {
                gymId = _studioService.GetParentStudioId(gymId, User.Identity.Name);
                var exist = _context.Challenge
                               .Where(x => x.ChallengeNo == challenge.ChallengeNo && x.GlobalTrainingGymId == gymId)
                               .FirstOrDefault();

                if (exist != null)
                {
                    ModelState.AddModelError("error", "Challenge " + challenge.ChallengeNo + " already exist.");
                }
                else
                {
                    challenge.GlobalTrainingGymId = gymId;
                    challenge.CreatedById = UserUtility.GetUserId(User);
                    challenge.DateCreated = DateTime.Now;
                    _context.Challenge.Add(challenge);
                    _context.SaveChanges(User.Identity.Name);

                    challenge.CreatedBy = null;
                    challenge.ModifiedBy = null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { challenge }.ToDataSourceResult(roRequest, ModelState));
        }
        public JsonResult OnPostUpdate(int gymId, [DataSourceRequest] DataSourceRequest roRequest, Challenge challenge)
        {
            try
            {
                gymId = _studioService.GetParentStudioId(gymId, User.Identity.Name);
                var exist = _context.Challenge
               .Where(x => x.ChallengeNo == challenge.ChallengeNo
                           && x.GlobalTrainingGymId == gymId
                           && x.ChallengeId != challenge.ChallengeId)
               .FirstOrDefault();

                if (exist != null)
                {
                    ModelState.AddModelError("error", "Challenge " + challenge.ChallengeNo + " already exist.");
                }
                else
                {
                    challenge.ModifiedById = UserUtility.GetUserId(User);
                    challenge.DateModified = DateTime.Now;

                    _context.Challenge.Update(challenge);
                    _context.SaveChanges(User.Identity.Name);

                    Challenges.Where(x => x.ChallengeId == challenge.ChallengeId).Select(x => challenge);

                    challenge.CreatedBy = null;
                    challenge.ModifiedBy = null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { challenge }.ToDataSourceResult(roRequest, ModelState));
        }
        public JsonResult OnPostDestroy(int gymId, [DataSourceRequest] DataSourceRequest roRequest, Challenge challenge)
        {
            try
            {
                gymId = _studioService.GetParentStudioId(gymId, User.Identity.Name);
                _context.Challenge.Remove(challenge);
                _context.SaveChanges(User.Identity.Name);
                Challenges.Where(x => x.ChallengeId == challenge.ChallengeId && x.GlobalTrainingGymId == gymId).Select(x => challenge);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(new[] { challenge }.ToDataSourceResult(roRequest, ModelState));
        }

        public JsonResult OnPostReadStudio([DataSourceRequest] DataSourceRequest roRequest)
        {
            try
            {
                
                var gymId = _studioService.GetParentStudioId(0, User.Identity.Name);

                Studios = _context.GlobalStudio
                    .Include(x => x.Studio)
                    .Where(x => x.GlobalTrainingGymId == gymId)
                    .Select(c => new StudioViewModel
                    {
                        StudioId = c.Studio.StudioId,
                        StudioName = c.Studio.StudioName                        
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Studios.ToDataSourceResult(roRequest));
        }

        //// moved to Challenge Setup
        //public JsonResult OnPostValidateVisits(int studioId, int challengeId, string dateFrom, string dateTo)
        //{
        //    var success = false;
        //    try
        //    {

        //        using (var cmd = _context.Database.GetDbConnection().CreateCommand())
        //        {
        //            cmd.CommandText = "dbo.uspGetChallengeMember"; //sp name
        //            cmd.CommandType = System.Data.CommandType.StoredProcedure;
        //            List<SqlParameter> param = new List<SqlParameter>()
        //            {
        //                new SqlParameter("@ChallengeId", SqlDbType.Int) {Value = challengeId},
        //                new SqlParameter("@StudioId", SqlDbType.Int) {Value = studioId}
        //            };
        //            cmd.Parameters.AddRange(param.ToArray());
        //            _context.Database.OpenConnection();
        //            using (var result = cmd.ExecuteReader())
        //            {
        //                if (result.HasRows)
        //                {
        //                    ChallengeMembers = _context.MapToList<ChallengeMemberViewModel>(result);
        //                }
        //            }
        //        }


        //        ValidateVisitsViewModel validateParam = new ValidateVisitsViewModel()
        //        {
        //            Members = ChallengeMembers.ToList(),
        //            DateFrom = DateTime.Parse(dateFrom).ToString("s"),
        //            DateTo = DateTime.Parse(dateTo).ToString("s"),
        //            StudioId = studioId,
        //            User = User.Identity.Name
        //        };

        //        success = _mindBodyService.ValidateMembersVisits(validateParam);

        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex.Message);
        //    }

        //    return new JsonResult(success);
        //}

    }
}