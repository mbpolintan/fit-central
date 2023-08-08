using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.Contexts;
using DataAccess.Models;
using DataService.Services.Interfaces;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using StudioCentral.Authorization.Policy;

namespace StudioCentral.Pages.GlobalAdmin
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.GlobalAdmin)]
    public class BillingConfigModel : PageModel
    {

        private SudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly IMindBodyService _mindBodyService;
        private readonly ILogger<BillingConfigModel> _logger;

        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }

        [BindProperty]
        public IEnumerable<Product> Products { get; set; }
        [BindProperty]
        public IEnumerable<ProductColor> Colors { get; set; }
        [BindProperty]
        public IEnumerable<ProductSize> Sizes { get; set; }

        public BillingConfigModel(SudioCentralContext context, IMemoryCache cache, IMindBodyService mindBodyService,
                                    ILogger<BillingConfigModel> logger)
        {
            _context = context;
            _cache = cache;
            _mindBodyService = mindBodyService;
            _logger = logger;
        }

        public void OnGet()
        {
        }

        public JsonResult OnPostRead([DataSourceRequest] DataSourceRequest roRequest)
        {
            Studios = _context.Studio
                    .Select(x => new Studio
                    {
                        SiteId = x.SiteId,
                        StudioId = x.StudioId,
                        StudioName = x.StudioName
                    })
                    .ToList();

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
            catch(Exception ex)
            {
                message = "error";
                _logger.LogError(ex.Message);
            }
           
            return new JsonResult(new { message});
        }
    }
}
