using DataAccess.Contexts;
using DataAccess.Models;
using DataService.ServiceModels;
using DataService.Services.Interfaces;
using DataService.ViewModels;
using DataService.Utilities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;


namespace DataService.Services
{
    public class MindBodyFullSync : IMindBodyFullSync
    {
        public IConfiguration Configuration { get; }
        private readonly ILogger<MindBodyFullSync> Logger;
        public readonly IMindBodyService MindbodyService;
        public readonly StudioCentralContext _context;

        public MindBodyFullSync(IConfiguration configuration, ILogger<MindBodyFullSync> logger,
                                IMindBodyService mindbodyService, StudioCentralContext context)
        {
            _context = context;
            Configuration = configuration;
            Logger = logger;
            MindbodyService = mindbodyService;
        }

        public AccessTokenViewModel AccessToken { get; set; }
        public MbclientVisits ClientVisits { get; set; }
        public MindbodyClientActiveMembership MBActiveMembership { get; set; }
        public MbautopayEvents MBautopayEvents { get; set; }
        public MindbodyClasses MBClasses { get; set; }
        public MindbodyClassSchedule MBClassSchedule { get; set; }
        public MindbodyClientContract MBClientContract { get; set; }
        public MbclientInfo MbClientInfo { get; set; }
        public MindbodyClients MBClients { get; set; }
        public MindBodyClientVisits MBClientVisits { get; set; }
        public Mbcontract MBcontract { get; set; }
        public MindbodyClientPurchases MBPurchases { get; set; }
        public MindbodyStaff MBStaff { get; set; }
        public MbmembershipProgram MembershipProgram { get; set; }
        public IEnumerable<DateViewModel> Dates { get; set; }

        public IEnumerable<MbclientActiveMembership> ActiveMemberships { get; set; }
        public IEnumerable<Mbinterface> MbInterfaces { get; set; }

        public async Task<string> GetuserTokenAsync(int siteId, int studioId)
        {
            var api = _context.MbwebApi.Where(x => x.Title == "GetUserAccessToken").FirstOrDefault();
            var username = Configuration.GetValue<string>("MindBody:UserName");
            var password = Configuration.GetValue<string>("MindBody:Password");
            var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");

            var client = new RestClient(api.Url);
            var request = new RestRequest(Method.POST);
            request.AddHeader("SiteId", siteId.ToString());
            request.AddHeader("Api-Key", Configuration.GetValue<string>("MindBody:APIKey"));
            request.AddHeader("User-Agent", userAgent);
            request.AddHeader("Content-Type", "application/json");
            request.AddParameter("application/json",
                                "{\r\n\t\"Username\": \"" + username +
                                "\",\r\n\t\"Password\": \"" + password + "\"\r\n}",
                                ParameterType.RequestBody);

            IRestResponse response = await client.ExecuteAsync(request);
            MindbodyService.LogCall(api, siteId, studioId);

            if (response.IsSuccessful)
            {
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var UserAccessToken = response.Content;
                    AccessToken = JsonConvert.DeserializeObject<AccessTokenViewModel>(UserAccessToken);
                }
            }

