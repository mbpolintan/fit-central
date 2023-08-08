using DataAccess.Contexts;
using DataAccess.Models;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using StudioCentral.ViewModels;
using StudioCentral.Utilities;
using StudioCentral.Authorization.Policy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;

namespace StudioCentral
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.ALL_ADMINISTRATOR)]
    public class OrphanedScansModel : PageModel
    {
        private SudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<OrphanedScansModel> _logger;

        public OrphanedScansModel(SudioCentralContext context, IMemoryCache cache, ILogger<OrphanedScansModel> logger)
        {
            _logger = logger;
            _context = context;
            _cache = cache;
        }

        [BindProperty]
        public IEnumerable<StudioUser> UserStudios { get; set; }

        [BindProperty]
        public IEnumerable<Member> Members { get; set; }

        [BindProperty]
        public IEnumerable<ScansImport> Imports { get; set; }       

        [BindProperty]
        public IEnumerable<ReportScanViewModel> Scans { get; set; }

        [BindProperty]
        public IList<ErrorMessage> Errors { get; set; }

        public void OnGet()
        {            
            var userCliams = User.Claims.FirstOrDefault(x => x.Type == "name").Value;
            var email = User.Identity.Name;

            // get user's Studios
            UserStudios = _context.StudioUser.Where(x => x.AppUser.UserEmail == email)
            .Select(x => new StudioUser { StudioId = x.StudioId }).ToList();
            var StudioId = UserStudios.FirstOrDefault().StudioId;

            _cache.Set<Studio>($"{User.Identity.Name}_Studio", null);
            if (_cache.Get<Studio>($"{User.Identity.Name}_Studio") == null)
            {
                var Studio = _context.Studio
                    .Where(x => x.StudioId == StudioId)
                    .Select(x => new Studio()
                    {
                        StudioId = x.StudioId,
                        StudioName = x.StudioName
                    }).FirstOrDefault();

                _cache.Set<Studio>($"{User.Identity.Name}_Studio", Studio);
            }            

            PopulateCategories(email);
        }

        private void PopulateCategories(string email)
        {

            Regex pattern = new Regex("['()\t\r\\#-]|[\n]{2}");

            ViewData["membersReport"] = _context.Member.Select(c => new DisplayNameViewModel
            {
                MemberId = c.MemberId,
                DisplayName = pattern.Replace(c.DisplayName, "")
            }).ToList();

            ViewData["scans"] = _context.Scan.Select(c => new Scan
            {
                ScanId = c.ScanId,
                Weight = c.Weight
            }).ToList();

            ViewData["scanner"] = _context.Scanner.Select(c => new Scanner
            {
                ScannerId = c.ScannerId,
                ScannerName = c.ScannerName
            }).ToList();

            ViewData["Studios"] = _context.StudioUser.Where(x => x.AppUser.UserEmail == email).Include(x => x.Studio).Select(x => new Studio
            {
                StudioId = x.StudioId,
                StudioName = x.Studio.StudioName
            }).ToList();

        }

        public JsonResult OnPostRead(int studioId, [DataSourceRequest] DataSourceRequest request)
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

            Imports = _context.ScansImport
              .Select(x => new ScansImport
              {
                  ScansImportId = x.ScansImportId,
                  Scanner = x.Scanner,
                  ScannerId = x.ScannerId,
                  ImportDate = x.ImportDate,
                  ScanCount = x.ScanCount,
                  CreatedScans = x.CreatedScans,
                  UpdatedScans = x.UpdatedScans,
                  TimeStamp = x.TimeStamp
              }).ToList();
            return new JsonResult(Imports.ToDataSourceResult(request));
        }

        public JsonResult OnPostReadScan(int importedScanId, int studioId, [DataSourceRequest] DataSourceRequest request)
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

            Scans = _context.Scan
              .Include(x => x.Member)
              .Where(x => x.ScansImportId == importedScanId
                  //&& x.Member.StudioId == studioId
                  && x.MemberId == null)
              .Select(x => new ReportScanViewModel
              {
                  MemberId = x.MemberId,
                  DisplayName = x.Member.DisplayName,
                  MobileNumber = x.MobileNumber,
                  Weight = x.Weight,
                  Height = x.Height,
                  Age = x.Age,
                  Pbf = x.Pbf,
                  TestDateTime = x.TestDateTime,
                  TimeStamp = x.TimeStamp
              }).ToList();

            //Scans = _context.Scan
            //    .Where(x => x.ScansImportId == importedScanId && x.MemberId == null).ToList();
            return new JsonResult(Scans.ToDataSourceResult(request));

        }

        public JsonResult OnPostUpdateScan([DataSourceRequest] DataSourceRequest request, ReportScanViewModel scan)
        {            

            var member = _context.Member
                .Where(x => x.MemberId == scan.MemberId)
                .AsNoTracking()
                .FirstOrDefault();

            member.ScannerMobile = scan.MobileNumber;
            member.ModifiedById = UserUtility.GetUserId(User);
            member.DateModified = DateTime.Now;
            _context.Update(member);

            var orphanedScan = _context.Scan.Where(x => x.ScanId == scan.ScanId).FirstOrDefault();

            orphanedScan.MemberId = scan.MemberId;
            orphanedScan.ModifiedById = UserUtility.GetUserId(User);
            orphanedScan.DateModified = DateTime.Now;
            _context.Scan.Update(orphanedScan);
            _context.SaveChanges();

            return new JsonResult(new[] { scan }.ToDataSourceResult(request, ModelState));
        }
    }
}