using CsvHelper;
using DataAccess.Contexts;
using DataAccess.Models;
using DataAccess.ViewModels;
using DataService.Constants.Policy;
using DataService.Mapper;
using DataService.Services.Interfaces;
using DataService.Utilities;
using DataService.ViewModels;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllUsers)]
    public class ImportScansModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ImportScansModel> _logger;
        private readonly IStudioService _studioService;

        public ImportScansModel(StudioCentralContext context,
                                IMemoryCache cache,
                                ILogger<ImportScansModel> logger,
                                IStudioService studioService)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
            _studioService = studioService;
        }
        [BindProperty]
        public IEnumerable<CleanedScans> CleanScans { get; set; }
        [BindProperty]
        public IEnumerable<ScanImportViewModel> Imports { get; set; }
        [BindProperty]
        public IEnumerable<CustomSelectListItem> ListItems { get; set; }
        [BindProperty]
        public IEnumerable<Scanner> Scanners { get; set; }
        [BindProperty]
        public IEnumerable<Scan> Scans { get; set; }
        [BindProperty]
        public IEnumerable<ScanViewModel> ScansView { get; set; }
        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }
        [BindProperty]
        public IEnumerable<Studio> StudioScanners { get; set; }

        [BindProperty]
        public Studio SelectedStudio { get; set; }

        public async Task OnGetAsync()
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

                await PopulateList(groupId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

        }
        private async Task PopulateList(int groupId, int userId)
        {
            var loc = _cache.Get<Studio>($"{User.Identity.Name}_Studio");
            var studioId = loc.StudioId;

            Regex pattern = new Regex("['()\t\r\\#-]|[\n]{2}");
            ViewData["members"] = await _context.Member.Where(x => x.StudioId == studioId).Select(c => new DisplayNameViewModel
            {
                MemberId = c.MemberId,
                DisplayName = pattern.Replace(c.DisplayName, "")
            }).ToListAsync();
            ViewData["scans"] = await _context.Scan.Select(c => new Scan
            {
                ScanId = c.ScanId,
                Weight = c.Weight
            }).ToListAsync();
            ViewData["scanner"] = await _context.StudioScanner.Where(x => x.StudioId == studioId).Select(c => new Scanner
            {
                ScannerId = c.ScannerId,
                ScannerName = c.Scanner.ScannerName
            }).ToListAsync();
            ViewData["challenge"] = await _context.Challenge.Select(c => new Challenge
            {
                ChallengeId = c.ChallengeId,
                ChallengeNo = c.ChallengeNo
            }).ToListAsync();
            ViewData["Studios"] = _studioService.GetStudios(groupId, userId);
        }

        public JsonResult OnPostReadScannerStudio(int scannerId)
        {
            try
            {
                StudioScanners = _context.StudioScanner
               .Include(x => x.Studio)
               .Where(x => x.ScannerId == scannerId)
               .Select(x => new Studio
               {
                   StudioName = x.Studio.StudioName
               }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(StudioScanners);
        }
        public JsonResult OnPostReadScanner(int studioId)
        {
            try
            {
                studioId = _studioService.GetStudioId(studioId, User.Identity.Name); 
                Scanners = _context.StudioScanner
               .Include(x => x.Scanner)
               .Where(x => x.StudioId == studioId)
               .Select(x => new Scanner
               {
                   ScannerId = x.ScannerId,
                   ScannerName = x.Scanner.ScannerName
               }).ToList();

                ListItems = Scanners.Select(x => new CustomSelectListItem { Value = x.ScannerId, Text = x.ScannerName }).ToList<CustomSelectListItem>();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(ListItems);
        }
        public JsonResult OnPostRead(int studioId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                studioId = _studioService.GetStudioId(studioId, User.Identity.Name);

                List<int> scannerList = new List<int>();
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

                Imports = _context.ScansImport
                  .Include(x => x.Scanner)
                  .Where(x => scannerIds.Contains(x.ScannerId))
                  .Select(x => new ScanImportViewModel
                  {
                      ScansImportId = x.ScansImportId,
                      ScannerName = x.Scanner.ScannerName,
                      ScannerId = x.ScannerId,
                      UpdatedScans = x.UpdatedScans,
                      CreatedScans = x.CreatedScans,
                      ImportedFileName = x.ImportedFileName,
                      ImportDate = x.ImportDate,
                      ScanCount = x.ScanCount,
                      TimeStamp = x.TimeStamp
                  }).ToList();


            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Imports.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadScan(int importedScanId, int studioId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                studioId = _studioService.GetStudioId(studioId, User.Identity.Name);

                ScansView = _context.Scan
                .Include(x => x.Member)
                .Where(x => x.ScansImportId == importedScanId
                    && x.Member.StudioId == studioId
                    && x.MemberId != null)
                .Select(x => new ScanViewModel
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
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(ScansView.ToDataSourceResult(request));

        }
        public async Task<JsonResult> OnPostDestroyAsync([DataSourceRequest] DataSourceRequest request, ScanImportViewModel import)
        {
            var message = string.Empty;

            try
            {
                Scans = await _context.Scan.Where(x => x.ScansImportId == import.ScansImportId).ToListAsync();
                CleanScans = await _context.CleanedScans.Where(x => x.ScansImportId == import.ScansImportId).ToListAsync();

                if (Scans.Count() != 0)
                {
                    _context.Scan.RemoveRange(Scans);
                }

                if (CleanScans.Count() != 0)
                {
                    _context.CleanedScans.RemoveRange(CleanScans);
                }

                var importscan = await _context.ScansImport.Where(x => x.ScansImportId == import.ScansImportId).FirstOrDefaultAsync();

                _context.ScansImport.Remove(importscan);
                await _context.SaveChangesAsync(User.Identity.Name);

                _logger.LogInformation("Import scan deleted scanned date: " + import.DateCreated);

                message = "Imported scans successfully deleted.";

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                message = "Failed to delete imported scans!";
            }

            var studioId = _studioService.GetStudioId(0, User.Identity.Name);

            return OnPostRead(studioId, request);
            //return new JsonResult(new[] { import }.ToDataSourceResult(request));
        }

        #region Import scan
        public async Task<ActionResult> OnPostSubmit()
        {
            try
            {
                var files = Request.Form.Files.FirstOrDefault();
                var scannerId = Request.Form["ScannerId"].ToString();
                
                List<ScanCSVViewModel> records = new List<ScanCSVViewModel>();
                using (var stream = new MemoryStream())
                {
                    files.CopyTo(stream);
                    stream.Seek(0, SeekOrigin.Begin);
                    using (var reader = new StreamReader(stream))
                    {
                        using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
                        {
                            csv.Configuration.RegisterClassMap<ScansMap>();
                            records = csv.GetRecords<ScanCSVViewModel>().ToList();
                        }
                        reader.Dispose();
                    }
                    stream.Dispose();
                }

                // create ScansImport
                ScansImport imports = new ScansImport()
                {
                    ImportDate = DateTime.Now,
                    ScannerId = int.Parse(scannerId),
                    ScanCount = records.Count(),
                    ImportedFileName = files.FileName,
                    CreatedById = UserUtility.GetUserId(User),
                    DateCreated = DateTime.Now
                };

                await _context.ScansImport.AddAsync(imports);
                await _context.SaveChangesAsync(User.Identity.Name);
               
                int scansImportId = imports.ScansImportId;
                //clean-up
                foreach (var record in records)
                {
                    DateTime? Datetime = null;
                    var phoneNumber = record.MobileNumber.ToString().Trim();
                    var mobileNNumber = phoneNumber.Substring(1, phoneNumber.Length - 2);
                    var Date = record.TestDateTime.Trim() == "-" ? string.Empty : record.TestDateTime.Trim();
                    var testDatetime = !string.IsNullOrEmpty(Date) ? DateTime.Parse(Date) : Datetime;

                    var existingRecord = await _context.CleanedScans
                        .Where(x => x.MobileNumber == mobileNNumber
                                && x.TestDateTime == testDatetime
                                && x.FileName == files.FileName)
                        .FirstOrDefaultAsync();

                    if (existingRecord == null)
                    {
                        var Member = await _context.Member.Where(x => x.MobilePhone == mobileNNumber || x.ScannerMobile == mobileNNumber).FirstOrDefaultAsync();

                        CleanedScans scan = new CleanedScans()
                        {
                            CleanedScanId = Guid.NewGuid(),
                            FileName = files.FileName,
                            ScansImportId = scansImportId,
                            MobileNumber = mobileNNumber,
                            MemberId = Member?.MemberId,
                            Height = record.Height.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Height.Trim()),
                            GenderId = record.Gender.Trim() != string.Empty ? record.Gender.Trim() == "M" ? 1 : 2 : 3,
                            Age = record.Age.Trim() == "-" ? int.Parse("0") : int.Parse(record.Age.Trim().Substring(0, record.Age.Trim().Length - 2)),
                            TestDateTime = testDatetime,
                            Weight = record.Weight.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Weight.Trim()),
                            LlweightNormalRange = record.LlweightNormalRange.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.LlweightNormalRange.Trim()),
                            UlweightNormalRange = record.UlweightNormalRange.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.UlweightNormalRange.Trim()),
                            Tbw = record.Tbw.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Tbw.Trim()),
                            Lltbw = record.Lltbw.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Lltbw.Trim()),
                            Ultbw = record.Ultbw.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ultbw.Trim()),
                            Icw = record.Icw.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Icw.Trim()),
                            Llicw = record.Llicw.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llicw.Trim()),
                            Ulicw = record.Ulicw.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulicw.Trim()),
                            Ecw = record.Ecw.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ecw.Trim()),
                            Llecw = record.Llecw.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llecw.Trim()),
                            Ulecw = record.Ulecw.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulecw.Trim()),
                            Protein = record.Protein.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Protein.Trim()),
                            Llprotein = record.Llprotein.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llprotein.Trim()),
                            Ulprotein = record.Ulprotein.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulprotein.Trim()),
                            Minerals = record.Minerals.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Minerals.Trim()),
                            Llminerals = record.Llminerals.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llminerals.Trim()),
                            Ulminerals = record.Ulminerals.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulminerals.Trim()),
                            Bfm = record.Bfm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Bfm.Trim()),
                            Llbfm = record.Llbfm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llbfm.Trim()),
                            Ulbfm = record.Ulbfm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulbfm.Trim()),
                            Slm = record.Slm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Slm.Trim()),
                            Llslm = record.Llslm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llslm.Trim()),
                            Ulslm = record.Ulslm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulslm.Trim()),
                            Ffm = record.Ffm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ffm.Trim()),
                            Llffm = record.Llffm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llffm.Trim()),
                            Ulffm = record.Ulffm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulffm.Trim()),
                            Smm = record.Smm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Smm.Trim()),
                            Llsmm = record.Llsmm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llsmm.Trim()),
                            Ulsmm = record.Ulsmm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulsmm.Trim()),
                            Bmi = record.Bmi.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Bmi.Trim()),
                            Llbmi = record.Llbmi.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llbmi.Trim()),
                            Ulbmi = record.Ulbmi.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulbmi.Trim()),
                            Pbf = record.Pbf.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Pbf.Trim()),
                            Llpbf = record.Llpbf.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llpbf.Trim()),
                            Ulpbf = record.Ulpbf.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulpbf.Trim()),
                            FfmrightArm = record.FfmrightArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.FfmrightArm.Trim()),
                            LlffmrightArm = record.LlffmrightArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.LlffmrightArm.Trim()),
                            UlffmrightArm = record.UlffmrightArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.UlffmrightArm.Trim()),
                            FfmpercRightArm = record.FfmpercRightArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.FfmpercRightArm.Trim()),
                            FfmleftArm = record.FfmleftArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.FfmleftArm.Trim()),
                            LlffmleftArm = record.LlffmleftArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.LlffmleftArm.Trim()),
                            UlffmleftArm = record.UlffmleftArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.UlffmleftArm.Trim()),
                            FfmpercLeftArm = record.FfmpercLeftArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.FfmpercLeftArm.Trim()),
                            Ffmtrunk = record.Ffmtrunk.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ffmtrunk.Trim()),
                            Llffmtrunk = record.Llffmtrunk.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llffmtrunk.Trim()),
                            Ulffmtrunk = record.Ulffmtrunk.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulffmtrunk.Trim()),
                            FfmpercTrunk = record.FfmpercTrunk.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.FfmpercTrunk.Trim()),
                            FfmrightLeg = record.FfmrightLeg.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.FfmrightLeg.Trim()),
                            LlffmrightLeg = record.LlffmrightLeg.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.LlffmrightLeg.Trim()),
                            UlffmrightLeg = record.UlffmrightLeg.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.UlffmrightLeg.Trim()),
                            FfmpercRightLeg = record.FfmpercRightLeg.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.FfmpercRightLeg.Trim()),
                            FfmleftLeg = record.FfmleftLeg.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.FfmleftLeg.Trim()),
                            LlffmleftLeg = record.LlffmleftLeg.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.LlffmleftLeg.Trim()),
                            UlffmleftLeg = record.UlffmleftLeg.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.UlffmleftLeg.Trim()),
                            FfmpercLeftLeg = record.FfmpercLeftLeg.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.FfmpercLeftLeg.Trim()),
                            Ecwtbw = record.Ecwtbw.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ecwtbw.Trim()),
                            BfmrightArm = record.BfmrightArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.BfmrightArm.Trim()),
                            BfmpercRightArm = record.BfmpercRightArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.BfmpercRightArm.Trim()),
                            BfmleftArm = record.BfmleftArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.BfmleftArm.Trim()),
                            BfmpercLeftArm = record.BfmpercLeftArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.BfmpercLeftArm.Trim()),
                            Bfmtrunk = record.Bfmtrunk.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Bfmtrunk.Trim()),
                            BfmpercTrunk = record.BfmpercTrunk.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.BfmpercTrunk.Trim()),
                            BfmrightLeg = record.BfmrightLeg.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.BfmrightLeg.Trim()),
                            BfmpercRightLeg = record.BfmpercRightLeg.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.BfmpercRightLeg.Trim()),
                            BfmleftLeg = record.BfmleftLeg.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.BfmleftLeg.Trim()),
                            BfmpercLeftLeg = record.BfmpercLeftLeg.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.BfmpercLeftLeg.Trim()),
                            InBodyScore = record.InBodyScore.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.InBodyScore.Trim()),
                            TargetWeight = record.TargetWeight.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.TargetWeight.Trim()),
                            WeightControl = record.WeightControl.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.WeightControl.Trim()),
                            Bfmcontrol = record.Bfmcontrol.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Bfmcontrol.Trim()),
                            Ffmcontrol = record.Ffmcontrol.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ffmcontrol.Trim()),
                            Bmr = record.Bmr.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Bmr.Trim()),
                            Whr = record.Whr.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Whr.Trim()),
                            Llwhr = record.Llwhr.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llwhr.Trim()),
                            Ulwhr = record.Ulwhr.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulwhr.Trim()),
                            Vfl = record.Vfl.Trim() == "-" ? int.Parse("0") : int.Parse(record.Vfl.ToString().ToUpper().Replace("LEVEL", string.Empty).Trim()),
                            ObesityDegree = record.ObesityDegree.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.ObesityDegree.Trim()),
                            LlobesityDegree = record.LlobesityDegree.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.LlobesityDegree.Trim()),
                            UlobesityDegree = record.UlobesityDegree.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.UlobesityDegree.Trim()),
                            Bcm = record.Bcm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Bcm.Trim()),
                            Llbcm = record.Llbcm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llbcm.Trim()),
                            Ulbcm = record.Ulbcm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulbcm.Trim()),
                            Ac = record.Ac.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ac.Trim()),
                            Amc = record.Amc.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Amc.Trim()),
                            Bmc = record.Bmc.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Bmc.Trim()),
                            Llbmc = record.Llbmc.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Llbmc.Trim()),
                            Ulbmc = record.Ulbmc.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Ulbmc.Trim()),
                            _5kHzRaimpedance = record._5kHzRaimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._5kHzRaimpedance.Trim()),
                            _5kHzLaimpedance = record._5kHzLaimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._5kHzLaimpedance.Trim()),
                            _5kHzTrimpedance = record._5kHzTrimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._5kHzTrimpedance.Trim()),
                            _5kHzRlimpedance = record._5kHzRlimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._5kHzRlimpedance.Trim()),
                            _5kHzLlimpedance = record._5kHzLlimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._5kHzLlimpedance.Trim()),
                            _50kHzRaimpedance = record._50kHzRaimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._50kHzRaimpedance.Trim()),
                            _50kHzLaimpedance = record._50kHzLaimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._50kHzLaimpedance.Trim()),
                            _50kHzTrimpedance = record._50kHzTrimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._50kHzTrimpedance.Trim()),
                            _50kHzRlimpedance = record._50kHzRlimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._50kHzRlimpedance.Trim()),
                            _50kHzLlimpedance = record._50kHzLlimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._50kHzLlimpedance.Trim()),
                            _500kHzRaimpedance = record._500kHzRaimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._500kHzRaimpedance.Trim()),
                            _500kHzLaimpedance = record._500kHzLaimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._500kHzLaimpedance.Trim()),
                            _500kHzTrimpedance = record._500kHzTrimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._500kHzTrimpedance.Trim()),
                            _500kHzRlimpedance = record._500kHzRlimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._500kHzRlimpedance.Trim()),
                            _500kHzLlimpedance = record._500kHzLlimpedance.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record._500kHzLlimpedance.Trim()),
                            Mcneck = record.Mcneck.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Mcneck.Trim()),
                            Mcchest = record.Mcchest.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Mcchest.Trim()),
                            Mcabdomen = record.Mcabdomen.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Mcabdomen.Trim()),
                            Mchip = record.Mchip.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Mchip.Trim()),
                            McrightArm = record.McrightArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.McrightArm.Trim()),
                            McleftArm = record.McleftArm.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.McleftArm.Trim()),
                            McrightThigh = record.McrightThigh.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.McrightThigh.Trim()),
                            McleftThigh = record.McleftThigh.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.McleftThigh.Trim()),
                            GrowthScore = record.GrowthScore.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.GrowthScore.Trim()),
                            ObesityDegreeChild = record.ObesityDegreeChild.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.ObesityDegreeChild.Trim()),
                            LlobesityDegreeChildNormalRange = record.LlobesityDegreeChildNormalRange.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.LlobesityDegreeChildNormalRange.Trim()),
                            UlobesityDegreeChildNormalRange = record.UlobesityDegreeChildNormalRange.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.UlobesityDegreeChildNormalRange.Trim()),
                            Systolic = record.Systolic.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Systolic.Trim()),
                            Diastolic = record.Diastolic.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Diastolic.Trim()),
                            Pulse = record.Pulse.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Pulse.Trim()),
                            MeanArteryPressure = record.MeanArteryPressure.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.MeanArteryPressure.Trim()),
                            PulsePressure = record.PulsePressure.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.PulsePressure.Trim()),
                            RatePressureProduct = record.RatePressureProduct.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.RatePressureProduct.Trim()),
                            Smi = record.Smi.Trim() == "-" ? decimal.Parse("0.00") : decimal.Parse(record.Smi.Trim()),
                            CreatedById = UserUtility.GetUserId(User),
                            DateCreated = DateTime.Now
                        };
                        await _context.CleanedScans.AddAsync(scan);
                        await _context.SaveChangesAsync(User.Identity.Name);
                    }
                    
                }
                //Call store proc that update the pro table.
                await _context.Database.ExecuteSqlRawAsync("uspInsertCleanedScans {0}", scansImportId);

              
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return Redirect("/Scans/ImportScans");
        }
        #endregion
    }
}