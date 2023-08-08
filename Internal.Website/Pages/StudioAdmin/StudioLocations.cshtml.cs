using DataAccess.Contexts;
using DataAccess.Models;
using DataAccess.ViewModels;
using DataService.Constants.Policy;
using DataService.ServiceModels;
using DataService.Services.Interfaces;
using DataService.Utilities;
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
using System.Linq;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllAdmin)]
    public class StudioLocationsModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<StudioLocationsModel> _logger;
        private readonly IMindBodyService _mindBodyService;
        private readonly IStudioService _studioService;
        private readonly IMindBodyFullSync _mindBodyFullSync;
        public StudioLocationsModel(StudioCentralContext context,
                                    IMemoryCache cache,
                                    IMindBodyService mindBodyService,
                                    ILogger<StudioLocationsModel> logger,
                                    IStudioService studioService,
                                    IMindBodyFullSync mindBodyFullSync)
        {
            _logger = logger;
            _cache = cache;
            _context = context;
            _mindBodyService = mindBodyService;
            _studioService = studioService;
            _mindBodyFullSync = mindBodyFullSync;
        }
        [BindProperty]
        public IEnumerable<VwProductDropDownList> Products { get; set; }
        [BindProperty]
        public IEnumerable<StudioViewModel> Studios { get; set; }
        [BindProperty]
        public IEnumerable<TimeZoneInfo> TimeZoneInfos { get; set; }

        [BindProperty]
        public EmailSetting EmailSetting { get; set; }
        [BindProperty]
        public SmsSetting SmsSetting { get; set; }
        [BindProperty]
        public Studio Studio { get; set; }
        [BindProperty]
        public TrainingGymUser UserGym { get; set; }

        public void OnGet()
        {
            try
            {
                var userId = UserUtility.GetUserId(User);
                // get user's Gym
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
                ViewData["gym"] = _context.TrainingGymUser.Where(x => x.AppUserId == UserUtility.GetUserId(User)).Select(c => new GlobalTrainingGym
                {
                    GlobalTrainingGymId = c.GlobalTrainingGymId,
                    GymName = c.GlobalTrainingGym.GymName
                }).ToList();
                ViewData["studios"] = _context.GlobalStudio.Include(x => x.Studio).Where(x => x.GlobalTrainingGymId == gymId).Select(c => new StudioViewModel
                {
                    StudioId = c.StudioId,
                    StudioName = c.Studio.StudioName
                }).ToList();
                ViewData["timezone"] = _studioService.GetTimeZoneAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }

        /* Studio Location Details */
        public JsonResult OnPostRead(int gymId, [DataSourceRequest] DataSourceRequest roRequest)
        {
            try
            {
                gymId = _studioService.GetParentStudioId(gymId, User.Identity.Name);
                Studios = _context.GlobalStudio
                    .Include(x => x.Studio)
                    .Where(x => x.GlobalTrainingGymId == gymId)
                    .Select(c => new StudioViewModel
                    {
                        StudioId = c.Studio.StudioId,
                        StudioName = c.Studio.StudioName,
                        Postcode = c.Studio.Postcode,
                        Email = c.Studio.Email ?? String.Empty,
                        ContactNumber = c.Studio.ContactNumber ?? String.Empty,
                        ActivationCode = c.Studio.ActivationCode,
                        ActivationLink = c.Studio.ActivationLink,
                        IndividualScanProductId = c.Studio.IndividualScanProductId,
                        ChallengeScanProductId = c.Studio.ChallengeScanProductId,
                        SiteId = c.Studio.SiteId,
                        TimeZoneId = c.Studio.TimeZoneId,
                        DateCreated = c.Studio.DateCreated,
                        CreatedById = c.Studio.CreatedById,
                        TimeStamp = c.Studio.TimeStamp
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Studios.ToDataSourceResult(roRequest));
        }
        public JsonResult OnPostCreate([DataSourceRequest] DataSourceRequest roRequest, StudioViewModel studio)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var gym = _cache.Get<GlobalTrainingGym>($"{User.Identity.Name}_Gym");

                    var memberExist = _context.Studio
                        .Where(x => x.StudioName == studio.StudioName)
                        .FirstOrDefault();
                    if (memberExist != null)
                    {
                        ModelState.AddModelError("error", studio.StudioName + " already exist.");
                    }
                    else
                    {
                        Studio newStudio = new Studio()
                        {
                            StudioName = studio.StudioName,
                            Postcode = studio.Postcode,
                            Email = studio.Email,
                            ContactNumber = studio.ContactNumber,
                            IndividualScanProductId = studio.IndividualScanProductId,
                            ChallengeScanProductId = studio.ChallengeScanProductId,
                            TimeZoneId = studio.TimeZoneId,
                            SiteId = studio.SiteId,
                            DateCreated = DateTime.Now,
                            CreatedById = UserUtility.GetUserId(User)
                        };

                        _context.Studio.Add(newStudio);
                        _context.SaveChanges(User.Identity.Name);

                        // assign studio to parent studio
                        GlobalStudio parent = new GlobalStudio()
                        {
                            GlobalTrainingGymId = gym.GlobalTrainingGymId,
                            StudioId = newStudio.StudioId,
                            DateCreated = DateTime.Now,
                            CreatedById = UserUtility.GetUserId(User)
                        };

                        _context.GlobalStudio.Add(parent);
                        _context.SaveChanges(User.Identity.Name);

                        if (studio.IsMindBody)
                        {
                            Mbinterface mbinterface = new Mbinterface()
                            {
                                StudioId = newStudio.StudioId,
                                MindbodyStudioId = newStudio.SiteId ?? 0,
                                DateCreated = DateTime.Now,
                                CreatedById = UserUtility.GetUserId(User)
                            };
                            _context.Mbinterface.Add(mbinterface);
                            _context.SaveChanges(User.Identity.Name);

                            // sync clients from mindbody
                            _mindBodyFullSync.SyncClientsFromMindBodyAsync(mbinterface, UserUtility.GetUserId(User));

                        }
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { studio }.ToDataSourceResult(roRequest, ModelState));
        }
        public JsonResult OnPostUpdate([DataSourceRequest] DataSourceRequest roRequest, StudioViewModel studio)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var memberExist = _context.Studio
                      .Where(x => x.StudioName == studio.StudioName &&
                      x.StudioId != studio.StudioId)
                      .FirstOrDefault();
                    if (memberExist != null)
                    {
                        ModelState.AddModelError("error", studio.StudioName + " already exist.");
                    }
                    else
                    {
                        var uStudio = _context.Studio
                        .Where(x => x.StudioId == studio.StudioId)
                        .FirstOrDefault();

                        uStudio.StudioName = studio.StudioName;
                        uStudio.Postcode = studio.Postcode;
                        uStudio.Email = studio.Email;
                        uStudio.ContactNumber = studio.ContactNumber;
                        uStudio.ChallengeScanProductId = studio.ChallengeScanProductId;
                        uStudio.IndividualScanProductId = studio.IndividualScanProductId;
                        uStudio.SiteId = studio.SiteId;
                        uStudio.TimeZoneId = studio.TimeZoneId;
                        uStudio.ModifiedById = UserUtility.GetUserId(User);
                        uStudio.DateModified = DateTime.Now;
                        _context.Studio.Update(uStudio);

                        if (studio.IsMindBody)
                        {
                            var mbinterface = _context.Mbinterface.FirstOrDefault(x => x.StudioId == studio.StudioId);
                            mbinterface.MindbodyStudioId = studio.SiteId ?? 0;
                            mbinterface.ModifiedById = UserUtility.GetUserId(User);
                            mbinterface.DateModified = DateTime.Now;
                            _context.Update(mbinterface);
                        }

                        _context.SaveChanges(User.Identity.Name);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { studio }.ToDataSourceResult(roRequest, ModelState));
        }
        public JsonResult OnPostDestroy([DataSourceRequest] DataSourceRequest roRequest, StudioViewModel studio)
        {
            var gym = _cache.Get<GlobalTrainingGym>($"{User.Identity.Name}_Gym");
            var gymId = gym.GlobalTrainingGymId;
            try
            {
                var globalStudio = _context.GlobalStudio.FirstOrDefault(x => x.StudioId == studio.StudioId);
                var mbinterface = _context.Mbinterface.FirstOrDefault(x => x.StudioId == studio.StudioId);
                var Studio = _context.Studio.FirstOrDefault(x => x.StudioId == studio.StudioId);

                _context.GlobalStudio.Remove(globalStudio);
                _context.Mbinterface.Remove(mbinterface);
                _context.Studio.Remove(Studio);
                _context.SaveChanges(User.Identity.Name);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return OnPostRead(gymId, roRequest);
        }
        /* Studio Activation Code */
        public JsonResult OnPostGenerateActivationCode(int siteId)
        {
            MindbodyActivationCodeLink result = new MindbodyActivationCodeLink();
            var success = false;
            try
            {
                if (ModelState.IsValid)
                {
                    if (siteId != 0)
                    {
                        result = _mindBodyService.GetActivationCode(siteId);

                        Studio = _context.Studio.Where(x => x.SiteId == siteId).FirstOrDefault();
                        Studio.ActivationCode = result.ActivationCode;
                        Studio.ActivationLink = result.ActivationLink;
                        Studio.ModifiedById = UserUtility.GetUserId(User);
                        Studio.DateModified = DateTime.Now;

                        _context.Update(Studio);
                        _context.SaveChanges(User.Identity.Name);
                        success = true;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new { success, result, errors = ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray() });
        }
        /* Studio Email Setup */
        public JsonResult OnPostReadEmailSettings(int studioId)
        {
            EmailSettingViewModel result = new EmailSettingViewModel();
            try
            {
                EmailSetting = _context.EmailSetting.FirstOrDefault(x => x.StudioId == studioId);
                if (EmailSetting != null)
                {
                    result.MailServer = EmailSetting.MailServer;
                    result.MailPort = EmailSetting.MailPort;
                    result.SenderName = EmailSetting.SenderName;
                    result.Sender = EmailSetting.Sender;
                    result.Password = EmailSetting.Password;
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(result);

        }
        public JsonResult OnPostUpdateEmailSettings(int StudioId, string MailServer, int MailPort, string SenderName, string Sender, string Password)
        {
            EmailSettingViewModel result = new EmailSettingViewModel();

            var success = false;
            try
            {
                if (ModelState.IsValid)
                {
                    EmailSetting = _context.EmailSetting.FirstOrDefault(x => x.StudioId == StudioId);

                    if (EmailSetting != null)
                    {
                        EmailSetting.StudioId = StudioId;
                        EmailSetting.MailServer = MailServer;
                        EmailSetting.MailPort = MailPort;
                        EmailSetting.SenderName = SenderName;
                        EmailSetting.Sender = Sender;
                        EmailSetting.Password = Password;
                        EmailSetting.ModifiedById = UserUtility.GetUserId(User);
                        EmailSetting.DateModified = DateTime.Now;

                        _context.Update(EmailSetting);

                        result.StudioId = StudioId;
                        result.MailServer = MailServer;
                        result.MailPort = MailPort;
                        result.SenderName = SenderName;
                        result.Sender = Sender;
                        result.Password = Password;
                        result.Message = "Record has been successfully updated.";
                    }
                    else
                    {
                        EmailSetting emailSetting = new EmailSetting
                        {
                            StudioId = StudioId,
                            MailServer = MailServer,
                            MailPort = MailPort,
                            SenderName = SenderName,
                            Sender = Sender,
                            Password = Password,
                            CreatedById = UserUtility.GetUserId(User),
                            DateCreated = DateTime.Now
                        };

                        _context.EmailSetting.Add(emailSetting);

                        result.StudioId = StudioId;
                        result.MailServer = MailServer;
                        result.MailPort = MailPort;
                        result.SenderName = SenderName;
                        result.Sender = Sender;
                        result.Password = Password;
                        result.Message = "Record has been successfully created.";

                    }
                    _context.SaveChanges(User.Identity.Name);
                    success = true;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new { success, errors = ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray() });

        }
        /* Studio SMS Setup */
        public JsonResult OnPostReadSmsSettings(int studioId)
        {
            SmsSettingViewModel result = new SmsSettingViewModel();

            try
            {
                SmsSetting = _context.SmsSetting.FirstOrDefault(x => x.StudioId == studioId);
                if (SmsSetting != null)
                {
                    result.AccountSid = SmsSetting.AccountSid;
                    result.AuthToken = SmsSetting.AuthToken;
                    result.Number = SmsSetting.Number;
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(result);

        }
        public JsonResult OnPostUpdateSmsSettings(int StudioId, string AccountSid, string AuthToken, string Number)
        {
            SmsSettingViewModel result = new SmsSettingViewModel();

            var message = string.Empty;
            try
            {
                SmsSetting = _context.SmsSetting.FirstOrDefault(x => x.StudioId == StudioId);

                if (SmsSetting != null)
                {
                    SmsSetting.StudioId = StudioId;
                    SmsSetting.AccountSid = AccountSid;
                    SmsSetting.AuthToken = AuthToken;
                    SmsSetting.Number = Number;
                    SmsSetting.ModifiedById = UserUtility.GetUserId(User);
                    SmsSetting.DateModified = DateTime.Now;

                    _context.Update(SmsSetting);

                    result.StudioId = StudioId;
                    result.AccountSid = AccountSid;
                    result.AuthToken = AuthToken;
                    result.Number = Number;
                    result.Message = "Record has been successfully updated.";
                }
                else
                {
                    SmsSetting smsSetting = new SmsSetting
                    {
                        StudioId = StudioId,
                        AccountSid = AccountSid,
                        AuthToken = AuthToken,
                        Number = Number,
                        CreatedById = UserUtility.GetUserId(User),
                        DateCreated = DateTime.Now
                    };

                    _context.SmsSetting.Add(smsSetting);

                    result.StudioId = StudioId;
                    result.AccountSid = AccountSid;
                    result.AuthToken = AuthToken;
                    result.Number = Number;
                    result.Message = "Record has been successfully created.";

                }
                _context.SaveChanges(User.Identity.Name);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(result);

        }
        /* Studio's Products */
        public JsonResult OnGetReadProducts(int siteId)
        {
            try
            {
                Products = _context.VwProductDropDownList
                .Where(x => x.SiteId == siteId).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Products);
        }
        /* Studio Timezone */
        public JsonResult OnGetReadTimeZone()
        {
            List<TimeZoneViewModel> timeZones = new List<TimeZoneViewModel>();
            try
            {
                TimeZoneInfos = _studioService.GetTimeZoneAsync();
                foreach (var timeZone in TimeZoneInfos)
                {
                    TimeZoneViewModel TZ = new TimeZoneViewModel
                    {
                        TimeZoneId = timeZone.Id,
                        DisplayName = timeZone.DisplayName
                    };
                    timeZones.Add(TZ);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(timeZones);
        }
    }
}