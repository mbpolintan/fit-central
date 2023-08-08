using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using DataAccess.Models;
using DataService.Constants.Policy;
using DataService.Utilities;
using Microsoft.EntityFrameworkCore;
using DataAccess.ViewModels;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using Microsoft.AspNetCore.Authorization;


namespace Internal.Website.Pages.StudioAdmin
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllAdmin)]
    public class ScoringTemplateModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ChallengeManagementModel> _logger;

        public ScoringTemplateModel(StudioCentralContext context,
                                        IMemoryCache cache,
                                        ILogger<ChallengeManagementModel> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }

        [BindProperty]
        public List<WeightedSystem> WeightedSystems { get; set; }
        [BindProperty]
        public List<PointsSystem> PointsSystems { get; set; }
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

        public JsonResult OnPostReadWeightedSystem(int gymId, [DataSourceRequest] DataSourceRequest roRequest)
        {
            try
            {
                gymId = GetParentStudioId(gymId);
                WeightedSystems = _context.WeightedSystem
                   .Where(x => x.GlobalTrainingGymId == gymId)
                   .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(WeightedSystems.ToDataSourceResult(roRequest));
        }
        public JsonResult OnPostCreateWeightedSystem(int gymId, [DataSourceRequest] DataSourceRequest roRequest, WeightedSystem weighted)
        {
            try
            {

                gymId = GetParentStudioId(gymId);                

                var exist = _context.WeightedSystem
                               .Where(x => x.Category == weighted.Category && x.GlobalTrainingGymId == gymId)
                               .FirstOrDefault();

                if (exist != null)
                {
                    ModelState.AddModelError("error", "Category " + weighted.Category + " already exist.");
                }
                else
                {
                    weighted.GlobalTrainingGymId = gymId;                  
                    weighted.DateCreated = DateTime.Now;
                    _context.WeightedSystem.Add(weighted);
                    _context.SaveChanges(User.Identity.Name);                   
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { weighted }.ToDataSourceResult(roRequest, ModelState));
        }
        public JsonResult OnPostUpdateWeightedSystem(int gymId, [DataSourceRequest] DataSourceRequest roRequest, WeightedSystem weighted)
        {
            try
            {
                gymId = GetParentStudioId(gymId);


                var exist = _context.WeightedSystem
               .Where(x => x.Category == weighted.Category
                           && x.GlobalTrainingGymId == gymId
                           && x.WeightedSystemId != weighted.WeightedSystemId)
               .FirstOrDefault();

                if (exist != null)
                {
                    ModelState.AddModelError("error", "Category " + weighted.Category + " already exist.");
                }
                else
                {                   
                    weighted.DateModified = DateTime.Now;
                    _context.WeightedSystem.Update(weighted);
                    _context.SaveChanges(User.Identity.Name);                  
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { weighted }.ToDataSourceResult(roRequest, ModelState));
        }
        public JsonResult OnPostDestroyWeightedSystem([DataSourceRequest] DataSourceRequest roRequest, WeightedSystem weighted)
        {
            try
            {              
                _context.WeightedSystem.Remove(weighted);
                _context.SaveChanges(User.Identity.Name);                      
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(new[] { weighted }.ToDataSourceResult(roRequest, ModelState));
        }


        public JsonResult OnPostReadPointsSystem(int gymId, [DataSourceRequest] DataSourceRequest roRequest)
        {
            try
            {

                gymId = GetParentStudioId(gymId);
                PointsSystems = _context.PointsSystem
                   .Where(x => x.GlobalTrainingGymId == gymId)
                   .OrderBy(x => x.PointsAllocation)
                   .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(PointsSystems.ToDataSourceResult(roRequest));
        }
        public JsonResult OnPostCreatePointsSystem(int gymId, [DataSourceRequest] DataSourceRequest roRequest, PointsSystem points)
        {
            try
            {

                gymId = GetParentStudioId(gymId);
                var exist = _context.PointsSystem
                               .Where(x => x.PointsAllocation == points.PointsAllocation && x.GlobalTrainingGymId == gymId)
                               .FirstOrDefault();

                if (exist != null)
                {
                    ModelState.AddModelError("error", points.PointsAllocation + " points allocation already exist.");
                }
                else
                {
                    points.GlobalTrainingGymId = gymId;
                    points.DateCreated = DateTime.Now;
                    _context.PointsSystem.Add(points);
                    _context.SaveChanges(User.Identity.Name);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { points }.ToDataSourceResult(roRequest, ModelState));
        }
        public JsonResult OnPostUpdatePointsSystem(int gymId, [DataSourceRequest] DataSourceRequest roRequest, PointsSystem points)
        {
            try
            {
                gymId = GetParentStudioId(gymId);
                var exist = _context.PointsSystem
               .Where(x => x.PointsAllocation == points.PointsAllocation
                           && x.GlobalTrainingGymId == gymId
                           && x.PointsSystemId != points.PointsSystemId)
               .FirstOrDefault();

                if (exist != null)
                {
                    ModelState.AddModelError("error", points.PointsAllocation + " points allocation already exist.");
                }
                else
                {
                    points.DateModified = DateTime.Now;
                    _context.PointsSystem.Update(points);
                    _context.SaveChanges(User.Identity.Name);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { points }.ToDataSourceResult(roRequest, ModelState));
        }
        public JsonResult OnPostDestroyPointsSystem([DataSourceRequest] DataSourceRequest roRequest, PointsSystem points)
        {
            try
            {
                _context.PointsSystem.Remove(points);
                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(new[] { points }.ToDataSourceResult(roRequest, ModelState));
        }


        public int GetParentStudioId(int gymId)
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

            return gymId;
        }

    }
}
