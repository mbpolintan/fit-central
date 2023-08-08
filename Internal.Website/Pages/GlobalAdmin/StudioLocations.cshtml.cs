using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using StudioCentral.Authorization.Policy;
using DataAccess.Contexts;
using DataAccess.Models;
using StudioCentral.Utilities;
using Microsoft.Extensions.Caching.Memory;
using StudioCentral.ViewModels;
using Microsoft.Extensions.Logging;
using DataService.Services.Interfaces;
using DataService.Models;
using System.Data.Entity;

namespace StudioCentral
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.GlobalAdmin)]
    public class StudioLocationsModel : PageModel
    {
        private SudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<StudioLocationsModel> _logger;
        private readonly IMindBodyService _mindBodyService;

        [BindProperty]
        public List<StudioViewModel> Studios { get; set; }

        [BindProperty]
        public Studio Studio { get; set; }

        [BindProperty]
        public IList<ErrorMessage> Errors { get; set; }

        [BindProperty]
        public EmailSetting EmailSetting { get; set; }
        [BindProperty]
        public SmsSetting SmsSetting { get; set; }

        [BindProperty]
        public IEnumerable<VwProductDropDownList> Products { get; set; }

        public StudioLocationsModel(SudioCentralContext context, IMemoryCache cache, IMindBodyService mindBodyService, ILogger<StudioLocationsModel> logger)
        {
            _logger = logger;
            _context = context;
            _cache = cache;
            _mindBodyService = mindBodyService;
        }

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
        }

        public JsonResult OnPostRead([DataSourceRequest] DataSourceRequest roRequest)
        {
            try
            {
                Studios = _context.Studio
                    .Select(c => new StudioViewModel
                    {
                        StudioId = c.StudioId,
                        StudioName = c.StudioName,
                        Postcode = c.Postcode,
                        Email = c.Email ?? String.Empty,
                        ContactNumber = c.ContactNumber ?? String.Empty,
                        ActivationCode = c.ActivationCode,
                        ActivationLink = c.ActivationLink,
                        IndividualScanProductId = c.IndividualScanProductId,
                        ChallengeScanProductId = c.ChallengeScanProductId,
                        SiteId = c.SiteId,
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

            return new JsonResult(Studios.ToDataSourceResult(roRequest));
        }

        public JsonResult OnPostCreate([DataSourceRequest] DataSourceRequest roRequest, StudioViewModel studio)
        {
            try
            {
                _cache.Set<List<ErrorMessage>>($"{User.Identity.Name}_Errors", null);
                Errors = new List<ErrorMessage>();

                var memberExist = _context.Studio
                    .Where(x => x.StudioName == studio.StudioName)
                    .FirstOrDefault();
                if (memberExist != null)
                {
                    Errors.Add(new ErrorMessage { Field = "", Message = studio.StudioName + " already exist." });
                    _cache.Set($"{User.Identity.Name}_Errors", Errors);
                    return new JsonResult(new[] { studio }.ToDataSourceResult(roRequest, ModelState));
                }

                Studio newStudio = new Studio()
                {
                    StudioName = studio.StudioName,
                    Postcode = studio.Postcode,
                    Email = studio.Email,
                    ContactNumber = studio.ContactNumber,
                    IndividualScanProductId = studio.IndividualScanProductId,
                    ChallengeScanProductId = studio.ChallengeScanProductId,
                    SiteId = studio.SiteId,
                    DateCreated = DateTime.Now,
                    CreatedById = UserUtility.GetUserId(User)
                };

                _context.Studio.Add(newStudio);
                _context.SaveChanges(User.Identity.Name);

                Mbinterface mbinterface = new Mbinterface()
                {
                    StudioId = newStudio.StudioId,
                    MindbodyStudioId = newStudio.SiteId ?? 0,
                    DateCreated = DateTime.Now,
                    CreatedById = UserUtility.GetUserId(User)
                };

                _context.Mbinterface.Add(mbinterface);
                _context.SaveChanges(User.Identity.Name);

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
                _cache.Set<List<ErrorMessage>>($"{User.Identity.Name}_Errors", null);
                Errors = new List<ErrorMessage>();

                var memberExist = _context.Studio
                    .Where(x => x.StudioName == studio.StudioName &&
                    x.StudioId != studio.StudioId)
                    .FirstOrDefault();
                if (memberExist != null)
                {
                    Errors.Add(new ErrorMessage { Field = "", Message = studio.StudioName + " already exist." });
                    _cache.Set($"{User.Identity.Name}_Errors", Errors);
                    return new JsonResult(new[] { studio }.ToDataSourceResult(roRequest, ModelState));
                }

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
                uStudio.ModifiedById = UserUtility.GetUserId(User);
                uStudio.DateModified = DateTime.Now;
                _context.Studio.Update(uStudio);


                var mbinterface = _context.Mbinterface.FirstOrDefault(x => x.StudioId == studio.StudioId);
                mbinterface.MindbodyStudioId = studio.SiteId ?? 0;
                mbinterface.ModifiedById = UserUtility.GetUserId(User);
                mbinterface.DateModified = DateTime.Now;
                _context.Update(mbinterface);

                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { studio }.ToDataSourceResult(roRequest, ModelState));
        }

        public JsonResult OnPostDestroy([DataSourceRequest] DataSourceRequest roRequest, StudioViewModel studio)
        {
            try
            {

                var Studio = _context.Studio.FirstOrDefault(x => x.StudioId == studio.StudioId);
                var mbinterface = _context.Mbinterface.FirstOrDefault(x => x.StudioId == studio.StudioId);

                _context.Mbinterface.Remove(mbinterface);
                _context.Studio.Remove(Studio);
                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return OnPostRead(roRequest);
        }

        public JsonResult OnPostGenerateActivationCode(int siteId)
        {
            MindbodyActivationCodeLink result = new MindbodyActivationCodeLink();
            try
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

                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(result);

        }

        public JsonResult OnPostReadEmailSettings(int studioId)
        {
            EmailSettingViewModel result = new EmailSettingViewModel();

            try
            {
                EmailSetting = _context.EmailSetting.FirstOrDefault(x => x.StudioId == studioId);
                if(EmailSetting != null)
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
           
            var message = string.Empty;
            try
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
                    EmailSetting emailSetting = new EmailSetting();
                    emailSetting.StudioId = StudioId;
                    emailSetting.MailServer = MailServer;
                    emailSetting.MailPort = MailPort;
                    emailSetting.SenderName = SenderName;
                    emailSetting.Sender = Sender;
                    emailSetting.Password = Password;
                    emailSetting.CreatedById = UserUtility.GetUserId(User);
                    emailSetting.DateCreated = DateTime.Now;                    

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

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(result);

        }

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

        public JsonResult OnGetReadProducts(int siteId)
        {
            try
            {
                //Products = _context.Product
                //.Where(x => x.SiteId == siteId).ToList();

                //Products = (from prod in _context.Product
                //            join color in _context.ProductColor on prod.ProductId equals color.ProductId
                //            join size in _context.ProductSize on prod.ProductId equals size.ProductId
                //            where prod.SiteId == siteId
                //            select new ProductViewModel
                //            {
                //                ProductId = prod.ProductId,
                //                Name = prod.Name,
                //                NameDisplay = prod.Name + " - $" + prod.Price +  " (color: " + color.Name + "/size: " + size.Name + ")"  
                //            }).ToList();

                Products = _context.VwProductDropDownList
                .Where(x => x.SiteId == siteId).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Products);
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

                    _context.Update(EmailSetting);

                    result.StudioId = StudioId;
                    result.AccountSid = AccountSid;
                    result.AuthToken = AuthToken;
                    result.Number = Number;
                    result.Message = "Record has been successfully updated.";
                }
                else
                {
                    SmsSetting smsSetting = new SmsSetting();
                    smsSetting.StudioId = StudioId;
                    smsSetting.AccountSid = AccountSid;
                    smsSetting.AuthToken = AuthToken;
                    smsSetting.Number = Number;
                    smsSetting.CreatedById = UserUtility.GetUserId(User);
                    smsSetting.DateCreated = DateTime.Now;

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
    }
}