using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using DataAccess.Contexts;
using Microsoft.Extensions.Caching.Memory;
using DataAccess.Models;
using DataAccess.ViewModels;
using DataService.Constants.Policy;
using DataService.Utilities;
using Microsoft.Extensions.Logging;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllAdmin)]
    public class ScannerManagementModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ScannerManagementModel> _logger;

        public ScannerManagementModel(StudioCentralContext context,
                                    IMemoryCache cache,
                                    ILogger<ScannerManagementModel> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }
        [BindProperty]
        public IEnumerable<StudioScannerViewModel> StudioScanners { get; set; }
        [BindProperty]
        public IEnumerable<Scanner> Scanners { get; set; }
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


        public JsonResult OnPostRead(int gymId, [DataSourceRequest] DataSourceRequest request)
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
                    TimeStamp = c.TimeStamp
                })
                .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Scanners.ToDataSourceResult(request));
        }
        public JsonResult OnPostCreate([DataSourceRequest] DataSourceRequest request, Scanner scanner)
        {
            try
            {
                var exist = _context.Scanner
                                .Where(x => x.ScannerName == scanner.ScannerName &&
                                x.SerialNo == scanner.SerialNo)
                                .FirstOrDefault();
                if (exist != null)
                {
                    ModelState.AddModelError("error", "Scanner " + scanner.ScannerName + " with serial no:" + scanner.SerialNo + " already exist.");
                }
                else
                {
                    scanner.CreatedById = UserUtility.GetUserId(User);
                    scanner.DateCreated = DateTime.Now;
                    _context.Scanner.Add(scanner);
                    _context.SaveChanges(User.Identity.Name);
                    //scanner.CreatedBy = null;
                    //scanner.ModifiedBy = null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { scanner }.ToDataSourceResult(request, ModelState));
        }
        public JsonResult OnPostUpdate([DataSourceRequest] DataSourceRequest request, Scanner scanner)
        {
            try
            {
                var exist = _context.Scanner
                   .Where(x => x.ScannerName == scanner.ScannerName &&
                   x.SerialNo == scanner.SerialNo &&
                   x.ScannerId != scanner.ScannerId)
                   .FirstOrDefault();
                if (exist != null)
                {
                    ModelState.AddModelError("error", "Scanner " + scanner.ScannerName + " with serial no:" + scanner.SerialNo + " already exist.");
                }
                else
                {

                    scanner.ModifiedById = UserUtility.GetUserId(User);
                    scanner.DateModified = DateTime.Now;
                    _context.Update(scanner);
                    _context.SaveChanges(User.Identity.Name);

                    scanner.CreatedBy = null;
                    scanner.ModifiedBy = null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { scanner }.ToDataSourceResult(request, ModelState));
        }
        public JsonResult OnPostDestroy([DataSourceRequest] DataSourceRequest request, Scanner scanner)
        {
            try
            {
                var toDelete = _context.Scanner.FirstOrDefault(x => x.ScannerId == scanner.ScannerId);

                _context.Scanner.Remove(toDelete);
                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { scanner }.ToDataSourceResult(request, ModelState));
        }     
     
        public JsonResult OnPostReadStudio(int scannerId, [DataSourceRequest] DataSourceRequest request)
        {
            try
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
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(StudioScanners.ToDataSourceResult(request));
        }
        public JsonResult OnPostCreateStudio([DataSourceRequest] DataSourceRequest request, StudioScannerViewModel stdScanner)
        {
            try
            {
                var exist = _context.StudioScanner
               .Where(x => x.ScannerId == stdScanner.StudioId)
               .FirstOrDefault();

                if (exist != null)
                {
                    ModelState.AddModelError("error", stdScanner.ScannerId.ToString());
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
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { stdScanner }.ToDataSourceResult(request, ModelState));
        }
        public JsonResult OnPostDestroyStudio([DataSourceRequest] DataSourceRequest request, StudioScannerViewModel stdScanner)
        {
            try
            {
                var studioScanner = _context.StudioScanner.FirstOrDefault(x => x.StudioId == stdScanner.StudioId && x.ScannerId == stdScanner.ScannerId);
                _context.Remove(studioScanner);
                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            
            return new JsonResult(new[] { stdScanner }.ToDataSourceResult(request, ModelState));
        }
        
    }
}
