using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using StudioCentral.Authorization.Policy;
using DataAccess.Contexts;
using Microsoft.Extensions.Caching.Memory;
using DataAccess.Models;
using StudioCentral.Utilities;
using StudioCentral.ViewModels;

namespace StudioCentral
{
    [Authorize(Policy = GroupPolicy.GlobalAdmin)]
    public class ScannerManagementModel : PageModel
    {
        private readonly SudioCentralContext _context;
        private readonly IMemoryCache _cache;

        public ScannerManagementModel(SudioCentralContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public IEnumerable<StudioScannerViewModel> StudioScanners { get; set; }
        public IEnumerable<Scanner> Scanners { get; set; }

        [BindProperty]
        public IList<ErrorMessage> Errors { get; set; }

        public void OnGet()
        {
            if (_cache.Get($"{User.Identity.Name}_Errors") != null)
            {
                Errors = _cache.Get<List<ErrorMessage>>($"{User.Identity.Name}_Errors");
                _cache.Set<List<ErrorMessage>>($"{User.Identity.Name}_Errors", null);
            }
            else
            {
                Errors = new List<ErrorMessage>();
            }

            ViewData["studios"] = _context.Studio.Select(c => new Studio
            {
                StudioId = c.StudioId,
                StudioName = c.StudioName
            }).ToList();

            
        }

        #region Scanners

        public JsonResult OnPostRead([DataSourceRequest] DataSourceRequest roRequest)
        {
            Scanners = _context.Scanner
             .Include(x => x.CreatedBy)
             .Include(x => x.ModifiedBy)
             .Select(c => new Scanner
             {
                 ScannerId = c.ScannerId,
                 ScannerName = c.ScannerName,
                 SerialNo = c.SerialNo ?? "",
                 PurchaseDate = c.PurchaseDate,
                 DateCreated = c.DateCreated,
                 CreatedById = c.CreatedById,
                 //CreatedBy = c.CreatedBy,
                 //ModifiedBy = c.ModifiedBy,
                 TimeStamp = c.TimeStamp

             })
             .ToList();

            return new JsonResult(Scanners.ToDataSourceResult(roRequest));
        }

        public JsonResult OnPostCreate([DataSourceRequest] DataSourceRequest roRequest, Scanner scanner)
        {

            _cache.Set<List<ErrorMessage>>($"{User.Identity.Name}_Errors", null);
            Errors = new List<ErrorMessage>();

            var exist = _context.Scanner
                .Where(x => x.ScannerName == scanner.ScannerName &&
                x.SerialNo == scanner.SerialNo)
                .FirstOrDefault();
            if (exist != null)
            {
                Errors.Add(new ErrorMessage { Field = "", Message = "Scanner " + scanner.ScannerName + " with serial no:" + scanner.SerialNo + " already exist." });
                _cache.Set($"{User.Identity.Name}_Errors", Errors);
                return new JsonResult(new[] { scanner }.ToDataSourceResult(roRequest, ModelState));
            }

            scanner.CreatedById = UserUtility.GetUserId(User);
            scanner.DateCreated = DateTime.Now;
            _context.Scanner.Add(scanner);
            _context.SaveChanges(User.Identity.Name);

            scanner.CreatedBy = null;
            scanner.ModifiedBy = null;
            ModelState.AddModelError(string.Empty, "Recipient(s) cannot be blank");

            return new JsonResult(new[] { scanner }.ToDataSourceResult(roRequest, ModelState));
        }

        public JsonResult OnPostUpdate([DataSourceRequest] DataSourceRequest roRequest, Scanner scanner)
        {
            _cache.Set<List<ErrorMessage>>($"{User.Identity.Name}_Errors", null);
            Errors = new List<ErrorMessage>();

            var exist = _context.Scanner
                .Where(x => x.ScannerName == scanner.ScannerName &&
                x.SerialNo == scanner.SerialNo && 
                x.ScannerId != scanner.ScannerId)
                .FirstOrDefault();
            if (exist != null)
            {
                Errors.Add(new ErrorMessage { Field = "", Message = "Scanner " + scanner.ScannerName + " with serial no:" + scanner.SerialNo + " already exist." });
                _cache.Set($"{User.Identity.Name}_Errors", Errors);
                return new JsonResult(new[] { scanner }.ToDataSourceResult(roRequest, ModelState));
            }

            scanner.ModifiedById = UserUtility.GetUserId(User);
            scanner.DateModified = DateTime.Now;
            _context.Update(scanner);
            _context.SaveChanges(User.Identity.Name);

            scanner.CreatedBy = null;
            scanner.ModifiedBy = null;

            return new JsonResult(new[] { scanner }.ToDataSourceResult(roRequest, ModelState));
        }

        public JsonResult OnPostDestroy([DataSourceRequest] DataSourceRequest roRequest, Scanner scanner)
        {
            var toDelete = _context.Scanner.FirstOrDefault(x => x.ScannerId == scanner.ScannerId);

            _context.Scanner.Remove(toDelete);
            _context.SaveChanges(User.Identity.Name);
            return new JsonResult(new[] { scanner }.ToDataSourceResult(roRequest, ModelState));
        }

        #endregion

        #region Scanner Studios
        public JsonResult OnPostReadStudio(int scannerId, [DataSourceRequest] DataSourceRequest request)
        {
            _cache.Set<Scanner>($"{User.Identity.Name}_Scanner", null);
            if (_cache.Get($"{User.Identity.Name}_Scanner") == null)
            {
                var scanner = _context.Scanner
                    .Where(x => x.ScannerId == scannerId)
                    .Select(x => new Scanner()
                    {
                        ScannerId = x.ScannerId,
                        ScannerName = x.ScannerName
                    }).FirstOrDefault();

                _cache.Set($"{User.Identity.Name}_Scanner", scanner);
            }


            StudioScanners = _context.StudioScanner
            .Where(x => x.ScannerId == scannerId)
             .Select(c => new StudioScannerViewModel
             {
                 ScannerId = c.ScannerId,
                 StudioId = c.StudioId,
                 DateCreated = c.DateCreated,
                 CreatedById = c.CreatedById,
                 TimeStamp = c.TimeStamp
             })
             .ToList();

            return new JsonResult(StudioScanners.ToDataSourceResult(request));
        }

        public JsonResult OnPostCreateStudio([DataSourceRequest] DataSourceRequest request, StudioScannerViewModel stdScanner)
        {

            _cache.Set<List<ErrorMessage>>($"{User.Identity.Name}_Errors", null);
            Errors = new List<ErrorMessage>();

            var exist = _context.StudioScanner
                .Where(x => x.ScannerId == stdScanner.StudioId)
                .FirstOrDefault();
            if (exist != null)
            {
                Errors.Add(new ErrorMessage { Field = "", Message = "Studio already exist." });
                _cache.Set($"{User.Identity.Name}_Errors", Errors);
                return new JsonResult(new[] { stdScanner }.ToDataSourceResult(request, ModelState));
            }

            var scannerId = _cache.Get<Scanner>($"{User.Identity.Name}_Scanner").ScannerId;

            StudioScanner AssignedStudio = new StudioScanner
            {
                StudioId = stdScanner.StudioId,
                ScannerId = scannerId,
                CreatedById = UserUtility.GetUserId(User),
                DateCreated = DateTime.Now
            };
            _context.StudioScanner.Add(AssignedStudio);
            _context.SaveChanges(User.Identity.Name);

            return new JsonResult(new[] { stdScanner }.ToDataSourceResult(request, ModelState));
        }

        public JsonResult OnPostDestroyStudio([DataSourceRequest] DataSourceRequest request, StudioScannerViewModel stdScanner)
        {
            var studioScanner = _context.StudioScanner.FirstOrDefault(x => x.StudioId == stdScanner.StudioId && x.ScannerId == stdScanner.ScannerId);
            _context.Remove(studioScanner);
            _context.SaveChanges(User.Identity.Name);
            return new JsonResult(new[] { stdScanner }.ToDataSourceResult(request, ModelState));
        }
        #endregion
    }
}
