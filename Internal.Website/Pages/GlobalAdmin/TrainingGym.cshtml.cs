using DataAccess.Contexts;
using DataAccess.Models;
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
    public class TrainingGymModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly ILogger<StudioCentralContext> _logger;

        public TrainingGymModel(StudioCentralContext context,
                                ILogger<StudioCentralContext> logger)
        {
            _context = context;
            _logger = logger;
        }
        [BindProperty]
        public IEnumerable<GlobalStudio> GymStudios { get; set; }
        [BindProperty]
        public IEnumerable<GlobalTrainingGym> TrainingGyms { get; set; }       

        public void OnGet()
        {
            ViewData["studios"] = _context.Studio.Select(c => new Studio
            {
                StudioId = c.StudioId,
                StudioName = c.StudioName
            }).ToList();
        }

        /* Parent Studio */ 
        public JsonResult OnPostRead([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                TrainingGyms = _context.GlobalTrainingGym.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(TrainingGyms.ToDataSourceResult(request));
        }
        public JsonResult OnPostCreate([DataSourceRequest] DataSourceRequest request, GlobalTrainingGym trainingGym)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var exist = _context.GlobalTrainingGym
                    .Where(x => x.GymName == trainingGym.GymName)
                    .FirstOrDefault();

                    if (exist != null)
                    {
                        ModelState.AddModelError("error", "Gym name already exist!");
                    }
                    else
                    {
                        trainingGym.CreatedById = UserUtility.GetUserId(User);
                        trainingGym.DateCreated = DateTime.Now;
                        _context.GlobalTrainingGym.Add(trainingGym);
                        _context.SaveChanges(User.Identity.Name);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { trainingGym }.ToDataSourceResult(request, ModelState));
        }
        public JsonResult OnPostUpdate([DataSourceRequest] DataSourceRequest request, GlobalTrainingGym trainingGym)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var exist = _context.GlobalTrainingGym
                   .Where(x => x.GymName == trainingGym.GymName &&
                           x.GlobalTrainingGymId != trainingGym.GlobalTrainingGymId)
                   .FirstOrDefault();

                    if (exist != null)
                    {
                        ModelState.AddModelError("error", "Gym name already exist!");
                    }
                    else
                    {
                        trainingGym.CreatedById = UserUtility.GetUserId(User);
                        trainingGym.DateCreated = DateTime.Now;
                        _context.Update(trainingGym);
                        _context.SaveChanges(User.Identity.Name);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { trainingGym }.ToDataSourceResult(request, ModelState));
        }
        public JsonResult OnPostDestroy([DataSourceRequest] DataSourceRequest request, GlobalTrainingGym trainingGym)
        {
            try
            {
                _context.GlobalTrainingGym.Remove(trainingGym);
                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { trainingGym }.ToDataSourceResult(request, ModelState));
        }
        /* Child Studio */
        public JsonResult OnPostReadStudio(int trainingGymId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                GymStudios = _context.GlobalStudio.Where(x => x.GlobalTrainingGymId == trainingGymId).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(GymStudios.ToDataSourceResult(request));
        }
        public JsonResult OnPostCreateStudio(int trainingGymId, [DataSourceRequest] DataSourceRequest request, GlobalStudio gymStudio)
        {
            try
            {
                if (ModelState.IsValid) {
                    var exist = _context.GlobalStudio
                       .Where(x => x.GlobalTrainingGymId == trainingGymId
                               && x.StudioId == gymStudio.StudioId)
                       .FirstOrDefault();

                    if (exist != null)
                    {
                        ModelState.AddModelError("error", trainingGymId.ToString());
                    }
                    else
                    {
                        gymStudio.GlobalTrainingGymId = trainingGymId;
                        gymStudio.CreatedById = UserUtility.GetUserId(User);
                        gymStudio.DateCreated = DateTime.Now;
                        _context.GlobalStudio.Add(gymStudio);
                        _context.SaveChanges(User.Identity.Name);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { gymStudio }.ToDataSourceResult(request, ModelState));
        }
        public JsonResult OnPostDestroyStudio([DataSourceRequest] DataSourceRequest request, GlobalStudio gymStudio)
        {
            try
            {
                _context.GlobalStudio.Remove(gymStudio);
                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { gymStudio }.ToDataSourceResult(request, ModelState));
        }
    }
}
