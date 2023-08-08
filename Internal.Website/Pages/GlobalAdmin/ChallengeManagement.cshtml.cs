using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using StudioCentral.Authorization.Policy;
using DataAccess.Models;
using DataAccess.Contexts;
using StudioCentral.Utilities;
using StudioCentral.ViewModels;
using Microsoft.Extensions.Caching.Memory;

namespace StudioCentral
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.GlobalAdmin)]
    public class ChallengeManagementModel : PageModel
    {
        private SudioCentralContext _context;
        private readonly IMemoryCache _cache;

        [BindProperty]
        public List<Challenge> Challenges { get; set; }

        [BindProperty]
        public IList<ErrorMessage> Errors { get; set; }

        public ChallengeManagementModel(SudioCentralContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
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

            Challenges = _context.Challenge
                    .Select(c => new Challenge
                    {
                        ChallengeId = c.ChallengeId,
                        ChallengeNo = c.ChallengeNo,
                        StartDate = c.StartDate,
                        EndDate = c.EndDate,
                        StartScanFromDate = c.StartScanFromDate,
                        StartScanToDate = c.StartScanToDate,
                        MidScanFromDate = c.MidScanFromDate,
                        MidScanToDate = c.MidScanToDate,
                        EndScanFromDate = c.EndScanFromDate,
                        EndScanToDate = c.EndScanToDate,
                        CreatedById = c.CreatedById,
                        DateCreated = c.DateCreated,
                        TimeStamp = c.TimeStamp
                    })
                    .ToList();
            return new JsonResult(Challenges.ToDataSourceResult(roRequest));
        }

        public JsonResult OnPostCreate([DataSourceRequest] DataSourceRequest roRequest, Challenge challenge)
        {

            _cache.Set<List<ErrorMessage>>($"{User.Identity.Name}_Errors", null);
            Errors = new List<ErrorMessage>();

            var exist = _context.Challenge
                .Where(x => x.ChallengeNo == challenge.ChallengeNo)
                .FirstOrDefault();
            if (exist != null)
            {
                Errors.Add(new ErrorMessage { Field = "", Message = "Challenge " + challenge.ChallengeNo + " already exist." });
                _cache.Set($"{User.Identity.Name}_Errors", Errors);
                return new JsonResult(new[] { challenge }.ToDataSourceResult(roRequest, ModelState));
            }

            challenge.CreatedById = UserUtility.GetUserId(User);
            challenge.DateCreated = DateTime.Now;
            _context.Challenge.Add(challenge);
            _context.SaveChanges(User.Identity.Name);

            challenge.CreatedBy = null;
            challenge.ModifiedBy = null;

            return new JsonResult(new[] { challenge }.ToDataSourceResult(roRequest, ModelState));
        }


        public JsonResult OnPostUpdate([DataSourceRequest] DataSourceRequest roRequest, Challenge challenge)
        {

            _cache.Set<List<ErrorMessage>>($"{User.Identity.Name}_Errors", null);
            Errors = new List<ErrorMessage>();

            var exist = _context.Challenge
                .Where(x => x.ChallengeNo == challenge.ChallengeNo && 
                        x.ChallengeId != challenge.ChallengeId)
                .FirstOrDefault();

            if (exist != null)
            {
                Errors.Add(new ErrorMessage { Field = "", Message = "Challenge " + challenge.ChallengeNo + " already exist." });
                _cache.Set($"{User.Identity.Name}_Errors", Errors);

                return new JsonResult(new[] { challenge }.ToDataSourceResult(roRequest, ModelState), Errors);
            }

            challenge.ModifiedById = UserUtility.GetUserId(User);
            challenge.DateModified = DateTime.Now;

            _context.Challenge.Update(challenge);
            _context.SaveChanges(User.Identity.Name);

            Challenges.Where(x => x.ChallengeId == challenge.ChallengeId).Select(x => challenge);

            challenge.CreatedBy = null;
            challenge.ModifiedBy = null;

            return new JsonResult(new[] { challenge }.ToDataSourceResult(roRequest, ModelState));
        }

        public JsonResult OnPostDestroy([DataSourceRequest] DataSourceRequest roRequest, Challenge challenge)
        {

            _context.Challenge.Remove(challenge);
            _context.SaveChanges(User.Identity.Name);
            Challenges.Where(x => x.ChallengeId == challenge.ChallengeId).Select(x => challenge);

            return new JsonResult(new[] { challenge }.ToDataSourceResult(roRequest, ModelState));
        }

    }
}