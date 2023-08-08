using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
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
//using Internal.Website.Authorization.Policy;
//using Internal.Website.Utilities;

using DataService.Constants.Policy;
using DataService.Utilities;
using DataAccess.ViewModels;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllUsers)]
    public class ScanBillingReportModel : PageModel
    {

        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ScanBillingReportModel> _logger;
        private readonly IStudioService _studioService;

        public ScanBillingReportModel(StudioCentralContext context,
                                    IMemoryCache cache,
                                    ILogger<ScanBillingReportModel> logger,
                                    IStudioService studioService)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
            _studioService = studioService;
        }

        [BindProperty]
        public IEnumerable<VwScanBillable> ScanBillables { get; set; }
        [BindProperty]
        public IEnumerable<Product> Products { get; set; }
        [BindProperty]
        public IEnumerable<VwChallegeScans> ChallengeScans { get; set; }
        [BindProperty]
        public IEnumerable<VwIndividualScans> IndividualScans { get; set; }
        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }
        [BindProperty]
        public Studio SelectedStudio { get; set; }

        public void OnGet()
        {
            try
            {
                var groupId = UserUtility.GetGroupId(User);
                var userId = UserUtility.GetUserId(User);

                Studios = _studioService.GetStudios(groupId, userId);

                if (_cache.Get<Studio>($"{User.Identity.Name}_Studio") == null)
                {
                    var Studio = Studios.FirstOrDefault();
                    SelectedStudio = Studio;

                    _cache.Set<Studio>($"{User.Identity.Name}_Studio", Studio);
                }
                else
                {
                    var studio = _cache.Get<Studio>($"{User.Identity.Name}_Studio");
                    SelectedStudio = studio;
                }

                PopulateList(groupId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

        }
        private void PopulateList(int groupId, int userId)
        {
            var loc = _cache.Get<Studio>($"{User.Identity.Name}_Studio");
            var studioId = loc.StudioId;

            Regex pattern = new Regex("['()\t\r\\#-]|[\n]{2}");
            ViewData["members"] = _context.Member.Where(x => x.StudioId == studioId).Select(c => new DisplayNameViewModel
            {
                MemberId = c.MemberId,
                DisplayName = pattern.Replace(c.DisplayName, "")
            }).ToList();

            ViewData["scans"] = _context.Scan.Select(c => new Scan
            {
                ScanId = c.ScanId,
                Weight = c.Weight
            }).ToList();

            ViewData["challenge"] = _context.Challenge.Select(c => new Challenge
            {
                ChallengeId = c.ChallengeId,
                ChallengeNo = c.ChallengeNo
            }).ToList();

            ViewData["Studios"] = _studioService.GetStudios(groupId, userId);
        }

        public JsonResult OnPostReadScanBilling(int studioId, [DataSourceRequest] DataSourceRequest request)
        {
            try
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

                    _cache.Set<Studio>($"{User.Identity.Name}_Studio", Studio);
                }
                else
                {
                    var loc = _cache.Get<Studio>($"{User.Identity.Name}_Studio");
                    studioId = loc.StudioId;
                }

                ScanBillables = _context.VwScanBillable.Where(x => x.StudioId == studioId).ToList();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(ScanBillables.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadChallengeScans(int memberId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {

                ChallengeScans = _context.VwChallegeScans
                    .Where(x => x.MemberId == memberId)
                    .Select(x => new VwChallegeScans
                    {
                        MemberId = x.MemberId,
                        ChallengeNo = x.ChallengeNo,
                        StartTestDate = x.StartTestDate,
                        MidTestDate = x.MidTestDate,
                        EndTestDate = x.EndTestDate,
                        StartScanId = x.StartScanId,
                        MidScanId = x.MidScanId,
                        EndScanId = x.EndScanId,
                        BillStatus = x.BillStatus
                    }).OrderByDescending(x => x.BillStatus).ToList();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(ChallengeScans.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadProducts(int studioid, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                var site = _context.Mbinterface.FirstOrDefault(x => x.StudioId == studioid);
                Products = _context.Product
                    .Where(x => x.SiteId == site.MindbodyStudioId).ToList();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Products.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadIndividualScans(int memberId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                IndividualScans = _context.VwIndividualScans
                    .Where(x => x.MemberId == memberId && x.MemberId != null)
                    .Select(x => new VwIndividualScans
                    {
                        MemberId = x.MemberId,
                        TestDateTime = x.TestDateTime,
                        ScanId = x.ScanId,
                        BillStatus = x.BillStatus
                    }).OrderByDescending(x => x.BillStatus).ToList();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(IndividualScans.ToDataSourceResult(request));
        }

        public JsonResult OnPostUpdateIndividualScans(int scanId, byte statusId)
        {
            var message = string.Empty;

            if (scanId != 0)
            {
                var scan = _context.Scan.Where(x => x.ScanId == scanId).FirstOrDefault();
                if (scan != null)
                {
                    scan.BillStatus = statusId;
                    _context.Update(scan);
                    _context.SaveChanges(User.Identity.Name);
                    message = "Scan succesfully updated.";
                }
            }
            else
            {
                message = "Invalid data entry. Please contact your administrator";
            }

            return new JsonResult(message);
        }
        public JsonResult OnPostUpdateChallengeScans(string scanIds, byte statusId)
        {
            var message = string.Empty;

            string[] ids = scanIds.Split(',');


            foreach (var scanId in ids)
            {
                if (int.Parse(scanId) != 0)
                {
                    var scan = _context.Scan.Where(x => x.ScanId == int.Parse(scanId)).FirstOrDefault();

                    if (scan != null)
                    {
                        scan.BillStatus = statusId;
                        _context.Update(scan);
                        _context.SaveChanges(User.Identity.Name);
                        message = "Scan succesfully updated.";
                    }
                }
            }

            return new JsonResult(message);
        }

    }
}