            return AccessToken.AccessToken;
        }
        public async Task GetMindBodyFullSyncAsync()
        {
            MbInterfaces = _context.Mbinterface.ToList();
            foreach (var mbInterface in MbInterfaces)
            {
                await Task.Run(() => SyncClientsFromMindBodyAsync(mbInterface, 1));
                //await Task.Run(() => ManualFullSync(mbInterface));
            }
            Logger.LogInformation("===============Full sync ended: " + DateTime.Now + " ===============");
        }
        public async Task ManualFullSync(Mbinterface site)
        {
            Logger.LogInformation("<<<===============INITIATE FULL SYNC SERVICE Members for site: " + site.MindbodyStudioId + "  ===============");
            try
            {
                #region Manual sync for Class.
                //await SyncClassesFromMindBody(site);
                #endregion

                #region Manual sync for Class schedule.
                await SyncClientsFromMindBodyAsync(site, 1);
                #endregion  

                Logger.LogInformation("<<<=============== FULL SYNC SERVICE DONE for site: " + site.MindbodyStudioId + " ===============");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message + " <<<=============== Error in site: " + site.MindbodyStudioId +  " =============== ");
            }
        }

        #region Sync client's Information
        public async Task SyncClientsFromMindBodyAsync(Mbinterface mbInterface, int userId)
        {
            int offset = 0;
            int updated = 0;
            int created = 0;

            try
            {
                //generate token
                var token = await GetuserTokenAsync(mbInterface.MindbodyStudioId, mbInterface.StudioId);
                //get the total result
                var result = await GetMindBodyClientsAsync(offset, mbInterface.MindbodyStudioId.ToString(), token, mbInterface.StudioId);

                if (result != string.Empty)
                {
                    MBClients = JsonConvert.DeserializeObject<MindbodyClients>(result);
                    int totalResult = MBClients.PaginationResponse.TotalResults;

                    // Iterate totalResult by 200 records.  
                    for (int count = 0; count <= totalResult;)
                    {
                        if(offset > 0)
                        {
                            result = await GetMindBodyClientsAsync(offset, mbInterface.MindbodyStudioId.ToString(), token, mbInterface.StudioId);
                        }
                       
                        
                        
                        if (result != string.Empty)
                        {
                            MBClients = JsonConvert.DeserializeObject<MindbodyClients>(result);
                            var clients = MBClients.Clients.ToList();

                            foreach (var client in clients)
                            {
                                // check and update mobilenmber format (must start with 0 not 61)
                                var mobileNo = UpdateMobileFormat(client.MobilePhone);

                                //validate client from mindbody
                                MbClientInfo = await _context.MbclientInfo
                                              .Where(x => x.SiteId == mbInterface.MindbodyStudioId
                                                      && x.FirstName == client.FirstName
                                                      && x.LastName == client.LastName
                                                      && x.UniqueId == client.UniqueId
                                                      )
                                              .FirstOrDefaultAsync();

                                #region Insert/Update MBclientInfo staging table 
                                if (MbClientInfo != null)
                                {
                                    if (MbClientInfo.LastModifiedDateTime.HasValue)
                                    {
                                        if (MbClientInfo.LastModifiedDateTime < client.LastModifiedDateTime)
                                        {
                                            await UpdateMbClientInfoAsync(client, mobileNo);
                                            updated += 1;
                                        }
                                    }
                                    else
                                    {
                                        if (MbClientInfo.CreationDate < client.LastModifiedDateTime)
                                        {
                                            await UpdateMbClientInfoAsync(client, mobileNo);
                                            updated += 1;
                                        }
                                    }
                                    if (client.ClientCreditCard != null)
                                        await UpdateClientCreditCardInfo(client.ClientCreditCard, MbClientInfo);
                                }
                                else
                                {
                                    MbclientInfo mbclientInfo = new MbclientInfo()
                                    {
                                        MbclientId = Guid.NewGuid(),
                                        SiteId = mbInterface.MindbodyStudioId,
                                        Id = (string.IsNullOrWhiteSpace(client.Id)) ? client.UniqueId.ToString() : client.Id,
                                        UniqueId = client.UniqueId,
                                        FirstName = client.FirstName,
                                        LastName = client.LastName,
                                        MiddleName = client.MiddleName,
                                        BirthDate = client.BirthDate,
                                        Email = client.Email,
                                        MobilePhone = mobileNo,
                                        MobileProvider = client.MobileProvider,
                                        HomePhone = client.HomePhone,
                                        WorkPhone = client.WorkPhone,
                                        AddressLine1 = client.AddressLine1,
                                        AddressLine2 = client.AddressLine2,
                                        City = client.City,
                                        PostalCode = client.PostalCode,
                                        State = client.State,
                                        Country = client.Country,
                                        Gender = client.Gender,
                                        Active = client.Active,
                                        Status = client.Status,
                                        Action = client.Action,
                                        PhotoUrl = client.PhotoUrl,
                                        CreationDate = client.CreationDate,
                                        LastModifiedDateTime = client.LastModifiedDateTime,
                                        SendAccountEmails = client.SendAccountEmails,
                                        SendAccountTexts = client.SendAccountTexts,
                                        SendPromotionalEmails = client.SendPromotionalEmails,
                                        SendPromotionalTexts = client.SendPromotionalTexts,
                                        SendScheduleEmails = client.SendScheduleEmails,
                                        SendScheduleTexts = client.SendScheduleTexts,
                                        EmergencyContactInfoName = client.EmergencyContactInfoName,
                                        EmergencyContactInfoPhone = client.EmergencyContactInfoPhone,
                                        EmergencyContactInfoEmail = client.EmergencyContactInfoEmail,
                                        EmergencyContactInfoRelationship = client.EmergencyContactInfoRelationship,
                                        AppointmentGenderPreference = client.AppointmentGenderPreference,
                                        FirstAppointmentDate = client.FirstAppointmentDate,
                                        IsCompany = client.IsCompany,
                                        IsProspect = client.IsProspect,
                                        LiabilityRelease = client.LiabilityRelease,
                                        MembershipIcon = client.MembershipIcon,
                                        Notes = client.Notes,
                                        RedAlert = client.RedAlert,
                                        YellowAlert = client.YellowAlert,
                                        ReferredBy = client.ReferredBy
                                    };

                                    await _context.MbclientInfo.AddAsync(mbclientInfo);
                                    await _context.SaveChangesAsync();
                                    created += 1;

                                    if (client.ClientCreditCard != null)
                                        await UpdateClientCreditCardInfo(client.ClientCreditCard, mbclientInfo);
                                }
                                #endregion 

                                #region Update Member Table
                                var member = await _context.Member
                                .Where(x => x.FirstName == client.FirstName
                                        && x.LastName == client.LastName
                                        && x.StudioId == mbInterface.StudioId
                                        && x.Mbid == client.Id)
                                .FirstOrDefaultAsync();

                                var gender = await _context.Gender.FirstOrDefaultAsync(x => x.Description == client.Gender);
                                var status = await _context.MemberStatus.FirstOrDefaultAsync(x => x.Status == client.Status);

                                if (member != null)
                                {
                                    if (member.MblastModifiedDateTime < client.LastModifiedDateTime)
                                    {
                                        member.MbuniqueId = client.UniqueId;
                                        member.Mbid = String.IsNullOrEmpty(client.Id) ? client.UniqueId.ToString() : client.Id;
                                        member.FirstName = client.FirstName;
                                        member.LastName = client.LastName;
                                        member.MiddleName = client.MiddleName;
                                        member.Dob = client.BirthDate;
                                        member.Email = client.Email;
                                        member.MobilePhone = mobileNo;
                                        member.MbuniqueId = client.UniqueId;
                                        member.HomePhone = client.HomePhone;
                                        member.WorkPhone = client.WorkPhone;
                                        member.AddressLine1 = client.AddressLine1;
                                        member.AddressLine2 = client.AddressLine2;
                                        member.City = client.City;
                                        member.PostalCode = client.PostalCode;
                                        member.State = client.State;
                                        member.Country = client.Country;
                                        member.GenderId = gender.GenderId;
                                        member.Active = client.Active;
                                        member.MemberStatusId = status.MemberStatusId;
                                        member.Action = client.Action;
                                        member.PhotoUrl = client.PhotoUrl;
                                        member.MbcreationDate = client.CreationDate;
                                        member.MblastModifiedDateTime = client.LastModifiedDateTime;
                                        member.SendAccountEmails = client.SendAccountEmails;
                                        member.SendAccountTexts = client.SendAccountTexts;
                                        member.SendPromotionalEmails = client.SendPromotionalEmails;
                                        member.SendPromotionalTexts = client.SendPromotionalTexts;
                                        member.SendScheduleEmails = client.SendScheduleEmails;
                                        member.SendScheduleTexts = client.SendScheduleTexts;
                                        member.EmergencyContactInfoName = client.EmergencyContactInfoName;
                                        member.EmergencyContactInfoPhone = client.EmergencyContactInfoPhone;
                                        member.EmergencyContactInfoEmail = client.EmergencyContactInfoEmail;
                                        member.EmergencyContactInfoRelationship = client.EmergencyContactInfoRelationship;
                                    }

                                    member.CreditCardLastFour = client.ClientCreditCard?.LastFour;

                                    updated += 1;
                                    _context.Update(member);
                                    await _context.SaveChangesAsync();
                                }
                                else
                                {
                                    Member newMember = new Member()
                                    {
                                        StudioId = mbInterface.StudioId,
                                        MbuniqueId = client.UniqueId,
                                        Mbid = String.IsNullOrEmpty(client.Id) ? client.UniqueId.ToString() : client.Id,
                                        FirstName = client.FirstName,
                                        LastName = client.LastName,
                                        MiddleName = client.MiddleName,
                                        Dob = client.BirthDate,
                                        DisplayName = client.FirstName + " " + client.LastName,
                                        Email = client.Email,
                                        ScannerMobile = mobileNo, // set mobile number as default scanner mobile when added in studio central
                                        MobilePhone = mobileNo,
                                        HomePhone = client.HomePhone,
                                        WorkPhone = client.WorkPhone,
                                        AddressLine1 = client.AddressLine1,
                                        AddressLine2 = client.AddressLine2,
                                        City = client.City,
                                        PostalCode = client.PostalCode,
                                        State = client.State,
                                        Country = client.Country,
                                        GenderId = gender.GenderId,
                                        Active = client.Active,
                                        MemberStatusId = status.MemberStatusId,
                                        Action = client.Action,
                                        PhotoUrl = client.PhotoUrl,
                                        MbcreationDate = client.CreationDate,
                                        MblastModifiedDateTime = client.LastModifiedDateTime,
                                        SendAccountEmails = client.SendAccountEmails,
                                        SendAccountTexts = client.SendAccountTexts,
                                        SendPromotionalEmails = client.SendPromotionalEmails,
                                        SendPromotionalTexts = client.SendPromotionalTexts,
                                        SendScheduleEmails = client.SendScheduleEmails,
                                        SendScheduleTexts = client.SendScheduleTexts,
                                        EmergencyContactInfoName = client.EmergencyContactInfoName,
                                        EmergencyContactInfoPhone = client.EmergencyContactInfoPhone,
                                        EmergencyContactInfoEmail = client.EmergencyContactInfoEmail,
                                        EmergencyContactInfoRelationship = client.EmergencyContactInfoRelationship,
                                        CreatedById = userId,
                                        DateCreated = DateTime.Now,
                                        CreditCardLastFour = client.ClientCreditCard?.LastFour

                                    };
                                    await _context.Member.AddAsync(newMember);
                                    await _context.SaveChangesAsync();
                                    created += 1;
                                }

                                #endregion
                            }
                        }
                        offset += 200;
                        count = offset;
                    }

                    #region Insert to mind body log sync and changes
                    SyncLog syncLog = new SyncLog()
                    {
                        SyncLogId = Guid.NewGuid(),
                        DateSynced = DateTime.Now,
                        MbsiteId = mbInterface.MindbodyStudioId,
                        StudioId = mbInterface.StudioId,
                        UpdatedMember = updated,
                        CreatedMember = created
                    };
                    await _context.SyncLog.AddAsync(syncLog);
                    await _context.SaveChangesAsync();
                    #endregion


                }
            }
            catch (Exception e)
            {
                Logger.LogError(e.Message);
            }
        }
        public async Task<string> GetMindBodyClientsAsync(int offset, string siteId, string token, int studioId)
        {
            var result = string.Empty;
            var api = await _context.MbwebApi.Where(x => x.Title == "GetClients").FirstOrDefaultAsync();
            var client = (offset != 0)
                ? new RestClient(api.Url + "?limit=200&offset=" + offset)
                : new RestClient(api.Url + "?limit=200");
            var request = new RestRequest(Method.GET);
            request.AddHeader("SiteId", siteId);
            request.AddHeader("Api-Key", Configuration.GetValue<string>("MindBody:APIKey"));
            request.AddHeader("Authorization", token);
            IRestResponse response = await client.ExecuteAsync(request);
            MindbodyService.LogCall(api, int.Parse(siteId), studioId);

            if (response.IsSuccessful)
            {
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    result = response.Content;
                }
            }
            return result;
        }
        public async Task UpdateMbClientInfoAsync(ClientInfo client, string mobileNo)
        {
            MbClientInfo.Id = (string.IsNullOrWhiteSpace(client.Id)) ? client.UniqueId.ToString() : client.Id;
            MbClientInfo.UniqueId = client.UniqueId;
            MbClientInfo.FirstName = client.FirstName;
            MbClientInfo.LastName = client.LastName;
            MbClientInfo.MiddleName = client.MiddleName;
            MbClientInfo.BirthDate = client.BirthDate;
            MbClientInfo.Email = client.Email;
            MbClientInfo.MobilePhone = mobileNo;
            MbClientInfo.MobileProvider = client.MobileProvider;
            MbClientInfo.HomePhone = client.HomePhone;
            MbClientInfo.WorkPhone = client.WorkPhone;
            MbClientInfo.AddressLine1 = client.AddressLine1;
            MbClientInfo.AddressLine2 = client.AddressLine2;
            MbClientInfo.City = client.City;
            MbClientInfo.PostalCode = client.PostalCode;
            MbClientInfo.State = client.State;
            MbClientInfo.Country = client.Country;
            MbClientInfo.Gender = client.Gender;
            MbClientInfo.Active = client.Active;
            MbClientInfo.Status = client.Status;
            MbClientInfo.Action = client.Action;
            MbClientInfo.PhotoUrl = client.PhotoUrl;
            MbClientInfo.CreationDate = client.CreationDate;
            MbClientInfo.LastModifiedDateTime = client.LastModifiedDateTime;
            MbClientInfo.SendAccountEmails = client.SendAccountEmails;
            MbClientInfo.SendAccountTexts = client.SendAccountTexts;
            MbClientInfo.SendPromotionalEmails = client.SendPromotionalEmails;
            MbClientInfo.SendPromotionalTexts = client.SendPromotionalTexts;
            MbClientInfo.SendScheduleEmails = client.SendScheduleEmails;
            MbClientInfo.SendScheduleTexts = client.SendScheduleTexts;
            MbClientInfo.EmergencyContactInfoName = client.EmergencyContactInfoName;
            MbClientInfo.EmergencyContactInfoPhone = client.EmergencyContactInfoPhone;
            MbClientInfo.EmergencyContactInfoEmail = client.EmergencyContactInfoEmail;
            MbClientInfo.EmergencyContactInfoRelationship = client.EmergencyContactInfoRelationship;
            MbClientInfo.AppointmentGenderPreference = client.AppointmentGenderPreference;
            MbClientInfo.FirstAppointmentDate = client.FirstAppointmentDate;
            MbClientInfo.IsCompany = client.IsCompany;
            MbClientInfo.IsProspect = client.IsProspect;
            MbClientInfo.LiabilityRelease = client.LiabilityRelease;
            MbClientInfo.MembershipIcon = client.MembershipIcon;
            MbClientInfo.Notes = client.Notes;
            MbClientInfo.RedAlert = client.RedAlert;
            MbClientInfo.YellowAlert = client.YellowAlert;
            MbClientInfo.ReferredBy = client.ReferredBy;
            _context.Update(MbClientInfo);
            await _context.SaveChangesAsync();

        }
        public string UpdateMobileFormat(string mobileNumber)
        {
            var mobileNo = string.Empty;

            if (!string.IsNullOrEmpty(mobileNumber) && (mobileNumber.Length > 10))
            {
                mobileNo = mobileNumber.Substring(0, 2) == "61" ? Regex.Replace(mobileNumber, "^61", "0") : Regex.Replace(mobileNumber, "^\\+61", "0");
            }
            else if (!string.IsNullOrEmpty(mobileNumber) && mobileNumber.Length < 10 && mobileNumber.Substring(0, 1) != "0")
            {
                mobileNo = string.Format("0{0}", mobileNumber);
            }
            else
            {
                mobileNo = mobileNumber;
            }
            return mobileNo;
        }
        public async Task UpdateClientCreditCardInfo(MbclientCreaditCard creaditCard, MbclientInfo mbclientInfo)
        {
            try
            {
                var mbCreaditCard = await _context.MbclientCreaditCard.Where(x => x.MbclientId == mbclientInfo.MbclientId).FirstOrDefaultAsync();

                if (mbCreaditCard != null)
                {
                    mbCreaditCard.MbclientId = mbclientInfo.MbclientId;
                    mbCreaditCard.SiteId = mbclientInfo.SiteId;
                    mbCreaditCard.MbuniqueId = mbclientInfo.UniqueId;
                    _context.Update(mbCreaditCard);
                }
                else
                {
                    creaditCard.MbclientId = mbclientInfo.MbclientId;
                    creaditCard.SiteId = mbclientInfo.SiteId;
                    creaditCard.MbuniqueId = mbclientInfo.UniqueId;
                    await _context.MbclientCreaditCard.AddAsync(creaditCard);
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message + "======================== ClientCreditCardInfo" + mbclientInfo.MbclientId.ToString());
            }
        }
        #endregion

        #region Sync client's visits
        /* This service is using the staging table for members (MBClientInfo) */
        public async Task SyncClientVisitsFromMindBodyAsync(Mbinterface mbInterface, MbclientInfo mbclientInfo, string token)
        {
            try
            {
                //int offset = 0;

                //var clientId = (!string.IsNullOrWhiteSpace(mbclientInfo.Id)) ? mbclientInfo.Id : mbclientInfo.UniqueId.ToString();

                //var clientVisit = await _context.MbclientVisits.Where(x => x.ClientId == clientId).OrderByDescending(x => x.StartDateTime).FirstOrDefaultAsync();

                //var startDate = clientVisit != null ? clientVisit.StartDateTime.Value.ToString("s") : mbclientInfo.CreationDate.ToString("s");
                //var siteId = mbInterface.MindbodyStudioId.ToString();

                //if (!string.IsNullOrEmpty(startDate))
                //{
                //    SyncVisitsParamViewModel param = new SyncVisitsParamViewModel()
                //    {
                //        Offset = offset,
                //        SiteId = siteId,
                //        ClientId = clientId,
                //        StartDate = startDate,
                //        StudioId = mbInterface.StudioId,
                //        Token = token
                //    };

                //    var result = await MindbodyClientVisitsAsync(param);
                //    if (result != string.Empty)
                //    {
                //        MBClientVisits = JsonConvert.DeserializeObject<MindBodyClientVisits>(result);
                //        int totalResult = MBClientVisits.PaginationResponse.TotalResults;
                //        for (int count = 0; count <= totalResult;)
                //        {
                //            if (offset > 0)
                //            {
                //                SyncVisitsParamViewModel iParam = new SyncVisitsParamViewModel()
                //                {
                //                    Offset = offset,
                //                    SiteId = siteId,
                //                    ClientId = clientId,
                //                    StartDate = startDate,
                //                    StudioId = mbInterface.StudioId,
                //                    Token = token
                //                };
                //                result = await MindbodyClientVisitsAsync(iParam);
                //            }

                //            if (result != string.Empty)
                //            {
                //                MBClientVisits = JsonConvert.DeserializeObject<MindBodyClientVisits>(result);

                //                if (MBClientVisits.Visits.Count() != 0)
                //                {
                //                    var visits = MBClientVisits.Visits.ToList();

                //                    foreach (var visit in visits)
                //                    {
                //                        var LastModifiedDateTime = DateTime.Parse(visit.LastModifiedDateTime.ToString());

                //                        if (LastModifiedDateTime < DateTime.Parse("1759-01-01"))
                //                        {
                //                            visit.LastModifiedDateTime = null;
                //                        }
                //                        else
                //                        {
                //                            visit.LastModifiedDateTime = LastModifiedDateTime;
                //                        }

                //                        ClientVisits = await _context.MbclientVisits
                //                           .Where(x => x.ClientId == visit.ClientId
                //                           && x.SiteId == visit.SiteId
                //                           && x.Id == visit.Id
                //                           && x.ClassId == visit.ClassId
                //                           ).FirstOrDefaultAsync();

                //                        if (ClientVisits == null)
                //                        {
                //                            await _context.MbclientVisits.AddAsync(visit);
                //                            await _context.SaveChangesAsync();
                //                        }
                //                    }
                //                }
                //            }
                //            offset += 200;
                //            count = offset;
                //        }
                //    }
                //}

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message + "SyncVisits");
            }
        }
        public async Task<string> MindbodyClientVisitsAsync(SyncVisitsParamViewModel param)
        {
            var result = string.Empty;
            try
            {
                var api = await _context.MbwebApi.Where(x => x.Title == "GetClientVisits").FirstOrDefaultAsync();
                var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");
                var client = (param.Offset != 0)
                    ? new RestClient(api.Url + param.ClientId + "&StartDate=" + param.StartDate + "&CrossRegionalLookup=false&limit=200&offset=" + param.Offset)
                    : new RestClient(api.Url + param.ClientId + "&StartDate=" + param.StartDate + "&CrossRegionalLookup=false&limit=200");

                var request = new RestRequest(Method.GET);
                request.AddHeader("SiteId", param.SiteId);
                request.AddHeader("Api-Key", Configuration.GetValue<string>("MindBody:APIKey"));
                request.AddHeader("User-Agent", userAgent);
                request.AddHeader("Authorization", param.Token);
                request.AddHeader("Content-Type", "application/json");
                IRestResponse response = await client.ExecuteAsync(request);
                MindbodyService.LogCall(api, int.Parse(param.SiteId), param.StudioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        result = response.Content;
                    }
                }
                else
                {

                    Logger.LogError(response.StatusCode + response.ErrorMessage + " APIVisits " + param.ClientId);

                }

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message + "APIVisits");
            }
            return result;
        }
        public async Task<string> MindbodyCustomClientVisitsAsync(SyncVisitsParamViewModel param)
        {
            var result = string.Empty;
            try
            {
                var api = await _context.MbwebApi.Where(x => x.Title == "GetClientVisits").FirstOrDefaultAsync();
                var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");
                var client = new RestClient(api.Url + param.ClientId + "&StartDate=" + param.StartDate + "&EndDate=" + param.EndDate + "&CrossRegionalLookup=false&limit=200");

                var request = new RestRequest(Method.GET);
                request.AddHeader("SiteId", param.SiteId);
                request.AddHeader("Api-Key", Configuration.GetValue<string>("MindBody:APIKey"));
                request.AddHeader("User-Agent", userAgent);
                request.AddHeader("Authorization", param.Token);
                request.AddHeader("Content-Type", "application/json");
                IRestResponse response = await client.ExecuteAsync(request);
                MindbodyService.LogCall(api, int.Parse(param.SiteId), param.StudioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        result = response.Content;
                    }
                }
                else
                {

                    Logger.LogError(response.StatusCode + response.ErrorMessage + " APIVisits " + param.ClientId);

                }

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message + "APIVisits");
            }
            return result;
        }
        #endregion

        #region Sync client's purchases  
        /* This service is using the staging table for members (MBClientInfo) */
        public async Task SyncClientPurchasesFromMindBodyAsync(Mbinterface mbInterface, MbclientInfo mbclientInfo)
        {
            try
            {
                int offset = 0;
                var clientId = (!string.IsNullOrWhiteSpace(mbclientInfo.Id)) ? mbclientInfo.Id : mbclientInfo.UniqueId.ToString();

                var clientPurchases = await _context.Purchases
                        .Where(x => x.ClientId == clientId)
                        .OrderByDescending(x => x.SaleDateTime)
                        .FirstOrDefaultAsync();

                var startDate = clientPurchases != null ? clientPurchases.SaleDateTime.Value.ToString("s") : mbclientInfo.CreationDate.ToString("s");
                var siteId = mbInterface.MindbodyStudioId.ToString();
                var result = await MindbodyClientPurchaseAsync(offset, siteId, clientId, startDate, mbInterface.StudioId);

                if (result != string.Empty)
                {
                    MBPurchases = JsonConvert.DeserializeObject<MindbodyClientPurchases>(result);
                    int totalResult = MBPurchases.PaginationResponse.TotalResults;
                    int requestedOffset = MBPurchases.PaginationResponse.RequestedOffset;
                    int pageSize = MBPurchases.PaginationResponse.PageSize;
                    var purchases = MBPurchases.Purchases.ToList();

                    if (pageSize >= totalResult)
                    {
                        foreach (var purchase in purchases)
                        {
                            await InsertClientsPurchasesAsync(purchase, mbInterface.MindbodyStudioId, clientId);
                        }
                    }
                    else
                    {
                        for (int count = requestedOffset; count <= totalResult;)
                        {
                            result = await MindbodyClientPurchaseAsync(requestedOffset, siteId, clientId, startDate, mbInterface.StudioId);

                            if (result != string.Empty)
                            {
                                MBPurchases = JsonConvert.DeserializeObject<MindbodyClientPurchases>(result);
                                pageSize = MBPurchases.PaginationResponse.PageSize;
                                purchases = MBPurchases.Purchases.ToList();
                                offset += pageSize;
                                count = offset;

                                foreach (var purchase in purchases)
                                {
                                    await InsertClientsPurchasesAsync(purchase, mbInterface.MindbodyStudioId, clientId);
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message + "SyncPurchases");
            }

        }
        public async Task<string> MindbodyClientPurchaseAsync(int offset, string siteId, string clientId, string startDate, int studioId)
        {
            var result = string.Empty;
            try
            {
                var api = await _context.MbwebApi.Where(x => x.Title == "GetClientPurchases").FirstOrDefaultAsync();
                var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");
                var client = (offset != 0)
                    ? new RestClient(api.Url + clientId + "&StartDate=" + startDate + "&CrossRegionalLookup=false&limit=200&offset=" + offset)
                    : new RestClient(api.Url + clientId + "&StartDate=" + startDate + "&CrossRegionalLookup=false&limit=200");

                var request = new RestRequest(Method.GET);
                request.AddHeader("SiteId", siteId);
                request.AddHeader("Api-Key", Configuration.GetValue<string>("MindBody:APIKey"));
                request.AddHeader("User-Agent", userAgent);
                IRestResponse response = await client.ExecuteAsync(request);
                MindbodyService.LogCall(api, int.Parse(siteId), studioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        result = response.Content;
                    }
                }
                else
                {
                    Logger.LogError(response.StatusCode + response.ErrorMessage + "APIPurchases");
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message + "APIPurchases");
            }

            return result;
        }
        public async Task InsertClientsPurchasesAsync(Mbpurchases purchase, int siteId, string clientId)
        {
            try
            {
                var Purchase = new Purchases();
                // check if purchase exist
                var clientPurchase = await _context.Purchases
                     .Where(x => x.ClientId == clientId
                     && x.Id == int.Parse(purchase.Sale.Id)
                     && x.SaleDateTime == DateTime.Parse(purchase.Sale.SaleDateTime)).FirstOrDefaultAsync();

                if (clientPurchase == null)
                {
                    //insert to purchase table
                    Purchases newPurchase = new Purchases
                    {
                        SiteId = siteId,
                        Id = int.Parse(purchase.Sale.Id),
                        SaleDate = DateTime.Parse(purchase.Sale.SaleDate),
                        SaleTime = TimeSpan.Parse(purchase.Sale.SaleTime),
                        SaleDateTime = DateTime.Parse(purchase.Sale.SaleDateTime),
                        ClientId = purchase.Sale.ClientId,
                        LocationId = int.Parse(purchase.Sale.LocationId),
                        Description = purchase.Description,
                        AccountPayment = bool.Parse(purchase.AccountPayment),
                        Price = decimal.Parse(purchase.Price),
                        AmountPaid = decimal.Parse(purchase.AmountPaid),
                        Discount = decimal.Parse(purchase.Discount),
                        Tax = decimal.Parse(purchase.Tax),
                        Returned = bool.Parse(purchase.Returned),
                        Quantity = int.Parse(purchase.Quantity)
                    };

                    await _context.Purchases.AddAsync(newPurchase);
                    await _context.SaveChangesAsync();

                    Purchase = await _context.Purchases.FirstOrDefaultAsync(x => x.PurchaseId == newPurchase.PurchaseId);

                }
                else
                {
                    Purchase = clientPurchase;
                }

                var pItems = purchase.Sale.PurchasedItems.ToList();

                foreach (var pItem in pItems)
                {
                    // check if purchase item exist
                    var item = await _context.PurchasedItems
                      .Where(x => x.PurchaseId == Purchase.PurchaseId
                      && x.Id == int.Parse(pItem.Id)).FirstOrDefaultAsync();

                    if (item == null)
                    {
                        //insert Purchased Items
                        PurchasedItems newItem = new PurchasedItems()
                        {
                            PurchaseId = Purchase.PurchaseId,
                            Id = int.Parse(pItem.Id),
                            IsService = bool.Parse(pItem.IsService),
                            BarcodeId = pItem.BarcodeId
                        };
                        newItem.Purchase = null;
                        await _context.PurchasedItems.AddAsync(newItem);
                    }
                }

                var pPayments = purchase.Sale.Payments.ToList();

                foreach (var pPayment in pPayments)
                {
                    // check if purchase payment exist
                    var payment = await _context.Payments
                        .Where(x => x.PurchaseId == Purchase.PurchaseId
                        && x.Id == int.Parse(pPayment.Id)).FirstOrDefaultAsync();

                    if (payment == null)
                    {
                        //insert Payments
                        Payments newPayment = new Payments()
                        {
                            PurchaseId = Purchase.PurchaseId,
                            Id = int.Parse(pPayment.Id),
                            Amount = decimal.Parse(pPayment.Amount),
                            Method = int.Parse(pPayment.Method),
                            Type = pPayment.Type,
                            Notes = pPayment.Notes
                        };

                        newPayment.Purchase = null;
                        await _context.Payments.AddAsync(newPayment);

                    }
                }
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message);
            }
        }
        #endregion

        #region Sync client's contracts
        /* This service is using the staging table for members (MBClientInfo) */
        public async Task SyncClientContractFromMindBodyAsync(Mbinterface mbInterface, MbclientInfo mbclientInfo)
        {
            //var token = await GetuserTokenAsync(mbInterface.MindbodyStudioId, mbInterface.StudioId);
            var api = await _context.MbwebApi.Where(x => x.Title == "GetClientContract").FirstOrDefaultAsync();
            var clientId = (!string.IsNullOrWhiteSpace(mbclientInfo.Id)) ? mbclientInfo.Id : mbclientInfo.UniqueId.ToString();
            var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");
            var client = new RestClient(api.Url + clientId.ToString());
            var request = new RestRequest(Method.GET);
            request.AddHeader("SiteId", mbInterface.MindbodyStudioId.ToString());
            request.AddHeader("Api-Key", Configuration.GetValue<string>("MindBody:APIKey"));
            request.AddHeader("User-Agent", userAgent);
            IRestResponse response = await client.ExecuteAsync(request);
            MindbodyService.LogCall(api, mbInterface.MindbodyStudioId, mbInterface.StudioId);

            if (response.IsSuccessful)
            {
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var result = response.Content;
                    MBClientContract = JsonConvert.DeserializeObject<MindbodyClientContract>(result);

                    if (MBClientContract.Contracts.Count() != 0)
                    {
                        var contracts = MBClientContract.Contracts.ToList();

                        foreach (var contract in contracts)
                        {
                            MBcontract = await _context.Mbcontract
                           .Where(x => x.SiteId == mbInterface.MindbodyStudioId
                                   && (x.ClientId == mbclientInfo.UniqueId.ToString() || x.ClientId == mbclientInfo.Id)
                                   && x.Id == contract.Id)
                           .FirstOrDefaultAsync();

                            if (MBcontract != null)
                            {
                                MBcontract.ClientId = clientId;
                                MBcontract.AgreementDate = contract.AgreementDate;
                                MBcontract.AutopayStatus = contract.AutopayStatus;
                                MBcontract.ContractName = contract.ContractName;
                                MBcontract.EndDate = contract.EndDate;
                                MBcontract.OriginationLocationId = contract.OriginationLocationId;
                                MBcontract.StartDate = contract.StartDate;

                                _context.Update(MBcontract);
                                await _context.SaveChangesAsync();

                                foreach (var events in contract.UpcomingAutopayEvents)
                                {
                                    MBautopayEvents = await _context.MbautopayEvents
                                        .Where(x => x.MbcontractId == MBcontract.MbcontractId
                                        && x.ScheduleDate == events.ScheduleDate).FirstOrDefaultAsync();

                                    if (MBautopayEvents != null)
                                    {
                                        MBautopayEvents.ClientContractId = contract.Id;
                                        MBautopayEvents.ChargeAmount = events.ChargeAmount;
                                        MBautopayEvents.PaymentMethod = events.PaymentMethod;
                                        _context.Update(MBautopayEvents);
                                    }
                                    else
                                    {
                                        events.MbcontractId = MBcontract.MbcontractId;
                                        await _context.MbautopayEvents.AddAsync(events);
                                    }
                                    await _context.SaveChangesAsync();
                                };
                            }
                            else
                            {
                                Mbcontract newContract = new Mbcontract()
                                {
                                    MbcontractId = Guid.NewGuid(),
                                    Id = contract.Id,
                                    SiteId = mbInterface.MindbodyStudioId,
                                    ClientId = clientId,
                                    AgreementDate = contract.AgreementDate,
                                    AutopayStatus = contract.AutopayStatus,
                                    ContractName = contract.ContractName,
                                    EndDate = contract.EndDate,
                                    OriginationLocationId = contract.OriginationLocationId,
                                    StartDate = contract.StartDate,
                                };
                                await _context.Mbcontract.AddAsync(newContract);
                                await _context.SaveChangesAsync();

                                foreach (var events in contract.UpcomingAutopayEvents)
                                {
                                    MBautopayEvents = await _context.MbautopayEvents
                                        .Where(x => x.MbcontractId == newContract.MbcontractId
                                        && x.ScheduleDate == events.ScheduleDate).FirstOrDefaultAsync();

                                    if (MBautopayEvents != null)
                                    {
                                        MBautopayEvents.ChargeAmount = events.ChargeAmount;
                                        MBautopayEvents.PaymentMethod = events.PaymentMethod;
                                        _context.Update(MBautopayEvents);
                                    }
                                    else
                                    {
                                        events.MbcontractId = newContract.MbcontractId;
                                        await _context.MbautopayEvents.AddAsync(events);
                                    }
                                    await _context.SaveChangesAsync();
                                };
                            }
                        }
                    }
                }
                else
                {
                    Logger.LogError(response.StatusCode + response.ErrorMessage + "SyncContract");
                }
            }
            else
            {
                Logger.LogError(response.StatusCode + response.ErrorMessage + "SyncContract");
            }

        }
        #endregion

        #region Sync client's active membership
        /* This service is using the staging table for members (MBClientInfo) */
        public async Task SyncClientActiveMembershipFromMindBody(Mbinterface mbInterface, MbclientInfo mbclientInfo, string token)
        {
            try
            {
                //var token = await GetuserTokenAsync(mbInterface.MindbodyStudioId, mbInterface.StudioId);
                var api = await _context.MbwebApi.Where(x => x.Title == "GetClientActiveMembership").FirstOrDefaultAsync();
                var clientId = (!string.IsNullOrWhiteSpace(mbclientInfo.Id)) ? mbclientInfo.Id : mbclientInfo.UniqueId.ToString();
                var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");
                var client = new RestClient(api.Url + clientId.ToString());

                var request = new RestRequest(Method.GET);
                request.AddHeader("SiteId", mbInterface.MindbodyStudioId.ToString());
                request.AddHeader("Api-Key", Configuration.GetValue<string>("MindBody:APIKey"));
                request.AddHeader("User-Agent", userAgent);
                request.AddHeader("Authorization", token);
                IRestResponse response = client.Execute(request);
                MindbodyService.LogCall(api, mbInterface.MindbodyStudioId, mbInterface.StudioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        var result = response.Content;
                        MBActiveMembership = JsonConvert.DeserializeObject<MindbodyClientActiveMembership>(result);

                        if (MBActiveMembership.ClientMemberships.Count() != 0)
                        {
                            var memberships = MBActiveMembership.ClientMemberships.ToList();

                            //remove all existing active membership per client. Update this when using WEBHOOKS
                            ActiveMemberships = await _context.MbclientActiveMembership
                                    .Where(x => (x.ClientId == mbclientInfo.UniqueId.ToString()
                                        || x.ClientId == mbclientInfo.Id)
                                        && x.SiteId == mbInterface.MindbodyStudioId)
                                    .ToListAsync();

                            _context.MbclientActiveMembership.RemoveRange(ActiveMemberships);
                            await _context.SaveChangesAsync();

                            var contents = string.Empty;
                            foreach (var memberShip in memberships)
                            {
                                foreach (var content in memberShip.Program.ContentFormats)
                                {
                                    contents = (contents == string.Empty) ? content.ToString() : "," + content.ToString();
                                }

                                MembershipProgram = await _context.MbmembershipProgram
                                    .Where(x => x.Id == memberShip.Program.Id)
                                    .FirstOrDefaultAsync();

                                if (MembershipProgram == null)
                                {
                                    MbmembershipProgram program = new MbmembershipProgram
                                    {
                                        Id = memberShip.Program.Id,
                                        Name = memberShip.Program.Name,
                                        ScheduleType = memberShip.Program.ScheduleType,
                                        CancelOffset = memberShip.Program.CancelOffset,
                                        ContentFormats = contents
                                    };

                                    await _context.MbmembershipProgram.AddAsync(program);
                                    await _context.SaveChangesAsync();
                                }

                                MbclientActiveMembership ActiveMembership = new MbclientActiveMembership
                                {
                                    ActiveMembershipId = Guid.NewGuid(),
                                    ClientId = clientId,
                                    MembershipId = memberShip.MembershipId,
                                    ActiveDate = memberShip.ActiveDate,
                                    ExpirationDate = memberShip.ExpirationDate,
                                    PaymentDate = memberShip.PaymentDate,
                                    Count = memberShip.Count, //The number of service sessions this pricing option contained when first purchased.
                                    Current = memberShip.Current, //When true, there are service sessions remaining on the pricing option that can be used pay for the current session. When false, the client cannot use this pricing option to pay for other services.
                                    Id = memberShip.Id, //The unique ID assigned to this pricing option when it was purchased by the client.
                                    ProductId = memberShip.ProductId, //The unique ID of this pricing option. This is the PurchasedItems[].Id returned from GET Sales.
                                    Name = memberShip.Name,
                                    Remaining = memberShip.Remaining, //The number of service sessions remaining in the pricing option that can still be used.
                                    SiteId = memberShip.SiteId,
                                    Action = memberShip.Action,
                                    IconCode = memberShip.IconCode
                                };
                                ActiveMembership.ProductId = memberShip.Program.Id;
                                await _context.MbclientActiveMembership.AddAsync(ActiveMembership);
                                await _context.SaveChangesAsync();
                            }
                        }
                    }
                    else
                    {
                        Logger.LogError(response.StatusCode + response.ErrorMessage + "SyncActiveMembership");
                    }
                }
                else
                {
                    Logger.LogError(response.StatusCode + response.ErrorMessage + "SyncActiveMembership");
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message);
            }
        }
        #endregion

        #region Sync Client's  with Direct Debit Account
        /* This service is using the staging table for members (MBClientInfo) */
        public async Task SyncMemberDirectDebitInfoAsync()
        {
            var studios = await _context.Mbinterface.ToListAsync();

            foreach (var studio in studios)
            {

                var token = await GetuserTokenAsync(studio.MindbodyStudioId, studio.StudioId);
                var members = await _context.Member.Where(x => x.StudioId == studio.StudioId).ToListAsync();

                foreach (var member in members)
                {
                    await SyncClientDirectDebitFromMindBodyAsync(studio, member, token);
                }
            }

            Logger.LogInformation("=============== Sync Direct Debit Information done ===============");
        }
        public async Task SyncClientDirectDebitFromMindBodyAsync(Mbinterface mbInterface, Member mbclientInfo, string token)
        {
            try
            {
                var api = await _context.MbwebApi.Where(x => x.Title == "GetClientDirectDebitInfo").FirstOrDefaultAsync();
                var clientId = (!string.IsNullOrWhiteSpace(mbclientInfo.Mbid)) ? mbclientInfo.Mbid : mbclientInfo.MbuniqueId.ToString();
                var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");
                var client = new RestClient(api.Url + clientId.ToString());

                var request = new RestRequest(Method.GET);
                request.AddHeader("SiteId", mbInterface.MindbodyStudioId.ToString());
                request.AddHeader("Api-Key", Configuration.GetValue<string>("MindBody:APIKey"));
                request.AddHeader("User-Agent", userAgent);
                request.AddHeader("Authorization", token);
                IRestResponse response = await client.ExecuteAsync(request);
                MindbodyService.LogCall(api, mbInterface.MindbodyStudioId, mbInterface.StudioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        var result = response.Content;
                        if (result != "null")
                        {
                            var directDebitInfo = JsonConvert.DeserializeObject<MbdirectDebitInfo>(result);

                            var mbdirectDebitInfo = await _context.MbdirectDebitInfo
                                .Where(x => x.ClientId == mbclientInfo.Mbid
                                    && x.SiteId == mbInterface.MindbodyStudioId)
                                .FirstOrDefaultAsync();

                            if (mbdirectDebitInfo != null)
                            {
                                mbdirectDebitInfo.NameOnAccount = directDebitInfo.NameOnAccount;
                                mbdirectDebitInfo.RoutingNumber = directDebitInfo.RoutingNumber;
                                mbdirectDebitInfo.AccountNumber = directDebitInfo.AccountNumber;
                                mbdirectDebitInfo.AccountType = directDebitInfo.AccountType;
                                mbdirectDebitInfo.DateModified = DateTime.Now;
                                _context.Update(mbdirectDebitInfo);
                            }
                            else
                            {
                                directDebitInfo.ClientId = clientId;
                                directDebitInfo.MbuniqueId = mbclientInfo.MbuniqueId.Value;
                                directDebitInfo.SiteId = mbInterface.MindbodyStudioId;
                                directDebitInfo.StudioId = mbInterface.StudioId;
                                directDebitInfo.DateCreated = DateTime.Now;
                                await _context.MbdirectDebitInfo.AddAsync(directDebitInfo);
                            }
                            await _context.SaveChangesAsync();

                            //var member = await Context.Member.Where(x => x.Mbid == clientId && x.StudioId == mbInterface.StudioId).FirstOrDefaultAsync();

                            //if (member != null)
                            //{
                            //    //if (member.PaymentType != "DirectDebit")
                            //    //{
                            //        //update member direct debit and member DD last four
                            //        member.DirectDebitLastFour = directDebitInfo.AccountNumber;
                            //        //member.PaymentType = "DirectDebit";
                            //        Context.Update(member);
                            //        await Context.SaveChangesAsync();
                            //    //}
                            //}
                        }
                    }
                    else
                    {
                        Logger.LogError(response.StatusCode + response.ErrorMessage + "SyncPaymentType" + mbclientInfo.Mbid);
                    }
                }
                else
                {
                    Logger.LogError(response.StatusCode + response.ErrorMessage + "SyncPaymentType" + mbclientInfo.Mbid);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message + "======================== SyncPaymentType" + mbclientInfo.Mbid);
            }
        }
        #endregion

        #region Sync classes from Mindbody
        public async Task SyncClassesFromMindBody(Mbinterface mbInterface)
        {
            try
            {
                Logger.LogInformation("<<<<<=========== classes full sync for site: " + mbInterface.MindbodyStudioId + " started ===========>>>>>");
                var startDate = "2017-01-01T00:00:00"; 
                int offset = 0;

                SyncParamViewModel param = new SyncParamViewModel()
                {
                    Offset = offset,
                    SiteId = mbInterface.MindbodyStudioId,
                    StudioId = mbInterface.StudioId,
                    StartDate = startDate
                };

                var result = await MindbodyClassAsync(param);

                if (result != string.Empty)
                {
                    MBClasses = JsonConvert.DeserializeObject<MindbodyClasses>(result);
                    int totalResult = MBClasses.PaginationResponse.TotalResults;

                    for (int count = 0; count <= totalResult;)
                    {
                        if (offset > 0)
                        {
                            SyncParamViewModel iparam = new SyncParamViewModel()
                            {
                                Offset = offset,
                                SiteId = mbInterface.MindbodyStudioId,
                                StudioId = mbInterface.StudioId,
                                StartDate = startDate
                            };

                            result = await MindbodyClassAsync(iparam);
                            MBClasses = JsonConvert.DeserializeObject<MindbodyClasses>(result);
                        }

                        if (result != string.Empty)
                        {                            
                            if (MBClasses.Classes.Count() != 0)
                            {
                                var mbClasses = MBClasses.Classes.ToList();
                                foreach (var mbClass in mbClasses)
                                {
                                    // insert class
                                    Class iclass = new Class()
                                    {
                                        StudioId = mbInterface.StudioId,
                                        MbclassScheduleId = mbClass.ClassScheduleId,
                                        MblocationId = mbClass.Location?.Id,
                                        MbresourceId = mbClass.Resource?.Id,
                                        MbclassDescriptionId = mbClass.ClassDescription?.Id,
                                        MbstaffId = mbClass.Staff?.Id,
                                        MaxCapacity = mbClass.MaxCapacity,
                                        WebCapacity = mbClass.WebCapacity,
                                        TotalBooked = mbClass.TotalBooked,
                                        WebBooked = mbClass.WebBooked,
                                        SemesterId = mbClass.SemesterId,
                                        Active = mbClass.Active,
                                        IsWaitlistAvailable = mbClass.IsWaitlistAvailable,
                                        IsEnrolled = mbClass.IsEnrolled,
                                        HideCancel = mbClass.HideCancel,
                                        Id = mbClass.Id,
                                        IsAvailable = mbClass.IsAvailable,
                                        StartDateTime = mbClass.StartDateTime,
                                        EndDateTime = mbClass.EndDateTime,
                                        LastModifiedDateTime = mbClass.LastModifiedDateTime,
                                        BookingWindowStartDateTime = mbClass.BookingWindow.StartDateTime,
                                        BookingWindowEndDateTime = mbClass.BookingWindow.EndDateTime,
                                        BookingWindowDailyStartTime = mbClass.BookingWindow.DailyStartTime,
                                        BookingWindowDailyEndTime = mbClass.BookingWindow.DailyEndTime,
                                        BookingStatus = mbClass.BookingStatus,
                                        VirtualStreamLink = mbClass.VirtualStreamLink,
                                        DateCreated = DateTime.Now                                        
                                    };

                                    await _context.Class.AddAsync(iclass);                                
                                    await _context.SaveChangesAsync();

                                    var classId = iclass.ScclassId;

                                    #region insert class location
                                    if (mbClass.Location != null)
                                    {
                                        var locationExist = await _context.ClassLocation
                                            .FirstOrDefaultAsync(x => x.StudioId == mbInterface.StudioId &&
                                            x.Id == mbClass.Location.Id &&
                                            x.Address == mbClass.Location.Address &&
                                            x.Address2 == mbClass.Location.Address2 &&
                                            x.City == mbClass.Location.City &&
                                            x.Name == mbClass.Location.Name &&
                                            x.Latitude == mbClass.Location.Latitude &&
                                            x.Longitude == mbClass.Location.Longitude && 
                                            x.SiteId == mbClass.Location.SiteId);

                                        if(locationExist == null)
                                        {
                                            ClassLocation location = new ClassLocation()
                                            {
                                                StudioId = mbInterface.StudioId,
                                                Id = mbClass.Location.Id,
                                                Address = mbClass.Location.Address,
                                                Address2 = mbClass.Location.Address2,
                                                BusinessDescription = mbClass.Location.BusinessDescription,
                                                City = mbClass.Location.City,
                                                Description = mbClass.Location.Description,
                                                HasClasses = mbClass.Location.HasClasses,
                                                Latitude = mbClass.Location.Latitude,
                                                Longitude = mbClass.Location.Longitude,
                                                Name = mbClass.Location.Name,
                                                Phone = mbClass.Location.Phone,
                                                PhoneExtension = mbClass.Location.PhoneExtension,
                                                PostalCode = mbClass.Location.PostalCode,
                                                SiteId = mbClass.Location.SiteId,
                                                StateProvCode = mbClass.Location.StateProvCode,
                                                Tax1 = mbClass.Location.Tax1,
                                                Tax2 = mbClass.Location.Tax2,
                                                Tax3 = mbClass.Location.Tax3,
                                                Tax4 = mbClass.Location.Tax4,
                                                Tax5 = mbClass.Location.Tax5,
                                                TotalNumberOfRatings = mbClass.Location.TotalNumberOfRatings,
                                                AverageRating = mbClass.Location.AverageRating,
                                                TotalNumberOfDeals = mbClass.Location.TotalNumberOfDeals,
                                                DateCreated = DateTime.Now
                                            };

                                            await _context.ClassLocation.AddAsync(location);
                                            await _context.SaveChangesAsync();
                                            var locationId = location.ScclassLocationId;

                                            //insert location amenities
                                            if (mbClass.Location.Amenities != null)
                                            {
                                                foreach (var amenity in mbClass.Location.Amenities)
                                                {
                                                    ClassLocationAmenities amenities = new ClassLocationAmenities()
                                                    {
                                                        ScclassLocationId = locationId,
                                                        Id = amenity.Id,
                                                        Name = amenity.Name,
                                                        DateCreated = DateTime.Now

                                                    };
                                                    await _context.ClassLocationAmenities.AddAsync(amenities);
                                                    await _context.SaveChangesAsync();
                                                }
                                            }

                                            //insert location additional image Urls
                                            if (mbClass.Location.AdditionalImageURLs != null)
                                            {
                                                foreach (var imageUrl in mbClass.Location.AdditionalImageURLs)
                                                {
                                                    ClassLocationImageUrl url = new ClassLocationImageUrl()
                                                    {
                                                        ScclassLocationId = locationId,
                                                        AdditionalImageUrl = imageUrl,
                                                        DateCreated = DateTime.Now
                                                    };
                                                    await _context.ClassLocationImageUrl.AddAsync(url);
                                                    await _context.SaveChangesAsync();
                                                }
                                            }
                                        }
                                    }
                                    #endregion

                                    #region insert class resource
                                    if (mbClass.Resource != null)
                                    {
                                        var resourceExist = await _context.ClassResource
                                            .FirstOrDefaultAsync(x => x.StudioId == mbInterface.StudioId && x.Id == mbClass.Resource.Id);

                                        if(resourceExist == null)
                                        {
                                            ClassResource resource = new ClassResource()
                                            {
                                                StudioId = mbInterface.StudioId,
                                                Id = mbClass.Resource.Id,
                                                Name = mbClass.Resource.Name,
                                                DateCreated = DateTime.Now
                                            };
                                            await _context.ClassResource.AddAsync(resource);
                                            await _context.SaveChangesAsync("AdminService");
                                        }
                                       
                                    }
                                    #endregion

                                    #region insert class description
                                    if (mbClass.ClassDescription != null)
                                    {
                                        var descriptionExist = await _context.ClassDescription
                                           .FirstOrDefaultAsync(x => x.StudioId == mbInterface.StudioId &&
                                           x.Id == mbClass.ClassDescription.Id &&
                                           x.Name == mbClass.ClassDescription.Name);
                                        if (descriptionExist == null)
                                        {
                                            ClassDescription description = new ClassDescription()
                                            {
                                                StudioId = mbInterface.StudioId,
                                                Active = mbClass.ClassDescription.Active,
                                                Description = mbClass.ClassDescription.Description,
                                                Id = mbClass.ClassDescription.Id,
                                                ImageUrl = mbClass.ClassDescription.ImageUrl,
                                                LastUpdated = mbClass.ClassDescription.LastUpdated,
                                                Name = mbClass.ClassDescription.Name,
                                                Notes = mbClass.ClassDescription.Notes,
                                                Prereq = mbClass.ClassDescription.Prereq,
                                                Category = mbClass.ClassDescription.Category,
                                                CategoryId = mbClass.ClassDescription.CategoryId,
                                                Subcategory = mbClass.ClassDescription.Subcategory,
                                                SubcategoryId = mbClass.ClassDescription.SubcategoryId,
                                                DateCreated = DateTime.Now
                                            };
                                            await _context.ClassDescription.AddAsync(description);
                                            await _context.SaveChangesAsync();

                                            var classDescriptionId = description.ScclassDescriptionId;

                                            //insert class description Level
                                            if (mbClass.ClassDescription.Level != null)
                                            {
                                                ClassDescriptionLevel level = new ClassDescriptionLevel()
                                                {
                                                    ScclassDescriptionId = classDescriptionId,
                                                    Id = mbClass.ClassDescription.Level.Id,
                                                    Name = mbClass.ClassDescription.Level.Name,
                                                    DateCreated = DateTime.Now
                                                };
                                                await _context.ClassDescriptionLevel.AddAsync(level);
                                                await _context.SaveChangesAsync("AdminService");
                                            }

                                            //insert class description program
                                            if (mbClass.ClassDescription.Program != null)
                                            {
                                                ClassDescriptionProgram program = new ClassDescriptionProgram()
                                                {
                                                    ScclassDescriptionId = classDescriptionId,
                                                    Id = mbClass.ClassDescription.Program.Id,
                                                    Name = mbClass.ClassDescription.Program.Name,
                                                    ScheduleType = mbClass.ClassDescription.Program.ScheduleType,
                                                    CancelOffset = mbClass.ClassDescription.Program.CancelOffset,
                                                    DateCreated = DateTime.Now
                                                };
                                                await _context.ClassDescriptionProgram.AddAsync(program);
                                                await _context.SaveChangesAsync("AdminService");
                                                var programId = program.ScclassDescriptionProgramId;

                                                //insert class description program content format
                                                if (mbClass.ClassDescription.Program.ContentFormats != null)
                                                {
                                                    foreach (var format in mbClass.ClassDescription.Program.ContentFormats)
                                                    {
                                                        ClassDescriptionProgramContentFormat contentFormats = new ClassDescriptionProgramContentFormat()
                                                        {
                                                            ScclassDescriptionProgramId = programId,
                                                            ContentFormat = format,
                                                            DateCreated = DateTime.Now
                                                        };

                                                        await _context.ClassDescriptionProgramContentFormat.AddAsync(contentFormats);
                                                        await _context.SaveChangesAsync("AdminService");
                                                    }
                                                }
                                            }

                                            //insert class description session type 
                                            if (mbClass.ClassDescription.SessionType != null)
                                            {
                                                ClassDescriptionSessionType session = new ClassDescriptionSessionType()
                                                {
                                                    ScclassDescriptionId = classDescriptionId,
                                                    Type = mbClass.ClassDescription.SessionType.Type,
                                                    DefaultTimeLength = mbClass.ClassDescription.SessionType.DefaultTimeLength,
                                                    Id = mbClass.ClassDescription.SessionType.Id,
                                                    Name = mbClass.ClassDescription.SessionType.Name,
                                                    NumDeducted = mbClass.ClassDescription.SessionType.NumDeducted,
                                                    ProgramId = mbClass.ClassDescription.SessionType.ProgramId,
                                                    DateCreated = DateTime.Now
                                                };
                                                await _context.ClassDescriptionSessionType.AddAsync(session);
                                                await _context.SaveChangesAsync();
                                            }
                                        }
                                    }
                                    #endregion

                                    #region class Staff
                                    if (mbClass.Staff != null)
                                    {
                                        var staffExist = await _context.ClassStaff
                                            .FirstOrDefaultAsync(x => x.ScclassId == classId &&
                                            x.Id == mbClass.Staff.Id);

                                        if (staffExist == null)
                                        {
                                            ClassStaff staff = new ClassStaff()
                                            {
                                                ScclassId = classId,
                                                Id = mbClass.Staff.Id,
                                                Address = mbClass.Staff.Address,
                                                AppointmentInstructor = mbClass.Staff.AppointmentInstructor,
                                                AlwaysAllowDoubleBooking = mbClass.Staff.AlwaysAllowDoubleBooking,
                                                City = mbClass.Staff.City,
                                                Bio = mbClass.Staff.Bio,
                                                Country = mbClass.Staff.Country,
                                                Email = mbClass.Staff.Email,
                                                FirstName = mbClass.Staff.FirstName,
                                                HomePhone = mbClass.Staff.HomePhone,
                                                IndependentContractor = mbClass.Staff.IndependentContractor,
                                                IsMale = mbClass.Staff.IsMale,
                                                LastName = mbClass.Staff.LastName,
                                                MobilePhone = mbClass.Staff.MobilePhone,
                                                Name = mbClass.Staff.Name,
                                                PostalCode = mbClass.Staff.PostalCode,
                                                ClassTeacher = mbClass.Staff.ClassTeacher,
                                                SortOrder = mbClass.Staff.SortOrder,
                                                State = mbClass.Staff.State,
                                                WorkPhone = mbClass.Staff.WorkPhone,
                                                ImageUrl = mbClass.Staff.ImageUrl,
                                                ClassAssistantOne = mbClass.Staff.ClassAssistant,
                                                ClassAssistantTwo = mbClass.Staff.ClassAssistant2,
                                                DateCreated = DateTime.Now
                                            };

                                            await _context.ClassStaff.AddAsync(staff);
                                            await _context.SaveChangesAsync();                                           
                                        }
                                    }

                                    #endregion
                                }
                            }
                        }
                        offset += 200;
                        count = offset;
                    }
                }

                Logger.LogInformation("<<<<<=========== classes full sync for site: " + mbInterface.MindbodyStudioId + " ended ===========>>>>>");
                await SyncClassScheduleFromMindBody(mbInterface);

            }


            catch (Exception ex)
            {
                Logger.LogError(ex.Message + "<<<<<=========== Error in saving Class for site: " + mbInterface.MindbodyStudioId + " ===========>>>>>");
            }
        }
        public async Task<string> MindbodyClassAsync(SyncParamViewModel param)
        {
            var result = string.Empty;
            try
            {
                var api = await _context.MbwebApi.Where(x => x.Title == "GetClasses").FirstOrDefaultAsync();
                var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");               

                var client = (param.Offset != 0)
                   ? new RestClient(api.Url + "?StartDateTime=" + param.StartDate + "&CrossRegionalLookup=false&limit=200&offset=" + param.Offset)
                   : new RestClient(api.Url + "?StartDateTime=" + param.StartDate + "&CrossRegionalLookup=false&limit=200");

                var request = new RestRequest(Method.GET);
                request.AddHeader("SiteId", param.SiteId.ToString());
                request.AddHeader("Api-Key", Configuration.GetValue<string>("MindBody:APIKey"));
                request.AddHeader("User-Agent", userAgent);               
                IRestResponse response = await client.ExecuteAsync(request);
                MindbodyService.LogCall(api, param.SiteId, param.StudioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                        result = response.Content;
                }
                else
                {
                    Logger.LogError(response.StatusCode + response.ErrorMessage + " <<<<<=========== response failed in calling API Class for site: " + param.SiteId + " ===========>>>>>  ");
                }

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message + " <<<<<=========== APIClass Failed for site: " + param.SiteId + "  ===========>>>>>");
            }
            return result;
        }

        #endregion

        #region Sync class schedule from Mindbody
        public async Task SyncClassScheduleFromMindBody(Mbinterface mbInterface)
        {
            Logger.LogInformation("<<<<<=========== class schedule full sync for site: " + mbInterface.MindbodyStudioId + " started ===========>>>>>");
            try
            {
                int offset = 0;
                var startDate = "2017-01-01T00:00:00";
                var endDate = DateTime.Now.ToString("s");
                SyncParamViewModel param = new SyncParamViewModel()
                {
                    Offset = offset,
                    SiteId = mbInterface.MindbodyStudioId,
                    StudioId = mbInterface.StudioId,
                    StartDate = startDate,
                    EndDate = endDate
                };

                var result = await MindbodyClassScheduleAsync(param);

                if (result != string.Empty)
                {
                    MBClassSchedule = JsonConvert.DeserializeObject<MindbodyClassSchedule>(result);
                    int totalResult = MBClassSchedule.PaginationResponse.TotalResults;

                    for (int count = 0; count <= totalResult;)
                    {
                        if (offset > 0)
                        {
                            SyncParamViewModel iparam = new SyncParamViewModel()
                            {
                                Offset = offset,
                                SiteId = mbInterface.MindbodyStudioId,
                                StudioId = mbInterface.StudioId,
                                StartDate = startDate,
                                EndDate = endDate
                            };

                            result = await MindbodyClassScheduleAsync(iparam);
                            MBClassSchedule = JsonConvert.DeserializeObject<MindbodyClassSchedule>(result);
                        }

                        if (result != string.Empty)
                        {                           
                            if (MBClassSchedule.ClassSchedules.Count() != 0)
                            {
                                var schedules = MBClassSchedule.ClassSchedules.ToList();

                                foreach (var mbSchedule in schedules)
                                {
                                    //insert Class schedule
                                    ClassSchedule schedule = new ClassSchedule()
                                    {
                                        StudioId = mbInterface.StudioId,
                                        Id = mbSchedule.Id,
                                        SemesterId = mbSchedule.SemesterId,
                                        IsAvailable = mbSchedule.IsAvailable,
                                        StartDate =  DateTimeUtility.ParseIfNotNullOrWhiteSpace(mbSchedule.StartDate),
                                        EndDate = DateTimeUtility.ParseIfNotNullOrWhiteSpace(mbSchedule.EndDate),
                                        StartTime = DateTimeUtility.ParseIfNotNullOrWhiteSpace(mbSchedule.StartTime),
                                        EndTime = DateTimeUtility.ParseIfNotNullOrWhiteSpace(mbSchedule.EndTime),
                                        DaySunday = mbSchedule.DaySunday,
                                        DayMonday = mbSchedule.DayMonday,
                                        DayTuesday = mbSchedule.DayTuesday,
                                        DayWednesday = mbSchedule.DayWednesday,
                                        DayThursday = mbSchedule.DayThursday,
                                        DayFriday = mbSchedule.DayFriday,
                                        DaySaturday = mbSchedule.DaySaturday,
                                        AllowOpenEnrollment = mbSchedule.AllowOpenEnrollment,
                                        AllowDateForwardEnrollment = mbSchedule.AllowDateForwardEnrollment,
                                        DateCreated = DateTime.Now
                                    };

                                    await _context.ClassSchedule.AddAsync(schedule);


                                    var location = await _context.ClassLocation
                                        .FirstOrDefaultAsync(x => x.StudioId == mbInterface.StudioId
                                        && x.Id == mbSchedule.Location.Id
                                        && x.SiteId == mbSchedule.Location.SiteId);

                                    if(location != null)
                                    {
                                        location.BusinessDescription = mbSchedule.Location.BusinessDescription;
                                        _context.Update(location);
                                    }                                  

                                    await _context.SaveChangesAsync();                                  

                                }
                            }
                        }
                        offset += 200;
                        count = offset;
                    }
                }

                Logger.LogInformation("<<<<<=========== class schedule full sync for site: " + mbInterface.MindbodyStudioId + " ended ===========>>>>>");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message + "<<<<<=========== Error in saving Class schedule for site: " + mbInterface.MindbodyStudioId + " ===========>>>>>");
            }
        }

        public async Task<string> MindbodyClassScheduleAsync(SyncParamViewModel param)
        {
            var result = string.Empty;
            try
            {
                var api = await _context.MbwebApi.Where(x => x.Title == "GetClassSchedule").FirstOrDefaultAsync();
                var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");

                var client = (param.Offset != 0)
                  ? new RestClient(api.Url + "?StartDate=" + param.StartDate + "&EndDate=" + param.EndDate  + "&CrossRegionalLookup=false&limit=200&offset=" + param.Offset)
                  : new RestClient(api.Url + "?StartDate=" + param.StartDate + "&EndDate=" + param.EndDate + "&CrossRegionalLookup=false&limit=200");               

                var request = new RestRequest(Method.GET);
                request.AddHeader("SiteId", param.SiteId.ToString());
                request.AddHeader("Api-Key", Configuration.GetValue<string>("MindBody:APIKey"));
                request.AddHeader("User-Agent", userAgent);
              
                IRestResponse response = await client.ExecuteAsync(request);
                MindbodyService.LogCall(api, param.SiteId, param.StudioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                        result = response.Content;
                }
                else
                {
                    Logger.LogError(response.StatusCode + response.ErrorMessage + " <<<<<=========== response failed in calling API Class schedule for site: " + param.SiteId + " ===========>>>>>  ");
                }

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message + " <<<<<=========== APIClassSchedule Failed for site: " + param.SiteId + "  ===========>>>>>");
            }
            return result;
        }
        #endregion

        #region Sync staff from Mindbody
        public async Task SyncStaffFromMindBody(Mbinterface mbInterface, string token)
        {
            try
            {
                int offset = 0;
                SyncParamViewModel param = new SyncParamViewModel()
                {
                    Offset = offset,
                    SiteId = mbInterface.MindbodyStudioId,
                    StudioId = mbInterface.StudioId,
                    Token = token
                };

                var result = await MindbodyStaffAsync(param);

                if (result != string.Empty)
                {
                    MBStaff = JsonConvert.DeserializeObject<MindbodyStaff>(result);
                    int totalResult = MBStaff.PaginationResponse.TotalResults;

                    for (int count = 0; count <= totalResult;)
                    {
                        SyncParamViewModel iparam = new SyncParamViewModel()
                        {
                            Offset = offset,
                            SiteId = mbInterface.MindbodyStudioId,
                            StudioId = mbInterface.StudioId,
                            Token = token
                        };

                        result = await MindbodyStaffAsync(iparam);

                        if (result != string.Empty)
                        {
                            MBStaff = JsonConvert.DeserializeObject<MindbodyStaff>(result);
                            if (MBStaff.Staff.Count() != 0)
                            {
                                var staffs = MBStaff.Staff.ToList();

                                foreach (var staff in staffs)
                                {

                                    //todo: Store to database table.

                                }
                            }
                        }
                        offset += 200;
                        count = offset;
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message);
            }
        }
        public async Task<string> MindbodyStaffAsync(SyncParamViewModel param)
        {
            var result = string.Empty;
            try
            {
                var api = await _context.MbwebApi.Where(x => x.Title == "GetSiteStaff").FirstOrDefaultAsync();
                var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");
                var client = (param.Offset != 0)
                            ? new RestClient(api.Url + "?offset=" + param.Offset)
                            : new RestClient(api.Url + "?limit=200");

                var request = new RestRequest(Method.GET);
                request.AddHeader("SiteId", param.SiteId.ToString());
                request.AddHeader("Api-Key", Configuration.GetValue<string>("MindBody:APIKey"));
                request.AddHeader("User-Agent", userAgent);
                request.AddHeader("Authorization", param.Token);
                IRestResponse response = await client.ExecuteAsync(request);
                MindbodyService.LogCall(api, param.SiteId, param.StudioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                        result = response.Content;
                }
                else
                {
                    Logger.LogError(response.StatusCode + response.ErrorMessage + " <<<<<=========== APIStaff ===========>>>>>  ");
                }

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message + " <<<<<=========== APIStaff ===========>>>>>");
            }
            return result;
        }
        #endregion

    }
}
