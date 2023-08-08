using DataAccess.Contexts;
using DataAccess.Enums;
using DataAccess.Models;
using DataAccess.ViewModels;
using DataService.Constants.Policy;
using DataService.Services.Interfaces;
using DataService.Utilities;
using DataService.ViewModels;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Internal.Website
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllUsers)]
    public class MemberProfileModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly ILogger<MemberProfileModel> _logger;
        private readonly IMemoryCache _cache;
        private readonly IMindBodyService _mindBodyService;       
        private readonly IStudioService _studioService;

        public MemberProfileModel(StudioCentralContext context,
                                    ILogger<MemberProfileModel> logger,
                                    IMemoryCache cache,
                                    IMindBodyService mindBodyService,
                                    IStudioService studioService)
        {
            _logger = logger;
            _context = context;
            _cache = cache;
            _mindBodyService = mindBodyService;
            _studioService = studioService;
        }

        [BindProperty]
        public IEnumerable<MbclientActiveMembership> ActiveMemberships { get; set; }
        [BindProperty]
        public IEnumerable<VwScans> Challenges { get; set; }
        [BindProperty]
        public IEnumerable<ChallengeMemberScanViewModel> ChallengeMemberScan { get; set; }
        [BindProperty]
        public IEnumerable<ContractsViewModel> Contracts { get; set; }
        [BindProperty]
        public IEnumerable<MemberViewModel> Members { get; set; }
        [BindProperty]
        public IEnumerable<MemberAchievementReward> MemberAchievementRewards { get; set; }   
        [BindProperty]
        public IEnumerable<PaymentMethodViewModel> PaymentMethods { get; set; }
        [BindProperty]
        public IEnumerable<PurchasesViewModel> Purchases { get; set; }      
        [BindProperty]
        public IEnumerable<ScanViewModel> Scans { get; set; }    
        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }     
        [BindProperty]
        public IEnumerable<VwVisits> Visits { get; set; }     
              
        [BindProperty]
        public ChallengeScanImageViewModel ScanImage { get; set; }
        [BindProperty]
        public Studio SelectedStudio { get; set; }

        /* Initialize Page */
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

                _cache.Set<MemberStatus>($"{ User.Identity.Name}_Status", null);
                if (_cache.Get<MemberStatus>($"{ User.Identity.Name}_Status") == null)
                {
                    var Status = await _context.MemberStatus
                        .Where(x => x.MemberStatusId == (int)MemberStatuses.ActiveSuspended)
                        .Select(x => new MemberStatus()
                        {
                            MemberStatusId = x.MemberStatusId,
                            Status = x.Status
                        }).FirstOrDefaultAsync();

                    _cache.Set<MemberStatus>($"{ User.Identity.Name}_Status", Status);
                }

                await PopulateListAsync(groupId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

        }
        private async Task PopulateListAsync(int groupId, int userId)
        {
            var loc = _cache.Get<Studio>($"{User.Identity.Name}_Studio");
            var studioId = loc.StudioId;

            ViewData["gender"] = await _context.Gender.Select(x => new DataAccess.Models.Gender
            {
                GenderId = x.GenderId,
                Description = x.Description
            }).ToListAsync();
            ViewData["status"] = await _context.MemberStatus.OrderBy(x => x.StatusOrder).Select(x => new MemberStatus
            {
                MemberStatusId = x.MemberStatusId,
                Status = x.Status
            }).ToListAsync();
            ViewData["referral"] = await _context.ReferralType.Where(x => x.StudioId == studioId).ToListAsync();
            ViewData["Studios"] = _studioService.GetStudios(groupId, userId);
            ViewData["paymentType"] = await _context.PaymentType.ToListAsync();
            ViewData["paymentSource"] = await _context.PaymentSource.ToListAsync();
            ViewData["paymentMethodType"] = await _context.PaymentMethodType.ToListAsync();
            ViewData["forOtherMember"] = await _context.Member.Where(x => x.StudioId == studioId).ToListAsync();
            ViewData["shirtSize"] = await _context.ShirtSize.Select(x => new ShirtSizeViewModel
            {
                ShirtSizeId = x.ShirtSizeId,
                ShortDescription = x.ShortDescription
            }).ToListAsync();
        }

        /* Member's Profile */
        public async Task<JsonResult> OnPostReadAsync(int studioId, int statusId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                studioId = await _studioService.GetStudioIdAsync(studioId, User.Identity.Name);
                statusId = await _studioService.GetStatusIdAsync(statusId, User.Identity.Name);                

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

                TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;

                Members = await _context.Member.Where(x => x.StudioId == studioId
                        && memberStatusIds.Contains(x.MemberStatusId))
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
                            Dob = x.Dob,
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
                            EmergencyContactInfoPhone = x.EmergencyContactInfoPhone,
                            ShirtSizeId = x.ShirtSizeId,
                            ShirtSize = x.ShirtSize.ShortDescription
                        }).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(Members.ToDataSourceResult(request));
        }       
        public async Task<JsonResult> OnPostAddMember(MemberViewModel memberInfo)
        {            
            bool success = false;
            string message = string.Empty;
            try
            {
                if (ModelState.IsValid)
                {
                    var validateMember = _context.Member
                        .FirstOrDefault(x => x.FirstName == memberInfo.FirstName &&
                                        x.LastName == memberInfo.LastName &&
                                        x.StudioId == memberInfo.StudioId);

                    if (validateMember == null)
                    {
                        var validateMobileNumber = _context.Member
                            .FirstOrDefault(x => x.MobilePhone == memberInfo.MobilePhone && 
                                            x.StudioId == memberInfo.StudioId);

                        if (validateMobileNumber == null)
                        {
                            var validateScannerNumber = _context.Member
                                .FirstOrDefault(x => x.ScannerMobile == memberInfo.ScannerMobile && 
                                                x.StudioId == memberInfo.StudioId);

                            if (validateScannerNumber == null)
                            {
                                // update mindbody here
                                ClientViewModel client = new ClientViewModel();
                                var birthday = DateTime.TryParse(memberInfo.Dob.ToString(), out DateTime date) ? date : (DateTime?)null;
                                string mbid = null;
                                int? uniqueId = null;
                                DateTime? creationDate = null;
                                if (memberInfo.SyncToMidnBody)
                                {
                                    var mbInterface = _context.Mbinterface.FirstOrDefault(x => x.StudioId == memberInfo.StudioId);
                                    ClientViewModel memberView = new ClientViewModel
                                    {
                                        Gender = memberInfo.Gender,
                                        Status = memberInfo.Status,
                                        FirstName = memberInfo.FirstName ?? string.Empty,
                                        LastName = memberInfo.LastName ?? string.Empty,
                                        Email = memberInfo.Email,
                                        BirthDate = birthday != null ? DateTime.Parse(memberInfo.Dob.ToString()).ToString("s") : string.Empty,
                                        MobilePhone = memberInfo.MobilePhone ?? string.Empty,
                                        WorkPhone = memberInfo.WorkPhone ?? string.Empty,
                                        HomePhone = memberInfo.HomePhone ?? string.Empty,
                                        AddressLine1 = memberInfo.AddressLine1 ?? string.Empty,
                                        AddressLine2 = memberInfo.AddressLine2 ?? string.Empty,
                                        City = memberInfo.City ?? string.Empty,
                                        State = memberInfo.State ?? string.Empty,
                                        Country = memberInfo.Country ?? string.Empty,
                                        PostalCode = memberInfo.PostalCode ?? string.Empty,
                                        ReferredBy = memberInfo.ReferredBy,
                                        Active = true,
                                        Action = "Added",
                                        EmergencyContactInfoName = memberInfo.EmergencyContactInfoName ?? string.Empty,
                                        EmergencyContactInfoRelationship = memberInfo.EmergencyContactInfoRelationship ?? string.Empty,
                                        EmergencyContactInfoPhone = memberInfo.EmergencyContactInfoPhone ?? string.Empty,
                                        EmergencyContactInfoEmail = memberInfo.EmergencyContactInfoEmail ?? string.Empty
                                    };

                                    client = await _mindBodyService.AddMemberAsync(mbInterface, memberView);

                                    if (client != null)
                                    {
                                        uniqueId = client.UniqueId;
                                        mbid = client.Id ?? uniqueId.ToString();
                                        creationDate = DateTime.Parse(client.CreationDate);
                                    }
                                }

                                Member newMember = new Member()
                                {
                                    StudioId = memberInfo.StudioId,
                                    Mbid = mbid,
                                    MbuniqueId = uniqueId,
                                    MbcreationDate = creationDate,
                                    MblastModifiedDateTime = null,
                                    MemberStatusId = memberInfo.MemberStatusId,
                                    DisplayName = memberInfo.FirstName + " " + memberInfo.LastName,
                                    LastName = memberInfo.LastName,
                                    FirstName = memberInfo.FirstName,
                                    MobilePhone = memberInfo.MobilePhone,
                                    ScannerMobile = memberInfo.ScannerMobile,
                                    Email = memberInfo.Email,
                                    GenderId = memberInfo.GenderId,
                                    Dob = birthday,
                                    HomePhone = memberInfo.HomePhone,
                                    WorkPhone = memberInfo.WorkPhone,
                                    AddressLine1 = memberInfo.AddressLine1,
                                    AddressLine2 = memberInfo.AddressLine2,
                                    City = memberInfo.City,
                                    State = memberInfo.State,
                                    Country = memberInfo.Country,
                                    PostalCode = memberInfo.PostalCode,
                                    Active = true,
                                    Action = "Added",
                                    ReferredBy = memberInfo.ReferredBy,
                                    ShirtSizeId = memberInfo.ShirtSizeId,
                                    EmergencyContactInfoName = memberInfo.EmergencyContactInfoName,
                                    EmergencyContactInfoRelationship = memberInfo.EmergencyContactInfoRelationship,
                                    EmergencyContactInfoPhone = memberInfo.EmergencyContactInfoPhone,
                                    EmergencyContactInfoEmail = memberInfo.EmergencyContactInfoEmail,
                                    CreatedById = UserUtility.GetUserId(User),
                                    DateCreated = DateTime.Now
                                };

                                await _context.Member.AddAsync(newMember);
                                await _context.SaveChangesAsync(User.Identity.Name);
                                success = true;
                                message = "New member successfully added in the system. " + client.Message;
                            }
                            else
                            {
                                ModelState.AddModelError("error", "Scanner mobile already in use by another member!");                               
                            }
                        }
                        else
                        {
                            ModelState.AddModelError("error", "Mobile number already in use by another member!");
                        }
                    }
                    else
                    {
                        ModelState.AddModelError("error", "Record already exist!");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(new { message, success, errors = ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray() });         
        }
        public async Task<JsonResult> OnPostUpdateProfile(MemberViewModel memberInfo)
        {            
            bool success = false;
            string message = string.Empty;
            if (memberInfo.MemberId != 0)
            {
                try
                {
                    if (ModelState.IsValid)
                    {
                        var validateMember = _context.Member
                            .FirstOrDefault(x => x.FirstName == memberInfo.FirstName && 
                                            x.LastName == memberInfo.LastName && 
                                            x.StudioId == memberInfo.StudioId && 
                                            x.MemberId != memberInfo.MemberId);

                        if (validateMember == null)
                        {
                            var validateMobilePhone = _context.Member
                                .FirstOrDefault(x => x.MobilePhone == memberInfo.MobilePhone && 
                                                x.StudioId == memberInfo.StudioId && 
                                                x.MemberId != memberInfo.MemberId);

                            if (validateMobilePhone == null)
                            {
                                var validateScannerMobile = _context.Member
                                    .FirstOrDefault(x => x.ScannerMobile == memberInfo.ScannerMobile &&
                                                    x.StudioId == memberInfo.StudioId &&
                                                    x.MemberId != memberInfo.MemberId);

                                if (validateScannerMobile == null)
                                {
                                    var member = _context.Member.FirstOrDefault(x => x.MemberId == memberInfo.MemberId);
                                    if (member != null)
                                    {
                                        var birthday = DateTime.TryParse(memberInfo.Dob.ToString(), out DateTime date) ? date : (DateTime?)null;
                                        ClientViewModel client = new ClientViewModel();
                                        // update mindbody here         
                                        if (memberInfo.SyncToMidnBody)
                                        {
                                            ClientViewModel memberView = new ClientViewModel
                                            {
                                                Id = member.Mbid,
                                                UniqueId = member.MbuniqueId.Value,
                                                Gender = memberInfo.Gender,
                                                Status = memberInfo.Status,
                                                FirstName = memberInfo.FirstName ?? string.Empty,
                                                LastName = memberInfo.LastName ?? string.Empty,
                                                Email = memberInfo.Email,
                                                BirthDate = birthday != null ? DateTime.Parse(memberInfo.Dob.ToString()).ToString("s") : string.Empty,
                                                MobilePhone = memberInfo.MobilePhone ?? string.Empty,
                                                WorkPhone = memberInfo.WorkPhone ?? string.Empty,
                                                HomePhone = memberInfo.HomePhone ?? string.Empty,
                                                AddressLine1 = memberInfo.AddressLine1 ?? string.Empty,
                                                AddressLine2 = memberInfo.AddressLine2 ?? string.Empty,
                                                City = memberInfo.City ?? string.Empty,
                                                State = memberInfo.State ?? string.Empty,
                                                Country = memberInfo.Country ?? string.Empty,
                                                PostalCode = memberInfo.PostalCode ?? string.Empty,
                                                ReferredBy = memberInfo.ReferredBy,
                                                Active = true,
                                                Action = "Updated",
                                                EmergencyContactInfoName = memberInfo.EmergencyContactInfoName ?? string.Empty,
                                                EmergencyContactInfoRelationship = memberInfo.EmergencyContactInfoRelationship ?? string.Empty,
                                                EmergencyContactInfoPhone = memberInfo.EmergencyContactInfoPhone ?? string.Empty,
                                                EmergencyContactInfoEmail = memberInfo.EmergencyContactInfoEmail ?? string.Empty
                                            };

                                            var mbInterface = _context.Mbinterface.FirstOrDefault(x => x.StudioId == memberInfo.StudioId);
                                            client = await _mindBodyService.UpdateMemberProfileAsync(mbInterface, memberView);
                                            if (client != null)
                                            {
                                                member.MbcreationDate = DateTime.Parse(client.CreationDate);
                                                member.MblastModifiedDateTime = DateTime.Parse(client.LastModifiedDateTime);
                                                member.Mbid = client.Id;
                                                member.MbuniqueId = client.UniqueId;

                                            }
                                        }

                                        member.FirstName = memberInfo.FirstName;
                                        member.LastName = memberInfo.LastName;
                                        member.Email = memberInfo.Email;
                                        member.DisplayName = memberInfo.DisplayName;
                                        member.Dob = birthday;
                                        member.GenderId = memberInfo.GenderId;
                                        member.MemberStatusId = memberInfo.MemberStatusId;
                                        member.AddressLine1 = memberInfo.AddressLine1;
                                        member.AddressLine2 = memberInfo.AddressLine2;
                                        member.PostalCode = memberInfo.PostalCode;
                                        member.ScannerMobile = memberInfo.ScannerMobile;
                                        member.MobilePhone = memberInfo.MobilePhone;
                                        member.WorkPhone = memberInfo.WorkPhone;
                                        member.HomePhone = memberInfo.HomePhone;
                                        member.Country = memberInfo.Country;
                                        member.State = memberInfo.State;
                                        member.City = memberInfo.City;
                                        member.ReferredBy = memberInfo.ReferredBy;
                                        member.ShirtSizeId = memberInfo.ShirtSizeId;
                                        member.EmergencyContactInfoName = memberInfo.EmergencyContactInfoName;
                                        member.EmergencyContactInfoRelationship = memberInfo.EmergencyContactInfoRelationship;
                                        member.EmergencyContactInfoPhone = memberInfo.EmergencyContactInfoPhone;
                                        member.EmergencyContactInfoEmail = memberInfo.EmergencyContactInfoEmail;
                                        member.ModifiedById = UserUtility.GetUserId(User);
                                        member.DateModified = DateTime.Now;
                                        _context.Update(member);
                                        await _context.SaveChangesAsync(User.Identity.Name);

                                        success = true;
                                        message = member.DisplayName + " record has been successfully updated." + client.Message;
                                    }
                                    else
                                    {
                                        ModelState.AddModelError("error", "Record doesn't exist.");
                                    }
                                }
                                else
                                {
                                    ModelState.AddModelError("error", "Scanner mobile already in use by another member!");
                                }
                            }
                            else
                            {
                                ModelState.AddModelError("error", "Mobile number already in use by another member!");
                            }
                        }
                        else
                        {
                            ModelState.AddModelError("error", memberInfo.FirstName + " " + memberInfo.LastName + " already exist from the list!");
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.Message);
                }
            }
            return new JsonResult(new { memberInfo, message, success, errors = ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray() });       
        }
        /* Member's Scans */
        public async Task<JsonResult> OnPostReadMemberScansAsync(int memberId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                Scans = await _context.Scan
                      .Where(x => x.MemberId == memberId)
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
        public async Task<JsonResult> OnPostReadScanChartAsync(int memberId)
        {
            ScanChartViewModel scanChart = new ScanChartViewModel();
            try
            {                
                Scans = await _context.Scan
                       .Where(x => x.MemberId == memberId)
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
        /* Member's Membership */
        public JsonResult OnPostReadMembership(int memberId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {                
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetActiveMembership"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@MemberId", SqlDbType.Int) { Value = memberId };
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
        /* Member's Contract */
        public JsonResult OnPostReadContract(int memberId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {               
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetMemberContract"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@MemberId", SqlDbType.Int) { Value = memberId };
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
        /* Member's Visits */
        public JsonResult OnPostReadVisits(int memberId, [DataSourceRequest] DataSourceRequest request)
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
        public async Task<JsonResult> OnPostReadClientVisitsSummationsAsync(int memberId)
        {
            VisitsSummationViewModel totals = new VisitsSummationViewModel();
            List<MemberAchievementRewardViewModel> rewards = new List<MemberAchievementRewardViewModel>();
            try
            {
                var Absences = 0;
                var LateCancelled = 0;
                var SignedIn = 0;
                var TotalVisits = 0;
                var studioId = await _studioService.GetStudioIdAsync(0, User.Identity.Name);                
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetClientVisits"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@MemberId", SqlDbType.Int) { Value = memberId };
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
        public JsonResult OnPostUpdateClaimedRewards(int achievementId, bool IsClaimedRewards)
        {
            
            var message = string.Empty;
            try
            {
                var reward = _context.MemberAchievementReward.Where(x => x.MemberAchievementRewardId == achievementId).FirstOrDefault();
                reward.IsGiven = IsClaimedRewards;
                reward.DateModified = DateTime.Now;

                _context.Update(reward);
                _context.SaveChanges(User.Identity.Name); 
                message = IsClaimedRewards ? "Achievement has been tagged as claimed." : "Achievement has been tagged as unclaimed.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                message = "There is something wrong. Please contact you administrator.";
            }

            return new JsonResult(message);

        }
        /* Member's PaymentMethod */
        public async Task<JsonResult> OnPostReadPaymentMethodAsync(int memberId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {                 
                if (memberId != 0)
                {
                    PaymentMethods = await _context.PaymentMethod
                        .Include(x => x.Member)
                        .Include(x => x.PaymentSource)
                        .Include(x => x.PaymentMethodType)
                        .Include(x => x.PaidByOtherMember)
                        .Where(x => x.MemberId == memberId)
                        .Select(x => new PaymentMethodViewModel
                        {
                            PaymentMethodId = x.PaymentMethodId,
                            MemberId = x.MemberId,
                            IsActive = x.IsActive,
                            IsDefault = x.IsDefault,
                            PaymentSourceId = x.PaymentSourceId,
                            Source = x.PaymentSource.Description,
                            PaymentMethodTypeId = x.PaymentMethodTypeId,
                            MethodType = x.PaymentMethodType.Description,
                            PaidByOtherMemberId = x.PaidByOtherMemberId,
                            ForOtherMemberDisplayName = x.PaidByOtherMember.DisplayName
                            //DateCreated = x.DateCreated,
                            //DateModified = x.DateModified
                        })
                        .ToListAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(PaymentMethods.ToDataSourceResult(request));
        }
        public async Task<JsonResult> OnPostCreatePaymentMethodAsync([DataSourceRequest] DataSourceRequest request, PaymentMethodViewModel paymentMethod)
        {
            try
            {            
                if (ModelState.IsValid)
                {
                    
                    var exist = await _context.PaymentMethod
                            .Where(x => x.PaymentMethodTypeId == paymentMethod.PaymentMethodTypeId
                                  && x.MemberId == paymentMethod.MemberId)
                            .FirstOrDefaultAsync();

                    if (exist != null)
                    {
                        ModelState.AddModelError("error", "Payment method already exist!");
                    }
                    else
                    {
                        if (paymentMethod.IsDefault)
                        {
                            var paymentMethods = await _context.PaymentMethod.Where(x => x.MemberId == paymentMethod.MemberId).ToListAsync();
                            foreach (var method in paymentMethods)
                            {
                                method.IsDefault = false;
                                _context.Update(method);
                            }

                        }

                        PaymentMethod newPaymentMethod = new PaymentMethod()
                        {
                            MemberId = paymentMethod.MemberId,
                            IsDefault = paymentMethod.IsDefault,
                            IsActive = paymentMethod.IsActive,
                            PaymentSourceId = 2,
                            PaymentMethodTypeId = paymentMethod.PaymentMethodTypeId,
                            PaidByOtherMemberId = paymentMethod.PaidByOtherMemberId,
                            DateCreated = DateTime.Now
                        };

                        await _context.PaymentMethod.AddAsync(newPaymentMethod);
                        await _context.SaveChangesAsync(User.Identity.Name);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(new[] { paymentMethod }.ToDataSourceResult(request, ModelState));
        }
        public async Task<JsonResult> OnPostUpdatePaymentMethodAsync([DataSourceRequest] DataSourceRequest request, PaymentMethodViewModel paymentMethod)
        {
            try
            {
                if (ModelState.IsValid) {
                
                    var exist = await _context.PaymentMethod
                            .Where(x => x.PaymentMethodId != paymentMethod.PaymentMethodId
                                  && x.MemberId == paymentMethod.MemberId
                                  && x.PaymentMethodTypeId == paymentMethod.PaymentMethodTypeId)
                            .FirstOrDefaultAsync();

                    if (exist != null)
                    {
                        ModelState.AddModelError("error", "Payment method already exist!");
                    }
                    else
                    {
                        if (paymentMethod.IsDefault)
                        {
                            var paymentMethods = await _context.PaymentMethod.Where(x => x.MemberId == paymentMethod.MemberId).ToListAsync();
                            //paymentMethods.Each(x => x.IsDefault = false);
                            foreach (var method in paymentMethods)
                            {
                                method.IsDefault = false;
                                _context.Update(method);
                            }
                        }
                        var payMethod = await _context.PaymentMethod
                            .Where(x => x.PaymentMethodId == paymentMethod.PaymentMethodId
                                  && x.MemberId == paymentMethod.MemberId)
                          .FirstOrDefaultAsync();

                        payMethod.IsActive = paymentMethod.IsActive;
                        payMethod.IsDefault = paymentMethod.IsDefault;
                        payMethod.PaymentMethodTypeId = paymentMethod.PaymentMethodTypeId;
                        payMethod.PaidByOtherMemberId = paymentMethod.PaidByOtherMemberId;
                        payMethod.DateModified = DateTime.Now;
                        _context.Update(payMethod);
                    }

                    if (paymentMethod.PaidByOtherMemberId != null)
                    {

                        var member = await _context.Member.Where(x => x.MemberId == paymentMethod.MemberId).FirstOrDefaultAsync();
                        member.PaidById = paymentMethod.PaidByOtherMemberId;
                        member.DateModified = DateTime.Now;
                        _context.Update(member);
                    }
                    await _context.SaveChangesAsync(User.Identity.Name);
                }              
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new[] { paymentMethod }.ToDataSourceResult(request, ModelState));
        }
        public async Task<JsonResult> OnPostDestroyPaymentMethodAsync([DataSourceRequest] DataSourceRequest request, PaymentMethodViewModel paymentMethod)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    
                    var payment = await _context.PaymentMethod
                            .Where(x => x.PaymentMethodId == paymentMethod.PaymentMethodId
                                  && x.MemberId == paymentMethod.MemberId)
                            .FirstOrDefaultAsync();

                    _context.PaymentMethod.Remove(payment);
                    await _context.SaveChangesAsync(User.Identity.Name);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new JsonResult(new[] { paymentMethod }.ToDataSourceResult(request, ModelState));
        }
        /* Member's Purchases */
        public JsonResult OnPostReadPurchase(int memberId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {                
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetClientPurchases"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@MemberId", SqlDbType.Int) { Value = memberId };
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
        public JsonResult OnPostReadClientTotalAmountPaid(int memberId)
        {
            decimal TotalAmountPaid = 0.0M;
            try
            {
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetTotalPayment"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@MemberId", SqlDbType.Int) { Value = memberId };
                    cmd.Parameters.Add(param);
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                            Purchases = _context.MapToList<PurchasesViewModel>(result);
                    }
                }

                TotalAmountPaid = (decimal)Purchases.Sum(x => x.AmountPaid);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(TotalAmountPaid);

        }
        /* Member's Challenges */
        public JsonResult OnPostReadMemberChallenge(int memberId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
               
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetMemberChallenges"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@MemberId", SqlDbType.Int) { Value = memberId };
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
    }
}
