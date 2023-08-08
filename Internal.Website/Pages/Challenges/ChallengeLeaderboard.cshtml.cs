using DataAccess.Contexts;
using DataAccess.Enums;
using DataAccess.Models;
using DataAccess.ViewModels;
using DataService.Constants.Policy;
using DataService.Services.Interfaces;
using DataService.Utilities;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllUsers)]
    public class ChallengeLeaderboardModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly ILogger<ChallengeLeaderboardModel> _logger;
        private readonly IMemoryCache _cache;
        private readonly IStudioService _studioService;

        public ChallengeLeaderboardModel(StudioCentralContext context,
                                        IMemoryCache cache,
                                        ILogger<ChallengeLeaderboardModel> logger,
                                        IStudioService studioService)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
            _studioService = studioService;
        }

        [BindProperty]
        public IEnumerable<ChallengeLeaderBoardViewModel> ChallengeMembers { get; set; }
        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }
        [BindProperty]
        public IEnumerable<ScanViewModel> Scans { get; set; }
        [BindProperty]
        public IEnumerable<ChallengeVisitPerWeekViewModel> Visits { get; set; }
        [BindProperty]
        public IEnumerable<ChallengeGenderCount> GenderCount { get; set; }
        [BindProperty]
        public ChallengeScanImageViewModel ScanImage { get; set; }

        [BindProperty]
        public Studio SelectedStudio { get; set; }

        public void OnGet()
        {
            ViewData["ChallengeType"] = string.Empty;
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

                PopulateList(groupId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }
        private void PopulateList(int groupId, int userId)
        {
            try
            {
                ViewData["challenge"] = _context.Challenge.Select(x => new Challenge
                {
                    ChallengeId = x.ChallengeId,
                    ChallengeNo = x.ChallengeNo
                }).OrderByDescending(x => x.ChallengeNo).ToList();
                ViewData["challengeType"] = _context.ChallengeType.Select(x => new ChallengeType
                {
                    ChallengeTypeId = x.ChallengeTypeId,
                    Type = x.Type
                }).OrderBy(x => x.Type).ToList();
                ViewData["members"] = _context.Member.Select(c => new Member
                {
                    MemberId = c.MemberId,
                    DisplayName = c.DisplayName
                }).ToList();
                ViewData["Studios"] = _studioService.GetStudios(groupId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

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
                                ChallengeMembers = _context.MapToList<ChallengeLeaderBoardViewModel>(result);
                        }
                    }

                    foreach (var member in ChallengeMembers)
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

            var newResult = ChallengeMembers.OrderByDescending(x => x.AccumulatedScore).ToList();

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
    }
}