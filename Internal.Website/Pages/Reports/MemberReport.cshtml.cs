using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
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
using DataService.Constants.Policy;
using DataService.Utilities;
using DataAccess.ViewModels;
using DataAccess.Enums;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllUsers)]
    public class MemberReportModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly IStudioService _studioService;
        private readonly ILogger<MemberReportModel> _logger;

        public MemberReportModel(StudioCentralContext context,
                                IMemoryCache cache,
                                ILogger<MemberReportModel> logger,
                                IStudioService studioService)
        {
            _logger = logger;
            _context = context;
            _cache = cache;
            _studioService = studioService;
        }

        [BindProperty]
        public IList<ErrorMessage> Errors { get; set; }
        [BindProperty]
        public IEnumerable<MemberViewModel> Members { get; set; }
        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }
        [BindProperty]
        public IEnumerable<StudioUser> UserStudios { get; set; }
        [BindProperty]
        public Studio SelectedStudio { get; set; }

        public void OnGet()
        {
            try
            {
                var groupId = UserUtility.GetGroupId(User);
                var userId = UserUtility.GetUserId(User);

                //// get user's Studios
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

                _cache.Set<MemberStatus>($"{User.Identity.Name}_Status", null);
                if (_cache.Get($"{User.Identity.Name}_Status") == null)
                {
                    var Status = _context.MemberStatus
                        .Select(x => new MemberStatus()
                        {
                            MemberStatusId = x.MemberStatusId,
                            Status = x.Status
                        }).FirstOrDefault();

                    _cache.Set($"{User.Identity.Name}_Status", Status);
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

            ViewData["status"] = _context.MemberStatus
            .OrderBy(x => x.StatusOrder)
            .Select(x => new MemberStatus
            {
                MemberStatusId = x.MemberStatusId,
                Status = x.Status
            }).ToList();

            ViewData["Studios"] = _studioService.GetStudios(groupId, userId);
        }

        public JsonResult OnPostRead(int studioId, int statusId, [DataSourceRequest] DataSourceRequest request)
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

                    _cache.Set($"{User.Identity.Name}_Studio", Studio);
                }
                else
                {
                    var loc = _cache.Get<Studio>($"{User.Identity.Name}_Studio");
                    studioId = loc.StudioId;
                }

                if (statusId != 0)
                {
                    var Status = _context.MemberStatus
                      .Where(x => x.MemberStatusId == statusId)
                      .Select(x => new MemberStatus()
                      {
                          MemberStatusId = x.MemberStatusId,
                          Status = x.Status
                      }).FirstOrDefault();

                    _cache.Set($"{User.Identity.Name}_Status", Status);
                }
                else
                {
                    var status = _cache.Get<MemberStatus>($"{User.Identity.Name}_Status");
                    statusId = status.MemberStatusId;
                }

                TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;

                int[] memberStatusIds = (statusId == (int)MemberStatuses.ActiveSuspended)
                ? new int[] { (int)MemberStatuses.Active, (int)MemberStatuses.Suspended }
                : (statusId == (int)MemberStatuses.All)
                ? new int[]
                {   (int)MemberStatuses.Active,
                        (int)MemberStatuses.Expired,
                        (int)MemberStatuses.Terminated,
                        (int)MemberStatuses.NonMember,
                        (int)MemberStatuses.Suspended,
                        (int)MemberStatuses.Declined
                }
                : new int[] { statusId };

                Members = _context.Member.Where(x => x.StudioId == studioId
                        && memberStatusIds.Contains(x.MemberStatusId))
                    .Include(x => x.MemberStatus)
                    .Include(x => x.Gender)
                    .Select(x => new MemberViewModel
                    {
                        MemberId = x.MemberId,
                        StudioId = x.StudioId,
                        MbuniqueId = x.MbuniqueId,
                        DisplayName = x.DisplayName,
                        LastName = !string.IsNullOrEmpty(x.LastName) ? textInfo.ToTitleCase(x.LastName.ToLower()) : x.LastName,
                        FirstName = !string.IsNullOrEmpty(x.FirstName) ? textInfo.ToTitleCase(x.FirstName.ToLower()) : x.FirstName,
                        Email = x.Email,
                        ScannerMobile = x.ScannerMobile,
                        MobilePhone = x.MobilePhone,
                        Height = x.Height,
                        GenderId = x.GenderId,
                        Gender = x.Gender.Description,
                        MemberCategoryId = x.MemberCategoryId,
                        MemberStatusId = x.MemberStatusId,
                        Status = x.MemberStatus.Status,
                        Dob = x.Dob,
                        DateCreated = x.DateCreated,
                        CreatedById = x.CreatedById,
                        TimeStamp = x.TimeStamp,
                        Image = x.Image,
                        ImageURL = x.PhotoUrl ??
                        (x.Image == null ? "/images//images.jfif" : string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(x.Image))),
                        HomePhone = x.HomePhone,
                        WorkPhone = x.WorkPhone,
                        AddressLine1 = x.AddressLine1,
                        AddressLine2 = x.AddressLine2,
                        City = x.City,
                        PostalCode = x.PostalCode,
                        State = x.State,
                        Country = x.Country,
                        Active = x.Active,
                        Action = x.Action,
                        SendAccountEmails = x.SendAccountEmails,
                        SendAccountTexts = x.SendAccountTexts,
                        SendPromotionalEmails = x.SendPromotionalEmails,
                        SendPromotionalTexts = x.SendPromotionalTexts,
                        SendScheduleEmails = x.SendScheduleEmails,
                        SendScheduleTexts = x.SendScheduleTexts
                    }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Members.ToDataSourceResult(request));
        }
    }
}
