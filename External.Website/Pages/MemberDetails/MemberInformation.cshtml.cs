using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.Contexts;
using DataService.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using DataService.Utilities;
using DataAccess.Models;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using System.Globalization;
using DataAccess.ViewModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Data;
using DataService.ViewModels;



namespace StudioCentral_External.Pages.MemberDetails
{
    public class MemberInformationModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly IMindBodyService _mindBodyService;
        private readonly ILogger<MemberInformationModel> _logger;
        private readonly IStudioService _studioService;

        public MemberInformationModel(StudioCentralContext context,
                                    IMemoryCache cache,
                                    IMindBodyService mindBodyService,
                                    ILogger<MemberInformationModel> logger,
                                    IStudioService studioService)
        {
            _logger = logger;
            _context = context;
            _cache = cache;
            _mindBodyService = mindBodyService;
            _studioService = studioService;
        }

        [BindProperty]
        public IEnumerable<ScanViewModel> Scans { get; set; }
        [BindProperty]
        public IEnumerable<MbclientActiveMembership> ActiveMemberships { get; set; }
        [BindProperty]
        public IEnumerable<ContractsViewModel> Contracts { get; set; }
        [BindProperty]
        public IEnumerable<VwVisits> Visits { get; set; }  
        [BindProperty]
        public IEnumerable<PurchasesViewModel> Purchases { get; set; }
        [BindProperty]
        public IEnumerable<PurchasedItems> PurchaseItems { get; set; }
        [BindProperty]
        public IEnumerable<Payments> Payments { get; set; }
        [BindProperty]
        public IEnumerable<VwScans> Challenges { get; set; }
        [BindProperty]
        public IEnumerable<VisitAchievement> VisitAchievements { get; set; }
        [BindProperty]
        public IEnumerable<ChallengeMemberScanViewModel> ChallengeMemberScan { get; set; }
        [BindProperty]
        public ChallengeScanImageViewModel ScanImage { get; set; }
        [BindProperty]
        public MemberViewModel Member { get; set; }
        [BindProperty]
        public int MemberId { get; set; }

