using System;
using System.Collections.Generic;
using System.Linq;
using DataAccess.Contexts;
using DataAccess.Models;
using DataService.Services.Interfaces;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using DataService.Constants.Policy;
using DataService.Utilities;
using DataAccess.ViewModels;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllAdmin)]
    public class BillingConfigModel : PageModel
    {

        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly IMindBodyService _mindBodyService;
        private readonly ILogger<BillingConfigModel> _logger;

        public BillingConfigModel(StudioCentralContext context,
                                IMemoryCache cache,
                                IMindBodyService mindBodyService,
                                ILogger<BillingConfigModel> logger)
        {
            _context = context;
            _cache = cache;
            _mindBodyService = mindBodyService;
            _logger = logger;
        }

        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }
        [BindProperty]
        public IEnumerable<Product> Products { get; set; }
        [BindProperty]
        public IEnumerable<ProductColor> Colors { get; set; }
        [BindProperty]
        public IEnumerable<ProductSize> Sizes { get; set; }
        [BindProperty]
        public TrainingGymUser UserGym { get; set; }

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

                    _cache.Set<GlobalTrainingGym>($"{User.Identity.Name}_Gym", Gym);
                }
                else
                {
                    var Gym = _cache.Get<GlobalTrainingGym>($"{User.Identity.Name}_Gym");                   
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

                Studios = _context.GlobalStudio
                    .Include(x => x.Studio)
                    .Where(x => x.GlobalTrainingGymId == gymId)
                    .Select(c => new Studio
                    {
                        StudioId = c.StudioId,
                        StudioName = c.Studio.StudioName,
                        SiteId = c.Studio.SiteId
                        
                    }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Studios.ToDataSourceResult(roRequest));
        }
        public JsonResult OnPostReadProduct(int siteId, [DataSourceRequest] DataSourceRequest roRequest)
        {
            Products = _context.Product.Where(x => x.SiteId == siteId).ToList();

            return new JsonResult(Products.ToDataSourceResult(roRequest));
        }
        public JsonResult OnPostReadProductColor(int ProductId, [DataSourceRequest] DataSourceRequest roRequest)
        {
            Colors = _context.ProductColor.Where(x => x.ProductId == ProductId).ToList();

            return new JsonResult(Colors.ToDataSourceResult(roRequest));
        }
        public JsonResult OnPostReadProductSize(int ProductId, [DataSourceRequest] DataSourceRequest roRequest)
        {
            Sizes = _context.ProductSize.Where(x => x.ProductId == ProductId).ToList();

            return new JsonResult(Sizes.ToDataSourceResult(roRequest));
        }

        public JsonResult OnPostUpdateProduct(int siteId)
        {
            var message = string.Empty;
            try
            {
                var mbinterface = _context.Mbinterface.Where(x => x.MindbodyStudioId == siteId).FirstOrDefault();
                _mindBodyService.GetProducts(mbinterface, User.Identity.Name);
                message = "Success";
            }
            catch (Exception ex)
            {
                message = "error";
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new { message });
        }
    }
}
