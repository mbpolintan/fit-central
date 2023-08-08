using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DataAccess.ViewModels;
using DataAccess.Contexts;
using DataAccess.Models;
using DataService.Constants.Policy;
using DataService.Utilities;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using DataService.Services.Interfaces;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using System.Data;
using DataAccess.Enums;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllUsers)]
    public class ChallengeSetupModel : PageModel
    {
        private StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ChallengeSetupModel> _logger;
        private readonly IStudioService _studioService;
        private readonly IMindBodyService _mindBodyService;

        public ChallengeSetupModel(StudioCentralContext context,
                                    IMemoryCache cache,
                                    ILogger<ChallengeSetupModel> logger,
                                    IStudioService studioService,
                                    IMindBodyService mindBodyService)
        {
            _logger = logger;
            _context = context;
            _cache = cache;
            _studioService = studioService;
            _mindBodyService = mindBodyService;
        }
        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }
        [BindProperty]
        public IEnumerable<ChallengeStudio> ChallengeSetup { get; set; }
        [BindProperty]
        public IEnumerable<ChallengeMemberViewModel> ChallengeMembers { get; set; }
        [BindProperty]
        public IEnumerable<Member> Members { get; set; }
        [BindProperty]
        public IEnumerable<Challenge> GymChallenges { get; set; }
        [BindProperty]
        public IEnumerable<ScoringSystem> ScoringSystems { get; set; }
        [BindProperty]
        public IEnumerable<ChallengeLeaderBoardViewModel> ChallengeMemberList { get; set; }
        [BindProperty]
        public IEnumerable<ScanViewModel> Scans { get; set; }
        [BindProperty]
        public IEnumerable<ChallengeVisitPerWeekViewModel> Visits { get; set; }
        [BindProperty]
        public IEnumerable<ChallengeGenderCount> GenderCount { get; set; }
        [BindProperty]
        public ChallengeScanImageViewModel ScanImage { get; set; }
        [BindProperty]
        public ScanImage ScannedImage { get; set; }
        [BindProperty]
        public Studio SelectedStudio { get; set; }
        [BindProperty]
        public ScanImageViewModel ScannedImages { get; set; }
        [BindProperty]
        public ChallengeSetup Challenges { get; set; }

        public void OnGet()
        {
            try
            {
                var groupId = UserUtility.GetGroupId(User);
                var userId = UserUtility.GetUserId(User);

                Studios = _studioService.GetStudios(groupId, userId);
                var studio = Studios.FirstOrDefault();

                if (_cache.Get<Studio>($"{User.Identity.Name}_Studio") == null)
                {
                    studio = Studios.FirstOrDefault();
                    SelectedStudio = studio;
                    _cache.Set<Studio>($"{User.Identity.Name}_Studio", studio);
                }
                else
                {
                    studio = _cache.Get<Studio>($"{User.Identity.Name}_Studio");
                    SelectedStudio = studio;
                }

                var gym = _context.GlobalStudio.FirstOrDefault(x => x.StudioId == studio.StudioId);
                _cache.Set<GlobalStudio>($"{User.Identity.Name}_GymStudio", gym);

                var gymId = gym.GlobalTrainingGymId;
                PopulateList(groupId, userId, gymId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }
        private void PopulateList(int groupId, int userId, int gymId)
        {
            ViewData["members"] = _context.Member
                .Select(c => new Member
                {
                    MemberId = c.MemberId,
                    DisplayName = c.DisplayName
                })
                .ToList();

            ViewData["scans"] = _context.Scan
                .Select(c => new Scan
                {
                    ScanId = c.ScanId,
                    Weight = c.Weight,
                    Pbf = c.Pbf,
                    Vfl = c.Vfl,
                    Smm = c.Smm
                })
                .ToList();

            ViewData["Studios"] = _studioService.GetStudios(groupId, userId);

            ViewData["challenge"] = _context.Challenge
                .Where(x => x.GlobalTrainingGymId == gymId)
                .Select(x => new Challenge
                {
                    ChallengeId = x.ChallengeId,
                    ChallengeNo = x.ChallengeNo
                })
                .OrderByDescending(x => x.ChallengeNo)
                .ToList();

            ViewData["challengeType"] = _context.ChallengeType
                .Select(x => new ChallengeType
                {
                    ChallengeTypeId = x.ChallengeTypeId,
                    Type = x.Type
                })
                .ToList();

            ViewData["status"] = _context.MemberStatus
             .OrderBy(x => x.StatusOrder)
             .Select(x => new MemberStatus
             {
                 MemberStatusId = x.MemberStatusId,
                 Status = x.Status
             })
             .ToList();

            ViewData["scoring"] = _context.ScoringSystem.ToList();

            ViewData["appointments"] = GetScheduleData();
        }
        public void OnPostSave()
        {
            var imagefile = Request.Form.Files.FirstOrDefault();
            var challengeMemberId = Request.Form["challengeMemberId"].ToString();
            var memberId = Request.Form["memberId"].ToString();
            var view = Request.Form["view"].ToString();

            if (imagefile != null)
            {
                try
                {
                    byte[] bytesImage;
                    using (var memoryStream = new MemoryStream())
                    {
                        imagefile.CopyTo(memoryStream);
                        bytesImage = memoryStream.ToArray();

                        memoryStream.Close();
                        memoryStream.Dispose();
                    }

                    ScannedImage = _context.ScanImage
                        .Where(x => x.ChallengeMemberId == int.Parse(challengeMemberId) && x.MemberId == int.Parse(memberId))
                        .Select(x => new ScanImage
                        {
                            ChallengeMemberId = x.ChallengeMemberId,
                            MemberId = x.MemberId,
                            ScanImageId = x.ScanImageId,
                            BeforeFrontImage = x.BeforeFrontImage,
                            BeforeBackImage = x.BeforeBackImage,
                            BeforeSideImage = x.BeforeSideImage,
                            AfterFrontImage = x.AfterFrontImage,
                            AfterBackImage = x.AfterBackImage,
                            AfterSideImage = x.AfterSideImage,
                            CreatedById = x.CreatedById,
                            DateCreated = x.DateCreated,
                            ModifiedById = x.ModifiedById,
                            DateModified = x.DateModified,
                            TimeStamp = x.TimeStamp
                        }).FirstOrDefault();

                    if (ScannedImage != null)
                    {
                        switch (view)
                        {
                            case "beforefrontview":
                                ScannedImage.BeforeFrontImage = bytesImage;
                                break;
                            case "beforesideview":
                                ScannedImage.BeforeSideImage = bytesImage;
                                break;
                            case "beforebackview":
                                ScannedImage.BeforeBackImage = bytesImage;
                                break;
                            case "afterfrontview":
                                ScannedImage.AfterFrontImage = bytesImage;
                                break;
                            case "aftersideview":
                                ScannedImage.AfterSideImage = bytesImage;
                                break;
                            case "afterbackview":
                                ScannedImage.AfterBackImage = bytesImage;
                                break;
                            default:
                                break;
                        }

                        ScannedImage.ModifiedById = UserUtility.GetUserId(User);
                        ScannedImage.DateModified = DateTime.Now;
                        _context.Update(ScannedImage);
                    }
                    else
                    {
                        ScanImage img = new ScanImage();

                        switch (view)
                        {
                            case "BeforeFrontImage":
                                img.BeforeFrontImage = bytesImage;
                                break;
                            case "BeforeSideImage":
                                img.BeforeSideImage = bytesImage;
                                break;
                            case "BeforeBackImage":
                                img.BeforeBackImage = bytesImage;
                                break;
                            case "AfterFrontImage":
                                img.AfterFrontImage = bytesImage;
                                break;
                            case "AfterSideImage":
                                img.AfterSideImage = bytesImage;
                                break;
                            case "AfterBackImage":
                                img.AfterBackImage = bytesImage;
                                break;
                            default:
                                break;
                        }

                        img.ChallengeMemberId = int.Parse(challengeMemberId);
                        img.MemberId = int.Parse(memberId);
                        img.CreatedById = UserUtility.GetUserId(User);
                        img.DateCreated = DateTime.Now;
                        _context.ScanImage.Add(img);
                    }
                    _context.SaveChanges(User.Identity.Name);
                }
                catch (Exception e)
                {
                    _logger.LogError(e.Message);
                }
            }
        }

        public JsonResult OnGetReadGymChallenges(int studioId)
        {
            try
            {
                studioId = _studioService.GetStudioId(studioId, User.Identity.Name);

                var gym = _context.GlobalStudio.FirstOrDefault(x => x.StudioId == studioId);
                _cache.Set<GlobalStudio>($"{User.Identity.Name}_GymStudio", gym);

                GymChallenges = _context.Challenge
                    .Where(x => x.GlobalTrainingGymId == gym.GlobalTrainingGymId)
                    .Select(c => new Challenge
                    {
                        ChallengeId = c.ChallengeId,
                        ChallengeNo = c.ChallengeNo
                    }).OrderByDescending(x => x.ChallengeNo).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(GymChallenges);
        }
        public JsonResult OnPostReadChallenge(int challengeId, int studioId, [DataSourceRequest] DataSourceRequest request)
        {
            ChallengeStudio challegeStudio = new ChallengeStudio();
            try
            {
                studioId = _studioService.GetStudioId(studioId, User.Identity.Name);

                var gym = _cache.Get<GlobalStudio>($"{User.Identity.Name}_GymStudio");

                challegeStudio = _context.ChallengeStudio.FirstOrDefault(x => x.StudioId == studioId && x.ChallengeId == challengeId);

                Challenges = _context.Challenge
                .Where(x => x.ChallengeId == challengeId
                    && x.GlobalTrainingGymId == gym.GlobalTrainingGymId)
                .Select(x => new ChallengeSetup()
                {
                    ChallengeId = x.ChallengeId,
                    ChallengeNo = x.ChallengeNo,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    StartScanFromDate = x.StartScanFromDate,
                    StartScanToDate = x.StartScanToDate,
                    MidScanFromDate = x.MidScanFromDate,
                    MidScanToDate = x.MidScanToDate,
                    EndScanFromDate = x.EndScanFromDate,
                    EndScanToDate = x.EndScanToDate
                }).FirstOrDefault();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(new { Challenges, challegeStudio });
        }
        public JsonResult OnPostReadScoringSystem([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                ScoringSystems = _context.ScoringSystem.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(ScoringSystems.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadMembers(int studioId, int statusId, int challengeId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                if (statusId != 0)
                {
                    studioId = _studioService.GetStudioId(studioId, User.Identity.Name);

                    int[] memberStatusIds = (statusId == (int)MemberStatuses.ActiveSuspended)
                            ? new int[] { (int)MemberStatuses.Active, (int)MemberStatuses.Suspended }
                            : (statusId == (int)MemberStatuses.All)
                            ? new int[]
                            {
                                (int)MemberStatuses.Active,
                                (int)MemberStatuses.Expired,
                                (int)MemberStatuses.NonMember,
                                (int)MemberStatuses.Terminated,
                                (int)MemberStatuses.Suspended,
                                (int)MemberStatuses.Declined
                            }
                            : new int[] { statusId };


                    Members = from c in _context.Member
                              where c.StudioId == studioId &&
                              memberStatusIds.Contains(c.MemberStatusId) &&
                              !(from o in _context.ChallengeMember
                                where o.ChallengeId == challengeId
                                select o.MemberId)
                                     .Contains(c.MemberId)
                              select c;
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(Members.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadSelectedMembers(string Ids, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                string[] ids = Ids.Split(',');

                Members = _context.Member.Where(x => ids.Contains(x.MemberId.ToString())).OrderBy(x => x.LastName).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(Members.ToDataSourceResult(request));
        }
        public async Task<JsonResult> OnPostReadChallengeMemberAsync(int challengeId, int studioId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                studioId = await _studioService.GetStudioIdAsync(studioId, User.Identity.Name);

                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetChallengeMember"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    List<SqlParameter> param = new List<SqlParameter>()
                    {
                        new SqlParameter("@ChallengeId", SqlDbType.Int) {Value = challengeId},
                        new SqlParameter("@StudioId", SqlDbType.Int) {Value = studioId}
                    };
                    cmd.Parameters.AddRange(param.ToArray());
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                        {
                            ChallengeMembers = _context.MapToList<ChallengeMemberViewModel>(result);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(ChallengeMembers.ToDataSourceResult(request));

        }
        public async Task<JsonResult> OnPostCreateChallengeMemberAsync(string Ids, int challengeId)
        {
            string[] ids = Ids.Split(',');
            var result = false;

            try
            {
                foreach (var id in ids)
                {
                    //var scans = _context.Scan
                    //    .Where(x => x.MemberId == int.Parse(id) 
                    //    && (x.TestDateTime >= challenge.StartDate && x.TestDateTime <= challenge.EndDate))
                    //    .ToList();

                    //var startScan = scans.Where(x => x.TestDateTime >= challenge.StartScanFromDate && x.TestDateTime <= challenge.StartScanToDate).FirstOrDefault();
                    //var midScan = scans.Where(x => x.TestDateTime >= challenge.MidScanFromDate && x.TestDateTime <= challenge.MidScanToDate).FirstOrDefault();
                    //var endScan = scans.Where(x => x.TestDateTime >= challenge.EndScanFromDate && x.TestDateTime <= challenge.EndScanToDate).FirstOrDefault();                                        

                    ChallengeMember challengeMember = new ChallengeMember
                    {
                        ChallengeId = challengeId,
                        MemberId = int.Parse(id),
                        //StartScanId = startScan?.ScanId,
                        //MidScanId = midScan?.ScanId,
                        //EndScanId = endScan?.ScanId,
                        CreatedById = UserUtility.GetUserId(User),
                        DateCreated = DateTime.Now
                    };
                    _context.ChallengeMember.Add(challengeMember);
                    _context.SaveChanges(User.Identity.Name);

                    var challengeMemberid = challengeMember.ChallengeMemberId;

                    await _context.Database.ExecuteSqlRawAsync("uspUpdateChallengeScans {0}", challengeMemberid);

                    result = true;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(result);
        }
        public JsonResult OnPostDestroyChallengeMember([DataSourceRequest] DataSourceRequest request, ChallengeMember challengeMember)
        {
            var memberToDelete = _context.ChallengeMember.FirstOrDefault(x => x.ChallengeMemberId == challengeMember.ChallengeMemberId);
            _context.ChallengeMember.Remove(memberToDelete);
            _context.SaveChanges(User.Identity.Name);

            return new JsonResult(new[] { challengeMember }.ToDataSourceResult(request, ModelState));
        }
        public JsonResult OnPostScanImage(int challengeMemberId, int memberId, int studioId, int challengeId)
        {
            try
            {
                var challengeStudio = _context.ChallengeStudio.FirstOrDefault(x => x.StudioId == studioId && x.ChallengeId == challengeId);
                var challengeMemberScore = _context.ChallengeMember.FirstOrDefault(x => x.ChallengeMemberId == challengeMemberId);
                var ScannedImage = _context.ScanImage
                .Where(x => x.ChallengeMemberId == challengeMemberId && x.MemberId == memberId)
                .Select(x => new ScanImage
                {
                    BeforeFrontImage = x.BeforeFrontImage,
                    BeforeBackImage = x.BeforeBackImage,
                    BeforeSideImage = x.BeforeSideImage,
                    AfterFrontImage = x.AfterFrontImage,
                    AfterBackImage = x.AfterBackImage,
                    AfterSideImage = x.AfterSideImage
                }).FirstOrDefault();

                if (ScannedImage != null)
                {

                    ScannedImages.BeforeFront = (ScannedImage.BeforeFrontImage != null) ?
                                                 string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(ScannedImage.BeforeFrontImage)) :
                                                 "/images/images.jfif";

                    ScannedImages.BeforeSide = (ScannedImage.BeforeSideImage != null) ?
                                                 string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(ScannedImage.BeforeSideImage)) :
                                                 "/images/images.jfif";

                    ScannedImages.BeforeBack = (ScannedImage.BeforeBackImage != null) ?
                                                 string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(ScannedImage.BeforeBackImage)) :
                                                 "/images/images.jfif";

                    ScannedImages.AfterFront = (ScannedImage.AfterFrontImage != null) ?
                                               string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(ScannedImage.AfterFrontImage)) :
                                               "/images/images.jfif";

                    ScannedImages.AfterSide = (ScannedImage.AfterSideImage != null) ?
                                                 string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(ScannedImage.AfterSideImage)) :
                                                 "/images/images.jfif";

                    ScannedImages.AfterBack = (ScannedImage.AfterBackImage != null) ?
                                               string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(ScannedImage.AfterBackImage)) :
                                                 "/images/images.jfif";
                }
                else
                {
                    ScannedImages.BeforeFront = "/images/images.jfif";
                    ScannedImages.BeforeSide = "/images/images.jfif";
                    ScannedImages.BeforeBack = "/images/images.jfif";
                    ScannedImages.AfterFront = "/images/images.jfif";
                    ScannedImages.AfterSide = "/images/images.jfif";
                    ScannedImages.AfterBack = "/images/images.jfif";
                }

                ScannedImages.MaxScore = challengeStudio.ImageScore ?? 0;
                ScannedImages.ImageScore = challengeMemberScore.ImageScore;

            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
            }

            return new JsonResult(new { ScannedImages });
        }
        public JsonResult OnPostUpdateMemberScore(int memberId, int challengeMemberId, int score)
        {
            var message = string.Empty;
            var result = false;
            var challengeMember = _context.ChallengeMember.Where(x => x.ChallengeMemberId == challengeMemberId && x.MemberId == memberId).FirstOrDefault();

            if (challengeMember != null)
            {
                challengeMember.ImageScore = score;
                _context.SaveChanges(User.Identity.Name);
                message = "Score updated.";
                result = true;
            }
            else
            {
                message = "Member not found in the challenge.";
            }

            return new JsonResult(new { message, result });
        }
        public JsonResult OnPostAssignStudio(int challengeId, int imageScore, int studioId, int scoringSystemId)
        {

            var success = false;
            var message = string.Empty;
            try
            {
                var challengeStudio = _context.ChallengeStudio.FirstOrDefault(x => x.StudioId == studioId && x.ChallengeId == challengeId);

                if (challengeStudio != null)
                {
                    challengeStudio.ImageScore = imageScore;
                    challengeStudio.ScoringSystemId = scoringSystemId;
                    challengeStudio.DateModified = DateTime.Now;
                    _context.Update(challengeStudio);
                    success = true;
                    message = "Successfully updated challenge studio.";
                }
                else
                {
                    ChallengeStudio newChallengeStudio = new ChallengeStudio()
                    {
                        ChallengeId = challengeId,
                        StudioId = studioId,
                        ScoringSystemId = scoringSystemId,
                        ImageScore = imageScore,
                        DateCreated = DateTime.Now
                    };
                    _context.ChallengeStudio.Add(newChallengeStudio);
                    success = true;
                    message = "Successfully created challenge studio.";
                }
                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new { success, message });
        }
        public JsonResult OnPostSaveScreenShot(int challengeMemberId, int memberId, string image, string view)
        {
            var result = false;
            var message = string.Empty;
            try
            {
                var imagetaken = image.Split(",");
                byte[] bytesImage = Convert.FromBase64String(imagetaken[1]);

                var ScannedImage = _context.ScanImage
                    .Where(x => x.ChallengeMemberId == challengeMemberId
                    && x.MemberId == memberId).FirstOrDefault();

                if (ScannedImage != null)
                {
                    switch (view)
                    {
                        case "beforefrontview":
                            ScannedImage.BeforeFrontImage = bytesImage;
                            break;
                        case "beforesideview":
                            ScannedImage.BeforeSideImage = bytesImage;
                            break;
                        case "beforebackview":
                            ScannedImage.BeforeBackImage = bytesImage;
                            break;
                        case "afterfrontview":
                            ScannedImage.AfterFrontImage = bytesImage;
                            break;
                        case "aftersideview":
                            ScannedImage.AfterSideImage = bytesImage;
                            break;
                        case "afterbackview":
                            ScannedImage.AfterBackImage = bytesImage;
                            break;
                        default:
                            break;
                    }
                    ScannedImage.DateModified = DateTime.Now;
                    ScannedImage.ModifiedById = UserUtility.GetUserId(User);
                    _context.Update(ScannedImage);

                }
                else
                {
                    byte[] BeforeFrontImage = null;
                    byte[] BeforeSideImage = null;
                    byte[] BeforeBackImage = null;
                    byte[] AfterFrontImage = null;
                    byte[] AfterSideImage = null;
                    byte[] AfterBackImage = null;

                    switch (view)
                    {
                        case "beforefrontview":
                            BeforeFrontImage = bytesImage;
                            break;
                        case "beforesideview":
                            BeforeSideImage = bytesImage;
                            break;
                        case "beforebackview":
                            BeforeBackImage = bytesImage;
                            break;
                        case "afterfrontview":
                            AfterFrontImage = bytesImage;
                            break;
                        case "aftersideview":
                            AfterSideImage = bytesImage;
                            break;
                        case "afterbackview":
                            AfterBackImage = bytesImage;
                            break;
                        default:
                            break;
                    }

                    ScanImage scanImage = new ScanImage()
                    {
                        ChallengeMemberId = challengeMemberId,
                        MemberId = memberId,
                        BeforeFrontImage = BeforeFrontImage,
                        BeforeSideImage = BeforeSideImage,
                        BeforeBackImage = BeforeBackImage,
                        AfterFrontImage = AfterFrontImage,
                        AfterSideImage = AfterSideImage,
                        AfterBackImage = AfterBackImage,
                        DateCreated = DateTime.Now,
                        CreatedById = UserUtility.GetUserId(User)
                    };
                    _context.ScanImage.Add(scanImage);

                }
                _context.SaveChanges(User.Identity.Name);
                result = true;
                message = "Success";
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                message = "Error";
            }

            return new JsonResult(new { result, message });

        }

        public JsonResult OnPostReadTopChart(int studioId, int challengeId, int leaderboardTypeId, [DataSourceRequest] DataSourceRequest roRequest)
        {
            try
            {
                studioId = _studioService.GetStudioId(studioId, User.Identity.Name);

                if (challengeId != 0)
                {
                    using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                    {
                        cmd.CommandText = "dbo.uspGetChallengeGenderStats"; //sp name
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        List<SqlParameter> param = new List<SqlParameter>()
                         {
                             new SqlParameter("@ChallengeId", SqlDbType.Int) {Value = challengeId},
                             new SqlParameter("@StudioId", SqlDbType.Int) {Value = studioId},
                             new SqlParameter("@LeaderBoardType", SqlDbType.Int) {Value = leaderboardTypeId}
                         };
                        cmd.Parameters.AddRange(param.ToArray());
                        _context.Database.OpenConnection();

                        using (var result = cmd.ExecuteReader())
                        {
                            if (result.HasRows)
                            {
                                var challengeGenderCount = _context.MapToList<ChallengeGenderCount>(result);
                                var genderCount = challengeGenderCount.FirstOrDefault();
                                GenderCount = challengeGenderCount;

                                double aveMale = double.Parse(genderCount.Male.ToString()) / double.Parse(genderCount.TMember.ToString()) * 100;
                                double aveFemale = double.Parse(genderCount.Female.ToString()) / double.Parse(genderCount.TMember.ToString()) * 100;
                                double aveUndisclose = double.Parse(genderCount.Undisclose.ToString()) / double.Parse(genderCount.TMember.ToString()) * 100;

                                foreach (var gender in GenderCount)
                                {
                                    gender.AverageMale = Math.Round(aveMale, 2);
                                    gender.AverageFemale = Math.Round(aveFemale, 2);
                                    gender.AverageUndisclose = Math.Round(aveUndisclose, 2);
                                    gender.WithContent = true;
                                };
                            }
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(GenderCount.ToDataSourceResult(roRequest));
        }
        public JsonResult OnPostRead(int studioId, int challengeId, int leaderboardTypeId, [DataSourceRequest] DataSourceRequest roRequest)
        {
            try
            {
                // assign studioId
                studioId = _studioService.GetStudioId(studioId, User.Identity.Name);
                if (challengeId == 0)
                {
                    var challenge = _context.Challenge.OrderByDescending(x => x.ChallengeNo).FirstOrDefault();
                    challengeId = challenge.ChallengeId;
                }

                var scoringTemplate = _context.ChallengeStudio.Where(x => x.ChallengeId == challengeId && x.StudioId == studioId).FirstOrDefault();
                var gym = _context.GlobalStudio.FirstOrDefault(x => x.StudioId == studioId);

                if (scoringTemplate != null)
                {
                    using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                    {
                        cmd.CommandText = "dbo.uspGetChallengeLeaderBoard"; //sp name
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        List<SqlParameter> param = new List<SqlParameter>()
                        {
                            new SqlParameter("@ChallengeId", SqlDbType.Int) {Value = challengeId},
                            new SqlParameter("@StudioId", SqlDbType.Int) {Value = studioId},
                            new SqlParameter("@LeaderBoardType", SqlDbType.Int) {Value = leaderboardTypeId}
                        };

                        cmd.Parameters.AddRange(param.ToArray());
                        _context.Database.OpenConnection();

                        using (var result = cmd.ExecuteReader())
                        {
                            if (result.HasRows)
                                ChallengeMemberList = _context.MapToList<ChallengeLeaderBoardViewModel>(result);
                        }
                    }

                    foreach (var member in ChallengeMemberList)
                    {
                        member.LeaderboardTypeId = leaderboardTypeId;
                        switch (scoringTemplate.ScoringSystemId)
                        {
                            case (int)ScoringTemplate.WeightedSystem:
                                var imageScoreW = GetWeightedScore(decimal.Parse(member.ImageScore.ToString()), gym.GlobalTrainingGymId, "Before/After Pictures");
                                var inbodyScoreW = GetWeightedScore(member.EndInBodyTotal.Value, gym.GlobalTrainingGymId, "InBody Score");
                                var weightScoreW = GetWeightedScore(member.EndWeightTotal.Value, gym.GlobalTrainingGymId, "Weight Loss");
                                var pbfScoreW = GetWeightedScore(member.EndPbftotal.Value, gym.GlobalTrainingGymId, "PBF Loss");
                                var smmScoreW = GetWeightedScore(member.EndSmmtotal.Value, gym.GlobalTrainingGymId, "SMM Gain");
                                var vflScoreW = GetWeightedScore(member.EndVfltotal.Value, gym.GlobalTrainingGymId, "VFL");
                                var AttendedScoreW = GetWeightedScore(member.AttendedClass.Value, gym.GlobalTrainingGymId, "Class Attendances");
                                member.AccumulatedScore = imageScoreW + inbodyScoreW + weightScoreW + pbfScoreW + smmScoreW + vflScoreW + AttendedScoreW;
                                break;

                            case (int)ScoringTemplate.PointSystem:
                                var imageScoreP = GetPointScore(decimal.Parse(member.ImageScore.ToString()), gym.GlobalTrainingGymId, (int)Types.IMAGE);
                                var inbodyScoreP = GetPointScore(member.EndInBodyTotal.Value, gym.GlobalTrainingGymId, (int)Types.INBODY);
                                var weightScoreP = GetPointScore(member.EndWeightTotal.Value, gym.GlobalTrainingGymId, (int)Types.WEIGHT);
                                var pbfScoreP = GetPointScore(member.EndPbftotal.Value, gym.GlobalTrainingGymId, (int)Types.PBF);
                                var smmScoreP = GetPointScore(member.EndSmmtotal.Value, gym.GlobalTrainingGymId, (int)Types.SMM);
                                var vflScoreP = GetPointScore(member.EndVfltotal.Value, gym.GlobalTrainingGymId, (int)Types.VFL);
                                var AttendedScoreP = GetPointScore(member.AttendedClass.Value, gym.GlobalTrainingGymId, (int)Types.ATTENDANCE);
                                member.AccumulatedScore = imageScoreP + inbodyScoreP + weightScoreP + pbfScoreP + smmScoreP + vflScoreP + AttendedScoreP;
                                break;
                        }
                    }
                }
                else
                {
                    ModelState.AddModelError("error", "No scoring system assigned to this challenge!");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            var newResult = ChallengeMemberList.OrderByDescending(x => x.AccumulatedScore).ToList();

            return new JsonResult(newResult.ToDataSourceResult(roRequest));
        }

        public JsonResult OnPostReadScanChart(int challengeMemberId)
        {
            ScanChartViewModel scanChart = new ScanChartViewModel();
            try
            {
                if (challengeMemberId != 0)
                {
                    using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                    {
                        cmd.CommandText = "dbo.uspGetMemberScanInChallenge"; //sp name
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        List<SqlParameter> param = new List<SqlParameter>()
                    {
                        new SqlParameter("@ChallengeMemberId", SqlDbType.Int) {Value = challengeMemberId}
                    };

                        cmd.Parameters.AddRange(param.ToArray());
                        _context.Database.OpenConnection();

                        using (var result = cmd.ExecuteReader())
                        {
                            if (result.HasRows)
                                Scans = _context.MapToList<ScanViewModel>(result);
                        }
                    }

                    List<string> dateTime = new List<string>();
                    List<string> inBodyScore = new List<string>();
                    List<string> weight = new List<string>();
                    List<string> pbf = new List<string>();
                    List<string> smm = new List<string>();
                    List<string> vfl = new List<string>();

                    foreach (var scan in Scans)
                    {
                        dateTime.Add(scan.TestDateTime.Value.ToString("dd/MM/yyyy"));
                        inBodyScore.Add(scan.InBodyScore.ToString());
                        weight.Add(scan.Weight.ToString());
                        pbf.Add(scan.Pbf.ToString());
                        smm.Add(scan.Smm.ToString());
                        vfl.Add(scan.Vfl.ToString());
                    }

                    scanChart.TestDateTime = dateTime;
                    scanChart.InBodyScore = inBodyScore;
                    scanChart.Weight = weight;
                    scanChart.Pbf = pbf;
                    scanChart.Smm = smm;
                    scanChart.Vfl = vfl;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(scanChart);
        }
        public JsonResult OnPostReadMemberScans(int challengeMemberId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetMemberScanInChallenge"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    List<SqlParameter> param = new List<SqlParameter>()
                    {
                        new SqlParameter("@ChallengeMemberId", SqlDbType.Int) {Value = challengeMemberId}
                    };
                    cmd.Parameters.AddRange(param.ToArray());
                    _context.Database.OpenConnection();

                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                            Scans = _context.MapToList<ScanViewModel>(result);
                    }

                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Scans.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadImages(int challengeMemberId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                ScanImage = _context.ScanImage
                    .Where(x => x.ChallengeMemberId == challengeMemberId)
                    .Select(x => new ChallengeScanImageViewModel
                    {
                        MemberId = x.MemberId,
                        ChallengeMemberId = x.ChallengeMemberId,
                        BeforeFrontImage = x.BeforeFrontImage == null ? "/images//images.jfif" : string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(x.BeforeFrontImage)),
                        BeforeSideImage = x.BeforeSideImage == null ? "/images//images.jfif" : string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(x.BeforeSideImage)),
                        BeforeBackImage = x.BeforeBackImage == null ? "/images//images.jfif" : string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(x.BeforeBackImage)),
                        AfterFrontImage = x.AfterFrontImage == null ? "/images//images.jfif" : string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(x.AfterFrontImage)),
                        AfterSideImage = x.AfterSideImage == null ? "/images//images.jfif" : string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(x.AfterSideImage)),
                        AfterBackImage = x.AfterBackImage == null ? "/images//images.jfif" : string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(x.AfterBackImage))
                    }).FirstOrDefault();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(ScanImage);
        }
        public JsonResult OnPostReadMemberVisits(int challengeMemberId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                var challenge = _context.VwChallengeMembers.FirstOrDefault(x => x.ChallengeMemberId == challengeMemberId);
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetVisitsInChallengePerWeek"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    List<SqlParameter> param = new List<SqlParameter>()
                    {
                        new SqlParameter("@ChallengeStartDate", SqlDbType.DateTime) {Value = challenge.StartScanFromDate},
                        new SqlParameter("@ChallengeEndDate", SqlDbType.DateTime) {Value = challenge.EndScanToDate},
                        new SqlParameter("@ChallengeMemberId", SqlDbType.Int) {Value = challengeMemberId},
                        new SqlParameter("@ClientId", SqlDbType.NVarChar) {Value = challenge.Mbid},
                        new SqlParameter("@SiteId", SqlDbType.Int) {Value = challenge.SiteId}
                    };

                    cmd.Parameters.AddRange(param.ToArray());
                    _context.Database.OpenConnection();

                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                            Visits = _context.MapToList<ChallengeVisitPerWeekViewModel>(result);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(Visits.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadChallengeMemberScore(int challengeMemberId, [DataSourceRequest] DataSourceRequest roRequest)
        {
            List<ChallengeMemberScoreViewModel> scores = new List<ChallengeMemberScoreViewModel>();
            try
            {
                var challengeMemberScans = _context.VwScans
                   .Where(x => x.ChallengeMemberId == challengeMemberId)
                   .FirstOrDefault();
                var scoringTemplate = _context.ChallengeStudio.Where(x => x.ChallengeId == challengeMemberScans.ChallengeId && x.StudioId == challengeMemberScans.StudioId).FirstOrDefault();
                var gym = _context.GlobalStudio.FirstOrDefault(x => x.StudioId == challengeMemberScans.StudioId);

                var inBody = (challengeMemberScans.WithEndScan == 1) ? challengeMemberScans.EndInBodyTotal.Value : challengeMemberScans.MidInBodyTotal.Value;
                var weight = (challengeMemberScans.WithEndScan == 1) ? challengeMemberScans.EndWeightTotal.Value : challengeMemberScans.MidWeightTotal.Value;
                var pbf = (challengeMemberScans.WithEndScan == 1) ? challengeMemberScans.EndPbftotal.Value : challengeMemberScans.MidPbftotal.Value;
                var smm = (challengeMemberScans.WithEndScan == 1) ? challengeMemberScans.EndSmmtotal.Value : challengeMemberScans.MidSmmtotal.Value;
                var vfl = (challengeMemberScans.WithEndScan == 1) ? challengeMemberScans.EndVfltotal.Value : challengeMemberScans.MidVfltotal.Value;

                switch (scoringTemplate.ScoringSystemId)
                {
                    case (int)ScoringTemplate.WeightedSystem:
                        var imageScoreW = GetWeightedScore(decimal.Parse(challengeMemberScans.ImageScore.ToString()), gym.GlobalTrainingGymId, "Before/After Pictures");
                        var inbodyScoreW = GetWeightedScore(inBody, gym.GlobalTrainingGymId, "InBody Score");
                        var weightScoreW = GetWeightedScore(weight, gym.GlobalTrainingGymId, "Weight Loss");
                        var pbfScoreW = GetWeightedScore(pbf, gym.GlobalTrainingGymId, "PBF Loss");
                        var smmScoreW = GetWeightedScore(smm, gym.GlobalTrainingGymId, "SMM Gain");
                        var vflScoreW = GetWeightedScore(vfl, gym.GlobalTrainingGymId, "VFL");
                        var attendedScoreW = GetWeightedScore(challengeMemberScans.AttendedClass.Value, gym.GlobalTrainingGymId, "Class Attendances");
                        var accumulatedScoreW = imageScoreW + inbodyScoreW + weightScoreW + pbfScoreW + smmScoreW + vflScoreW + attendedScoreW;
                        ChallengeMemberScoreViewModel scoreW = new ChallengeMemberScoreViewModel()
                        {
                            ImageScore = imageScoreW,
                            InBodyScore = inbodyScoreW,
                            WeightScore = weightScoreW,
                            PbfScore = pbfScoreW,
                            SmmScore = smmScoreW,
                            VflScore = vflScoreW,
                            AttendedClassScore = attendedScoreW,
                            AccumulatedScore = accumulatedScoreW
                        };
                        scores.Add(scoreW);
                        break;

                    case (int)ScoringTemplate.PointSystem:
                        var imageScoreP = GetPointScore(decimal.Parse(challengeMemberScans.ImageScore.ToString()), gym.GlobalTrainingGymId, (int)Types.IMAGE);
                        var inbodyScoreP = GetPointScore(inBody, gym.GlobalTrainingGymId, (int)Types.INBODY);
                        var weightScoreP = GetPointScore(weight, gym.GlobalTrainingGymId, (int)Types.WEIGHT);
                        var pbfScoreP = GetPointScore(pbf, gym.GlobalTrainingGymId, (int)Types.PBF);
                        var smmScoreP = GetPointScore(smm, gym.GlobalTrainingGymId, (int)Types.SMM);
                        var vflScoreP = GetPointScore(vfl, gym.GlobalTrainingGymId, (int)Types.VFL);
                        var attendedScoreP = GetPointScore(challengeMemberScans.AttendedClass.Value, gym.GlobalTrainingGymId, (int)Types.ATTENDANCE);
                        var accumulatedScoreP = imageScoreP + inbodyScoreP + weightScoreP + pbfScoreP + smmScoreP + vflScoreP + attendedScoreP;
                        ChallengeMemberScoreViewModel scoreP = new ChallengeMemberScoreViewModel()
                        {
                            ImageScore = imageScoreP,
                            InBodyScore = inbodyScoreP,
                            WeightScore = weightScoreP,
                            PbfScore = pbfScoreP,
                            SmmScore = smmScoreP,
                            VflScore = vflScoreP,
                            AttendedClassScore = attendedScoreP,
                            AccumulatedScore = accumulatedScoreP

                        };
                        scores.Add(scoreP);
                        break;
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(scores.ToDataSourceResult(roRequest));
        }

        public JsonResult OnPostValidateVisits(int studioId, int challengeId, string dateFrom, string dateTo)
        {
            var success = false;
            try
            {

                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetChallengeMember"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    List<SqlParameter> param = new List<SqlParameter>()
                    {
                        new SqlParameter("@ChallengeId", SqlDbType.Int) {Value = challengeId},
                        new SqlParameter("@StudioId", SqlDbType.Int) {Value = studioId}
                    };
                    cmd.Parameters.AddRange(param.ToArray());
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                        {
                            ChallengeMembers = _context.MapToList<ChallengeMemberViewModel>(result);
                        }
                    }
                }

               

                if(ChallengeMembers != null)
                {
                    List<int> memberIds = new List<int>();
                    foreach (var item in ChallengeMembers)
                    {
                        memberIds.Add(item.MemberId);
                    }
                    var members = _context.Member.Where(x => memberIds.Contains(x.MemberId)).ToList();

                    ValidateMemberVisitsViewModel validateParam = new ValidateMemberVisitsViewModel()
                    {
                        Members = members,
                        DateFrom = DateTime.Parse(dateFrom).ToString("s"),
                        DateTo = DateTime.Parse(dateTo).ToString("s"),
                        StudioId = studioId,
                        User = User.Identity.Name
                    };

                    success = _mindBodyService.ValidateMembersVisits(validateParam);                 

                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(success);
        }

        public decimal GetWeightedScore(decimal result, int gymId, string category)
        {

            var score = _context.WeightedSystem.FirstOrDefault(x => x.GlobalTrainingGymId == gymId && x.Category == category);

            if (result > score.UpperRange)
            {
                result = category == "Class Attendances" ? score.UpperRangeWeighted : result *= score.UpperRangeWeighted;
                //result *= score.UpperRangeWeighted;
            }
            else if (result <= score.UpperRange && result > score.LowerRange)
            {
                result = category == "Class Attendances" ? score.MidRangeWeighted : result *= score.MidRangeWeighted;
                //result *= score.MidRangeWeighted;
            }
            else
            {
                result = category == "Class Attendances" ? score.LowerRangeWeighted : result *= score.LowerRangeWeighted;
                //result *= score.LowerRangeWeighted;
            }
            return result;

        }
        public decimal GetPointScore(decimal result, int gymId, int type)
        {
            var scores = _context.PointsSystem.Where(x => x.GlobalTrainingGymId == gymId).ToList().OrderBy(x => x.PointsAllocation);
            var count = scores.Count();
            var x = 0;

            switch (type)
            {
                case (int)Types.IMAGE:

                    foreach (var score in scores)
                    {
                        if (result <= score.BeforeAndAfterPicture)
                        {
                            result = score.PointsAllocation.Value;
                            break;
                        }
                        x++;
                        if (count == x)
                        {
                            if (result > score.BeforeAndAfterPicture)
                            {
                                result = score.PointsAllocation.Value / 2;
                            }
                        }

                    }



                    break;
                case (int)Types.INBODY:

                    foreach (var score in scores)
                    {
                        if (result <= score.InbodyScore)
                        {
                            result = score.PointsAllocation.Value;
                            break;
                        }
                        x++;
                        if (count == x)
                        {
                            if (result > score.InbodyScore)
                            {
                                result = score.PointsAllocation.Value / 2;
                            }
                        }
                    }

                    break;
                case (int)Types.WEIGHT:

                    foreach (var score in scores)
                    {
                        if (result <= score.WeightLoss)
                        {
                            result = score.PointsAllocation.Value;
                            break;
                        }
                        x++;
                        if (count == x)
                        {
                            if (result > score.WeightLoss)
                            {
                                result = score.PointsAllocation.Value / 2;
                            }
                        }
                    }

                    break;
                case (int)Types.PBF:

                    foreach (var score in scores)
                    {


                        if (result <= score.Pbfloss)
                        {
                            result = score.PointsAllocation.Value;
                            break;
                        }
                        x++;
                        if (count == x)
                        {
                            if (result > score.Pbfloss)
                            {
                                result = score.PointsAllocation.Value;
                            }
                        }
                    }

                    break;
                case (int)Types.SMM:

                    foreach (var score in scores)
                    {
                        if (result <= score.Smmgain)
                        {
                            result = score.PointsAllocation.Value;
                            break;
                        }
                        x++;
                        if (count == x)
                        {
                            if (result > score.Smmgain)
                            {
                                result = score.PointsAllocation.Value;
                            }
                        }
                    }

                    break;
                case (int)Types.VFL:

                    foreach (var score in scores)
                    {
                        if (result <= score.Vflloss)
                        {
                            result = score.PointsAllocation.Value;
                            break;
                        }
                        x++;
                        if (count == x)
                        {
                            if (result > score.Vflloss)
                            {
                                result = score.PointsAllocation.Value / 2;
                            }
                        }
                    }

                    break;
                case (int)Types.ATTENDANCE:

                    foreach (var score in scores)
                    {
                        if (result <= score.ClassAttended)
                        {
                            result = score.PointsAllocation.Value;
                            break;
                        }
                        x++;
                        if (count == x)
                        {
                            if (result > score.ClassAttended)
                            {
                                result = score.PointsAllocation.Value / 2;
                            }
                        }
                    }

                    break;
            }
            return result;
        }

        public List<AppointmentData> GetScheduleData()
        {
            List<AppointmentData> appData = new List<AppointmentData>();
            appData.Add(new AppointmentData
            {
                Subject = "Paris",
                StartTime = new DateTime(2018, 2, 15, 10, 0, 0),
                EndTime = new DateTime(2018, 2, 15, 12, 30, 0)
            });
            return appData;
        }
        public class AppointmentData
        {
            public string Subject { get; set; }
            public DateTime StartTime { get; set; }
            public DateTime EndTime { get; set; }
        }
    }
}