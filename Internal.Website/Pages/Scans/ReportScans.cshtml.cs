using DataAccess.Contexts;
using DataAccess.Models;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using DataAccess.ViewModels;
using DataService.Constants.Policy;
using DataService.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using DataService.Services.Interfaces;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllUsers)]
    public class ReportScansModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ReportScansModel> _logger;
        private readonly IStudioService _studioService;

        public ReportScansModel(StudioCentralContext context,
                                IMemoryCache cache,
                                ILogger<ReportScansModel> logger,
                                IStudioService studioService)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
            _studioService = studioService;
        }

        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }
        [BindProperty]
        public IEnumerable<ScansImport> Imports { get; set; }
        [BindProperty]
        public IEnumerable<ReportScanViewModel> Scans { get; set; }
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

                List<int> studios = new List<int>();

                foreach (var userstudio in Studios)
                {
                    studios.Add(userstudio.StudioId);
                }

                var studioIds = studios.ToArray();

                Regex pattern = new Regex("['()\t\r\\#-]|[\n]{2}");
                ViewData["membersReport"] = _context.Member
                    .Where(x => studioIds.Contains(x.StudioId))
                    .Select(c => new DisplayNameViewModel
                    {
                        MemberId = c.MemberId,
                        DisplayName = pattern.Replace(c.DisplayName, "")
                    }).ToList();

                ViewData["Studios"] = _studioService.GetStudios(groupId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }

        public JsonResult OnPostRead(int studioId, int scanStatusId, [DataSourceRequest] DataSourceRequest request)
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

                //get import scanId scanner
                List<int> scannerList = new List<int>();
                List<int> scannerImportList = new List<int>();

                var scanners = _context.StudioScanner
                        .Where(x => x.StudioId == studioId)
                        .Select(c => new Scanner
                        {
                            ScannerId = c.ScannerId,
                            ScannerName = c.Scanner.ScannerName
                        }).ToList();

                foreach (var scanner in scanners)
                {
                    scannerList.Add(scanner.ScannerId);
                }

                var scannerIds = scannerList.ToArray();

                var Imports = _context.ScansImport
                  .Include(x => x.Scanner)
                  .Where(x => scannerIds.Contains(x.ScannerId))
                  .Select(x => new ScanImportViewModel
                  {
                      ScansImportId = x.ScansImportId,
                      ScannerId = x.ScannerId,
                      UpdatedScans = x.UpdatedScans,
                      CreatedScans = x.CreatedScans,
                      ImportDate = x.ImportDate,
                      ScanCount = x.ScanCount,
                      TimeStamp = x.TimeStamp
                  }).ToList();

                foreach (var import in Imports)
                {
                    scannerImportList.Add(import.ScansImportId);
                }
                var scanImportIds = scannerImportList.ToArray();

                scanStatusId = (scanStatusId != 0) ? scanStatusId : 1;

                if (scanStatusId == 1)
                {
                    Scans = _context.Scan
                    .Include(x => x.Member)
                    .Where(x => scanImportIds.Contains(x.ScansImportId)
                    && x.Member.StudioId == studioId
                    && x.IsHidden == false
                    && x.MemberId != null)
                    .Select(x => new ReportScanViewModel
                    {
                        ScanId = x.ScanId,
                        MemberId = x.MemberId,
                        DisplayName = x.Member.DisplayName,
                        MobileNumber = x.MobileNumber,
                        Weight = x.Weight,
                        Height = x.Height,
                        Age = x.Age,
                        InBodyScore = x.InBodyScore,
                        Pbf = x.Pbf,
                        Vfl = x.Vfl,
                        Smm = x.Smm,
                        TestDateTime = x.TestDateTime,
                        CreatedById = x.CreatedById,
                        DateCreated = x.DateCreated,
                        TimeStamp = x.TimeStamp,
                        IsHidden = x.IsHidden
                    }).OrderByDescending(x => x.TestDateTime).ToList();
                }
                else
                {
                    Scans = _context.Scan
                    .Include(x => x.Member)
                    .Where(x => scanImportIds.Contains(x.ScansImportId)
                        && x.IsHidden == false
                        && x.MemberId == null
                        && x.TestDateTime > DateTime.Parse("01/01/2014"))
                    .Select(x => new ReportScanViewModel
                    {
                        ScanId = x.ScanId,
                        MemberId = x.MemberId,
                        DisplayName = x.Member.DisplayName,
                        MobileNumber = x.MobileNumber,
                        Weight = x.Weight,
                        Height = x.Height,
                        Age = x.Age,
                        InBodyScore = x.InBodyScore,
                        Pbf = x.Pbf,
                        Vfl = x.Vfl,
                        Smm = x.Smm,
                        TestDateTime = x.TestDateTime,
                        CreatedById = x.CreatedById,
                        DateCreated = x.DateCreated,
                        TimeStamp = x.TimeStamp,
                        IsHidden = x.IsHidden
                    }).OrderByDescending(x => x.TestDateTime).ToList();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Scans.ToDataSourceResult(request));
        }
        public JsonResult OnPostUpdate([DataSourceRequest] DataSourceRequest request, ReportScanViewModel scan)
        {
            try
            {
                var member = _context.Member
                .Where(x => x.MemberId == scan.MemberId)
                //.AsNoTracking()
                .FirstOrDefault();
                member.MobilePhone = scan.MobileNumber;
                member.ScannerMobile = scan.MobileNumber;
                member.ModifiedById = UserUtility.GetUserId(User);
                member.DateModified = DateTime.Now;
                _context.Update(member);
                //_context.SaveChanges(User.Identity.Name);

                var orphanedScans = _context.Scan.Where(x => x.MobileNumber == member.MobilePhone).ToList();

                foreach(var orphanedScan in orphanedScans)
                {
                    var uScan = _context.Scan.Where(x => x.ScanId == orphanedScan.ScanId).FirstOrDefault();
                    uScan.MemberId = scan.MemberId;
                    uScan.ModifiedById = UserUtility.GetUserId(User);
                    uScan.DateModified = DateTime.Now;
                    _context.Update(uScan);
                }
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { scan }.ToDataSourceResult(request, ModelState));
        }
        public JsonResult OnPostDestroy([DataSourceRequest] DataSourceRequest request, ReportScanViewModel scan)
        {
            try
            {
                var orphanedScan = _context.Scan.Where(x => x.ScanId == scan.ScanId).FirstOrDefault();
                orphanedScan.IsHidden = true;

                _context.Scan.Update(orphanedScan);
                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { scan }.ToDataSourceResult(request, ModelState));
        }

    }
}