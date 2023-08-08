using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Linq;
using DataAccess.Contexts;
using DataAccess.Models;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using DataAccess.ViewModels;
using Microsoft.AspNetCore.Authorization;
using DataService.Constants.Policy;
using DataService.Utilities;
using DataService.Services.Interfaces;
using DataAccess.Enums;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllUsers)]
    public class VisitReportModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<VisitReportModel> _logger;
        private readonly IStudioService _studioService;
        private readonly IMindBodyService _mindbodyService;

        public VisitReportModel(StudioCentralContext context,
                                IMemoryCache cache,
                                ILogger<VisitReportModel> logger,
                                IStudioService studioService,
                                IMindBodyService mindbodyService)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
            _studioService = studioService;
            _mindbodyService = mindbodyService;
        }

        [BindProperty]
        public IEnumerable<VisitsReportViewModel> Visits { get; set; }
        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }
        [BindProperty]
        public IEnumerable<VwVisits> MemberVisits { get; set; }
        [BindProperty]
        public IEnumerable<ValidateVisit> VisitsUpdates { get; set; }
        [BindProperty]
        public List<Member> Members { get; set; }
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

                _cache.Set<DateFilter>($"{User.Identity.Name}_DateFilter", null);
                if (_cache.Get($"{User.Identity.Name}_DateFilter") == null)
                {
                    var dateFilter = _context.DateFilter
                        .Select(x => new DateFilter()
                        {
                            DateFilterId = x.DateFilterId,
                            Description = x.Description
                        }).FirstOrDefault();

                    _cache.Set($"{User.Identity.Name}_DateFilter", dateFilter);
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
            ViewData["dateFilter"] = _context.DateFilter.OrderBy(x => x.Description).ToList();

            ViewData["Status"] = _context.MemberStatus
            .Where(x => x.MemberStatusId != (int)MemberStatuses.All)
            .Select(x => new MemberStatus
            {
                MemberStatusId = x.MemberStatusId,
                Status = x.Status
            }).OrderBy(x => x.Status).ToList();

            ViewData["Studios"] = _studioService.GetStudios(groupId, userId);
        }

        public JsonResult OnPostRead(int studioId, int dateFilterId, int statusId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                studioId = _studioService.GetStudioId(studioId, User.Identity.Name);                                

                if (dateFilterId != 0)
                {
                    var dateFilter = _context.DateFilter
                      .Where(x => x.DateFilterId == dateFilterId)
                      .Select(x => new DateFilter()
                      {
                          DateFilterId = x.DateFilterId,
                          Description = x.Description
                      }).FirstOrDefault();

                    _cache.Set($"{User.Identity.Name}_DateFilter", dateFilter);


                }
                else
                {
                    var dateFilter = _cache.Get<DateFilter>($"{User.Identity.Name}_DateFilter");
                    dateFilterId = dateFilter.DateFilterId;
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

                int[] memberStatusIds = (statusId == (int)MemberStatuses.ActiveSuspended)
                   ? new int[] { (int)MemberStatuses.Active, (int)MemberStatuses.Suspended }
                   : new int[] { statusId };

                var mbInteface = _context.Mbinterface.FirstOrDefault(x => x.StudioId == studioId);

                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetVisitsReport"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    List<SqlParameter> param = new List<SqlParameter>()
                         {
                             new SqlParameter("@SiteId", SqlDbType.Int) {Value = mbInteface.MindbodyStudioId},
                             new SqlParameter("@DateFilterId", SqlDbType.Int) {Value = dateFilterId}
                         };
                    cmd.Parameters.AddRange(param.ToArray());

                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                        {
                            var visitList = _context.MapToList<VisitsReportViewModel>(result);
                            Visits = visitList.Where(x => memberStatusIds.Contains(x.MemberStatusId)).ToList();
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(Visits.ToDataSourceResult(request));
        }

        public JsonResult OnPostReadMemberVisits(int memberId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {           
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetClientVisits"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@MemberId", SqlDbType.Int) { Value = memberId };

                    cmd.Parameters.Add(param);
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                        {
                            var visitList = _context.MapToList<VwVisits>(result);
                            MemberVisits = visitList.ToList();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(MemberVisits.ToDataSourceResult(request));
        }

        public JsonResult OnPostVisitsUpdates(int studioId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                studioId = _studioService.GetStudioId(studioId, User.Identity.Name);

                VisitsUpdates = _context.ValidateVisit
                    .Where(x => x.StudioId == studioId)
                    .OrderByDescending(x => x.ToDateValidation)
                    .ToList();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(VisitsUpdates.ToDataSourceResult(request));
        }

        public JsonResult OnPostValidateVisits(int studioId, string dateFrom, string dateTo, int statusId)
        {
            var success = false;
            var message = string.Empty;
            try
            {
                int[] memberStatusIds = (statusId == (int)MemberStatuses.ActiveSuspended)
                  ? new int[] { (int)MemberStatuses.Active, (int)MemberStatuses.Suspended }
                  : new int[] { statusId };

                //var validate = _context.ValidateVisit.FirstOrDefault(x => x.ToDateValidation == DateTime.Parse(dateTo));
                //if(validate == null)
                //{
                    var members = statusId != (int)MemberStatuses.All
                    ? _context.Member.Where(x => memberStatusIds.Contains(x.MemberStatusId) && x.StudioId == studioId).ToList()
                    : _context.Member.Where(x => x.StudioId == studioId).ToList();

                    ValidateMemberVisitsViewModel validateParam = new ValidateMemberVisitsViewModel()
                    {
                        Members = members,
                        DateFrom = DateTime.Parse(dateFrom).ToString("s"),
                        DateTo = DateTime.Parse(dateTo).ToString("s"),
                        StudioId = studioId,
                        User = User.Identity.Name
                    };
                    success = _mindbodyService.ValidateMembersVisits(validateParam);
                    //success = true; 
                    //message = "Visits has been successfully validated.";
                    if (success)
                    {
                        ValidateVisit updates = new ValidateVisit()
                        {
                            FromDateValidation = DateTime.Parse(dateFrom),
                            ToDateValidation = DateTime.Parse(dateTo),
                            StudioId = studioId,
                            DateCreated = DateTime.Now
                        };
                        _context.ValidateVisit.Add(updates);
                        _context.SaveChanges(User.Identity.Name);
                        message = "Visits has been successfully validated.";
                    }
                //}
                //else
                //{
                //    message = "Validation failed. Check Date Parameter. Date From must be greater than Last Updated Date.";
                //}                

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new { success, message });
        }

        //public JsonResult OnPostGetVisits(int studioId, int statusId)
        //{
        //    var success = false;
        //    try
        //    {

        //        studioId = _studioService.GetStudioId(studioId, User.Identity.Name);
        //        if (statusId != 0)
        //        {
        //            var Status = _context.MemberStatus
        //              .Where(x => x.MemberStatusId == statusId)
        //              .Select(x => new MemberStatus()
        //              {
        //                  MemberStatusId = x.MemberStatusId,
        //                  Status = x.Status
        //              }).FirstOrDefault();
        //            _cache.Set($"{User.Identity.Name}_Status", Status);
        //        }
        //        else
        //        {
        //            var status = _cache.Get<MemberStatus>($"{User.Identity.Name}_Status");
        //            statusId = status.MemberStatusId;
        //        }
        //        var mbInteface = _context.Mbinterface.FirstOrDefault(x => x.StudioId == studioId);

        //        int[] memberStatusIds = (statusId == (int)MemberStatuses.ActiveSuspended)
        //           ? new int[] { (int)MemberStatuses.Active, (int)MemberStatuses.Suspended }
        //           : new int[] { statusId };

        //        var members = statusId != (int)MemberStatuses.All
        //            ? _context.Member.Where(x => memberStatusIds.Contains(x.MemberStatusId) && x.StudioId == studioId).ToList()
        //            : _context.Member.Where(x => x.StudioId == studioId).ToList();

        //        success = _mindbodyService.SyncClientVisitsFromMindBody(mbInteface, members, User.Identity.Name);

        //    }
        //    catch (Exception e)
        //    {
        //        _logger.LogError(e.Message);
        //        success = false;
        //    }

        //    return new JsonResult(success);
        //}

    }
}