        [BindProperty]
        public string Studio { get; set; }
        public void OnGet()
        {
        
            if (_cache.Get("MemberId_" + User.Identity.Name) == null)
            {
                _cache.Remove("MemberId_" + User.Identity.Name);
            }
            if (_cache.Get("Studio_" + User.Identity.Name) == null)
            {
                _cache.Remove("Studio_" + User.Identity.Name);
            }
            Studio = _cache.Get("Studio_" + User.Identity.Name).ToString();

            MemberId = int.Parse(_cache.Get("MemberId_" + User.Identity.Name).ToString());     
            TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
            Member = _context.Member.Where(x => x.MemberId == MemberId)
                .Select(x => new MemberViewModel
                {
                    MemberId = x.MemberId,
                    StudioId = x.StudioId,
                    Mbid = x.Mbid ?? string.Empty,
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
                    Dob = x.Dob.Value,
                    DateCreated = x.DateCreated,
                    CreatedById = x.CreatedById,
                    TimeStamp = x.TimeStamp,
                    Image = x.Image,
                    ImageURL = x.PhotoUrl ?? (x.Image == null ? "/images//images.jfif" : string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(x.Image))),
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
                    ReferredBy = x.ReferredBy,
                    SendAccountEmails = x.SendAccountEmails,
                    SendAccountTexts = x.SendAccountTexts,
                    SendPromotionalEmails = x.SendPromotionalEmails,
                    SendPromotionalTexts = x.SendPromotionalTexts,
                    SendScheduleEmails = x.SendScheduleEmails,
                    SendScheduleTexts = x.SendScheduleTexts,
                    EmergencyContactInfoName = x.EmergencyContactInfoName,
                    EmergencyContactInfoRelationship = x.EmergencyContactInfoRelationship,
                    EmergencyContactInfoEmail = x.EmergencyContactInfoEmail,
                    EmergencyContactInfoPhone = x.EmergencyContactInfoPhone
                }).FirstOrDefault();
        }
        public async Task<JsonResult> OnPostReadMemberInfoAsync([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
               MemberId = int.Parse(_cache.Get("MemberId_" + User.Identity.Name).ToString()); 
                TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
                Member = await _context.Member.Where(x => x.MemberId == MemberId)
                    .Select(x => new MemberViewModel
                    {
                        MemberId = x.MemberId,
                        StudioId = x.StudioId,
                        Mbid = x.Mbid ?? string.Empty,
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
                        Dob = x.Dob.Value,
                        DateCreated = x.DateCreated,
                        CreatedById = x.CreatedById,
                        TimeStamp = x.TimeStamp,
                        Image = x.Image,
                        ImageURL = x.PhotoUrl ?? (x.Image == null ? "/images//images.jfif" : string.Format("data:image/jpg;base64,{0}", Convert.ToBase64String(x.Image))),
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
                        ReferredBy = x.ReferredBy,
                        SendAccountEmails = x.SendAccountEmails,
                        SendAccountTexts = x.SendAccountTexts,
                        SendPromotionalEmails = x.SendPromotionalEmails,
                        SendPromotionalTexts = x.SendPromotionalTexts,
                        SendScheduleEmails = x.SendScheduleEmails,
                        SendScheduleTexts = x.SendScheduleTexts,
                        EmergencyContactInfoName = x.EmergencyContactInfoName,
                        EmergencyContactInfoRelationship = x.EmergencyContactInfoRelationship,
                        EmergencyContactInfoEmail = x.EmergencyContactInfoEmail,
                        EmergencyContactInfoPhone = x.EmergencyContactInfoPhone
                    }).FirstOrDefaultAsync();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(Member);
        }
        public async Task<JsonResult> OnPostReadScanChartAsync()
        {
            ScanChartViewModel scanChart = new ScanChartViewModel();
            try
            {
               MemberId = int.Parse(_cache.Get("MemberId_" + User.Identity.Name).ToString()); 
                Scans = await _context.Scan
                       .Where(x => x.MemberId == MemberId)
                       .Select(x => new ScanViewModel
                       {
                           TestDateTime = x.TestDateTime,
                           Weight = x.Weight,
                           Pbf = x.Pbf,
                           Smm = x.Smm,
                           Vfl = x.Vfl,
                           InBodyScore = x.InBodyScore
                       }).OrderBy(x => x.TestDateTime).ToListAsync();

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
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(scanChart);
        }
        public async Task<JsonResult> OnPostReadMemberScansAsync([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
               MemberId = int.Parse(_cache.Get("MemberId_" + User.Identity.Name).ToString()); 
                Scans = await _context.Scan
                      .Where(x => x.MemberId == MemberId)
                      .Select(x => new ScanViewModel
                      {
                          TestDateTime = x.TestDateTime,
                          Weight = x.Weight,
                          Pbf = x.Pbf,
                          Smm = x.Smm,
                          Vfl = x.Vfl,
                          InBodyScore = x.InBodyScore
                      }).OrderByDescending(x => x.TestDateTime).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Scans.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadMembership([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
               MemberId = int.Parse(_cache.Get("MemberId_" + User.Identity.Name).ToString()); 
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetActiveMembership"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@MemberId", SqlDbType.Int) { Value = MemberId };
                    cmd.Parameters.Add(param);
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                            ActiveMemberships = _context.MapToList<MbclientActiveMembership>(result);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(ActiveMemberships.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadContract([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
               MemberId = int.Parse(_cache.Get("MemberId_" + User.Identity.Name).ToString()); 
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetMemberContract"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@MemberId", SqlDbType.Int) { Value = MemberId };
                    cmd.Parameters.Add(param);
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                            Contracts = _context.MapToList<ContractsViewModel>(result);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Contracts.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadVisits([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
               MemberId = int.Parse(_cache.Get("MemberId_" + User.Identity.Name).ToString()); 
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetClientVisits"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@MemberId", SqlDbType.NVarChar) { Value = MemberId };

                    cmd.Parameters.Add(param);
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                        {
                            var visitList = _context.MapToList<VwVisits>(result);
                            Visits = visitList.ToList();
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
        public async Task<JsonResult> OnPostReadClientVisitsSummationsAsync()
        {
            VisitsSummationViewModel totals = new VisitsSummationViewModel();
            List<MemberAchievementRewardViewModel> rewards = new List<MemberAchievementRewardViewModel>();
            try
            {
               MemberId = int.Parse(_cache.Get("MemberId_" + User.Identity.Name).ToString()); 
                var Absences = 0;
                var LateCancelled = 0;
                var SignedIn = 0;
                var TotalVisits = 0;
                var studioId = 0;
                var memberId = MemberId;

                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetClientVisits"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@MemberId", SqlDbType.NVarChar) { Value = memberId };
                    cmd.Parameters.Add(param);
                    _context.Database.OpenConnection();

                    using (var res = cmd.ExecuteReader())
                    {
                        if (res.HasRows)
                        {
                            var visitList = _context.MapToList<ClientVisitsViewModel>(res);

                            Absences = visitList.Where(x => x.Status == "Absent").ToList().Count;
                            LateCancelled = visitList.Where(x => x.Status == "Late Cancel").ToList().Count;
                            SignedIn = visitList.Where(x => x.Status == "Signed in").ToList().Count;
                            TotalVisits = visitList.ToList().Count;
                            studioId = visitList.FirstOrDefault().StudioId;
                        }
                    }
                }

                totals.Absences = Absences;
                totals.LateCancelled = LateCancelled;
                totals.SignedIn = SignedIn;
                totals.TotalVisits = TotalVisits;

                AchievementParamViewModel achievementParam = new AchievementParamViewModel()
                {
                    SignedIn = SignedIn,
                    StudioId = studioId,
                    MemberId = memberId,
                    Username = User.Identity.Name
                };

                rewards = await _studioService.GetMemberAchievement(achievementParam);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new { totals, rewards });

        }
        public JsonResult OnPostReadPurchase([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
               MemberId = int.Parse(_cache.Get("MemberId_" + User.Identity.Name).ToString()); 
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetClientPurchases"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@MemberId", SqlDbType.Int) { Value = MemberId };
                    cmd.Parameters.Add(param);
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                            Purchases = _context.MapToList<PurchasesViewModel>(result);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Purchases.ToDataSourceResult(request));
        }       
        public JsonResult OnPostReadPurchasedItems(int purchaseId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                PurchaseItems = _context.PurchasedItems.Where(x => x.PurchaseId == purchaseId)
                    .Select(x => new PurchasedItems
                    {
                        IsService = x.IsService,
                        BarcodeId = x.BarcodeId
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(PurchaseItems.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadPaymentAsync(int purchaseId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                Payments = _context.Payments.Where(x => x.PurchaseId == purchaseId)
                    .Select(x => new Payments
                    {
                        Amount = x.Amount,
                        Type = x.Type,
                        Notes = x.Notes
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Payments.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadMemberChallenge([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
               MemberId = int.Parse(_cache.Get("MemberId_" + User.Identity.Name).ToString()); 
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetMemberChallenges"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@MemberId", SqlDbType.Int) { Value = MemberId };
                    cmd.Parameters.Add(param);
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                            Challenges = _context.MapToList<VwScans>(result);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(Challenges.ToDataSourceResult(request));
        }
        public JsonResult OnPostReadImages(int challengeMemberId)
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
        public JsonResult OnPostReadMemberChallengeScans(int challengeMemberId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspChallengeMemberScans"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@ChallengeMemberId", SqlDbType.Int) { Value = challengeMemberId };
                    cmd.Parameters.Add(param);
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                            ChallengeMemberScan = _context.MapToList<ChallengeMemberScanViewModel>(result);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(ChallengeMemberScan.ToDataSourceResult(request));
        }
        public JsonResult OnPostCreateChallengeMember()
        {
            var success = false;
            var message = string.Empty;
            try
            {
               MemberId = int.Parse(_cache.Get("MemberId_" + User.Identity.Name).ToString()); 
                Member =  _context.Member.Where(x => x.MemberId == MemberId)
                   .Select(x => new MemberViewModel
                   {
                       MemberId = x.MemberId,
                       StudioId = x.StudioId
                   }).FirstOrDefault();

                var challengeStudio =  _context.ChallengeStudio.Where(x => x.StudioId == Member.StudioId).OrderByDescending(x => x.ChallengeId).FirstOrDefault();

                var latestChallenge =  _context.Challenge.FirstOrDefault(x => x.ChallengeId == challengeStudio.ChallengeId);

                if (latestChallenge.StartDate >= DateTime.Now.Date)
                {
                    var challengeMember =  _context.ChallengeMember.Where(x => x.MemberId == Member.MemberId && x.ChallengeId == challengeStudio.ChallengeId).FirstOrDefault();

                    if (challengeMember == null)
                    {
                        ChallengeMember newChallengeMember = new ChallengeMember
                        {
                            ChallengeId = challengeStudio.ChallengeId,
                            MemberId = Member.MemberId,
                            CreatedById = 1,
                            DateCreated = DateTime.Now
                        };
                        _context.ChallengeMember.Add(newChallengeMember);
                        _context.SaveChanges(User.Identity.Name);

                        var challengeMemberid = newChallengeMember.ChallengeMemberId;

                         _context.Database.ExecuteSqlRaw("uspUpdateChallengeScans {0}", challengeMemberid);

                        success = true;
                        message = "You have successfully joined the challenge no. " + latestChallenge.ChallengeNo + ". The challenge duration will from " + latestChallenge.StartDate.Date.ToLongDateString() + " to " + latestChallenge.EndDate.Date.ToLongDateString() + ".";
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new { success, message });
        }
        public JsonResult OnPostCheckChallengeMember()
        {
            var success = false;           
            try
            {
               MemberId = int.Parse(_cache.Get("MemberId_" + User.Identity.Name).ToString()); 
                Member =  _context.Member.Where(x => x.MemberId == MemberId)
                   .Select(x => new MemberViewModel
                   {
                       MemberId = x.MemberId,
                       StudioId = x.StudioId
                   }).FirstOrDefault();

                var challengeStudio =  _context.ChallengeStudio.Where(x => x.StudioId == Member.StudioId).OrderByDescending(x => x.ChallengeId).FirstOrDefault();

                var latestChallenge =  _context.Challenge.FirstOrDefault(x => x.ChallengeId == challengeStudio.ChallengeId);

                if (latestChallenge.StartDate >= DateTime.Now.Date)
                {
                    var challengeMember =  _context.ChallengeMember.Where(x => x.MemberId == Member.MemberId && x.ChallengeId == challengeStudio.ChallengeId).FirstOrDefault();

                    success = (challengeMember == null);                    
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(success);
        }

      

    }
}
