using DataAccess.Contexts;
using DataAccess.Models;
using DataAccess.ViewModels;
using DataService.Services.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DataService.Services
{
    public class SyncMindBody : ISyncMindBody
    {
        private readonly ILogger<SyncMindBody> _logger;
        public readonly StudioCentralContext _context;

        public SyncMindBody(ILogger<SyncMindBody> logger, StudioCentralContext context)
        {
            _context = context;
            _logger = logger;
        }
        public IEnumerable<Mbinterface> MbInterfaces { get; set; }
        public IEnumerable<UnsycnedClientClassBooking> UnsycnedClientClassBookings { get; set; }
        public IEnumerable<UnsycnedClientDetail> UnsycnedClientDetails { get; set; }
        public IEnumerable<UnsycnedClientContract> UnsycnedClientContracts { get; set; }
        public IEnumerable<UnsycnedClientMembership> UnsycnedClientMemberships { get; set; }
        // for future use
        //public IEnumerable<UnsycnedSiteClasses> UnsycnedSiteClasses { get; set; }
        //public IEnumerable<UnsycnedSiteClassDescription> UnsycnedSiteClassDescriptions { get; set; }
        //public IEnumerable<UnsycnedSiteClassSchedule> UnsycnedSiteClassSchedules { get; set; }

        /* webhook */
        public async Task SyncWebhookAsync()
        {
            _logger.LogInformation("===============Webhook Full sync started: " + DateTime.Now + " ===============");
            MbInterfaces = _context.Mbinterface.ToList();
            foreach (var mbInterface in MbInterfaces)
            {
                //await SyncClientClassBooking(mbInterface.MindbodyStudioId);
                await SyncClientDetails(mbInterface.MindbodyStudioId);
                await SyncClientContract(mbInterface.MindbodyStudioId);
                await SyncClientMembership(mbInterface.MindbodyStudioId);
                await SyncClientSale(mbInterface.MindbodyStudioId);
            }
            _logger.LogInformation("===============Webhook Full sync ended: " + DateTime.Now + " ===============");
        }    
        

        #region Client Class Bookings
        public async Task SyncClientClassBooking(int siteId)
        {
            try
            {
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetUnsyncedBookings"; //sp name
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@SiteId", SqlDbType.Int) { Value = siteId };
                    cmd.Parameters.Add(param);
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                        {
                            var bookings = _context.MapToList<UnsycnedClientClassBooking>(result);
                            UnsycnedClientClassBookings = bookings.ToList();
                        }
                        else
                        {
                            UnsycnedClientClassBookings = null;
                        }
                    }
                }
                if(UnsycnedClientClassBookings != null)
                {
                    foreach (var classBooking in UnsycnedClientClassBookings)
                    {
                        var pushedWebhookClientBooking = await _context.PushClientClassBooking
                            .FirstOrDefaultAsync(x => x.PushClientClassBookingId == classBooking.PushClientClassBookingId);

                        switch (classBooking.EventId)
                        {
                            case "classRosterBooking.created":
                                var visitExist = await _context.MbclientVisits
                                .FirstOrDefaultAsync(x => x.SiteId == classBooking.SiteId &&
                                                        x.ClientId == classBooking.ClientId &&
                                                        x.Id == classBooking.ClassRosterBookingId);

                                if (visitExist == null)
                                {
                                    // get class decription name
                                    var iclass = await _context.VwClasses.FirstOrDefaultAsync(x => x.ClassId == classBooking.ClassId && x.SiteId == classBooking.SiteId);

                                    MbclientVisits visit = new MbclientVisits()
                                    {
                                        Id = classBooking.ClassRosterBookingId,
                                        ClassId = classBooking.ClassId,
                                        ClientId = classBooking.ClientId,
                                        ClientUniqueId = classBooking.ClientUniqueId,
                                        SiteId = classBooking.SiteId,
                                        LocationId = classBooking.LocationId,
                                        AppointmentId = 0,
                                        ProductId = classBooking.ItemId,
                                        StaffId = classBooking.StaffId,
                                        StaffName = classBooking.StaffName,
                                        AppointmentGenderPreference = "None",
                                        AppointmentStatus = "None",
                                        StartDateTime = classBooking.ClassStartDateTime,
                                        EndDateTime = classBooking.ClassEndDateTime,
                                        LateCancelled = (classBooking.SignedInStatus == "LateCancelled") ? "true" : "false",
                                        Name = iclass?.ClassName,
                                        ServiceName = classBooking.ItemName,
                                        SignedIn = (classBooking.SignedInStatus == "SignedIn") ? "true" : "false",
                                        MaxCapacity = classBooking.MaxCapacity,
                                        WebCapacity = classBooking.WebCapacity,
                                        TotalBooked = classBooking.TotalBooked,
                                        WebBooked = classBooking.WebBooked,
                                        TotalWaitlisted = classBooking.TotalWaitlisted,
                                        ClientPassId = classBooking.ClientPassId,
                                        ClientPassSessionsTotal = classBooking.ClientPassSessionsTotal,
                                        ClientPassSessionsDeducted = classBooking.ClientPassSessionsDeducted,
                                        ClientPassSessionsRemaining = classBooking.ClientPassSessionsRemaining,
                                        ClientPassActivationDateTime = classBooking.ClientPassActivationDateTime,
                                        ClientPassExpirationDateTime = classBooking.ClientPassExpirationDateTime,
                                        BookingOriginatedFromWaitlist = classBooking.BookingOriginatedFromWaitlist,
                                        ClientsNumberOfVisitsAtSite = classBooking.ClientsNumberOfVisitsAtSite,
                                        ItemSiteId = classBooking.ItemSiteId

                                    };
                                    await _context.MbclientVisits.AddAsync(visit);
                                }
                                pushedWebhookClientBooking.IsSynced = true;
                                _context.Update(pushedWebhookClientBooking);
                                await _context.SaveChangesAsync();
                                break;

                            case "classRosterBookingStatus.updated":
                                var updateVisit = await _context.MbclientVisits
                                    .FirstOrDefaultAsync(x => x.SiteId == classBooking.SiteId &&
                                                            x.ClientId == classBooking.ClientId &&
                                                            x.Id == classBooking.ClassRosterBookingId);

                                if (updateVisit != null)
                                {
                                    // get class decription name
                                    var iclass = await _context.VwClasses.FirstOrDefaultAsync(x => x.ClassId == classBooking.ClassId && x.SiteId == classBooking.SiteId);

                                    updateVisit.ClassId = classBooking.ClassId;
                                    updateVisit.Name = iclass?.ClassName;
                                    updateVisit.LocationId = classBooking.LocationId;
                                    updateVisit.SignedInStatus = classBooking.SignedInStatus;
                                    updateVisit.SignedIn = (classBooking.SignedInStatus == "SignedIn") ? "true" : "false";
                                    updateVisit.LateCancelled = (classBooking.SignedInStatus == "LateCancelled") ? "true" : "false";
                                    updateVisit.StaffId = classBooking.StaffId;
                                    updateVisit.ProductId = classBooking.ItemId;
                                    updateVisit.ServiceName = classBooking.ItemName;
                                    updateVisit.ItemSiteId = classBooking.ItemSiteId;
                                    updateVisit.ClientPassId = classBooking.ClientPassId;
                                    _context.Update(updateVisit);
                                    pushedWebhookClientBooking.IsSynced = true;
                                    _context.Update(pushedWebhookClientBooking);
                                    await _context.SaveChangesAsync();
                                }
                              
                                break;
                            case "classRosterBooking.cancelled":

                                var cancelVisit = await _context.MbclientVisits
                                   .FirstOrDefaultAsync(x => x.SiteId == classBooking.SiteId &&
                                                        x.ClientId == classBooking.ClientId &&
                                                        x.Id == classBooking.ClassRosterBookingId);
                                if (cancelVisit != null)
                                {
                                    _context.MbclientVisits.Remove(cancelVisit);
                                }
                                pushedWebhookClientBooking.IsSynced = true;
                                _context.Update(pushedWebhookClientBooking);
                                await _context.SaveChangesAsync();
                                break;
                            default:
                                break;
                        }

                    }
                }
                
                _logger.LogInformation("=============== Sync Client Class Booking for " + siteId + " done ===============");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + "=============== Sync Client Class Booking for " + siteId + " Error ===============");
            }
        }
        #endregion
        #region Client Details
        public async Task SyncClientDetails(int siteId)
        {
            try
            {
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetUnsyncedClientDetails"; //sp name
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@SiteId", SqlDbType.Int) { Value = siteId };
                    cmd.Parameters.Add(param);
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                        {
                            var details = _context.MapToList<UnsycnedClientDetail>(result);
                            UnsycnedClientDetails = details.ToList();
                        }
                        else
                        {
                            UnsycnedClientDetails = null;
                        }
                    }
                }
                if (UnsycnedClientDetails != null)
                {
                    foreach (var client in UnsycnedClientDetails)
                    {
                        var pushedClients = await _context.PushClientDetail.Where(x => x.PushClientDetailId == client.PushClientDetailId).FirstOrDefaultAsync();

                        var site = await _context.Studio.Where(x => x.SiteId == client.SiteId).FirstOrDefaultAsync();
                        var status = await _context.MemberStatus.FirstOrDefaultAsync(x => x.Status == client.Status);
                        var pushedGender = string.IsNullOrWhiteSpace(client.Gender) ? DataAccess.Enums.Gender.None.ToString() : client.Gender;
                        var gender = await _context.Gender.FirstOrDefaultAsync(x => x.Description == pushedGender);
                        var dob = string.IsNullOrEmpty(client.BirthDateTime) ? (DateTime?)null : DateTime.Parse(client.BirthDateTime);
                        var mobileNo = client.MobilePhone != null ? UpdateMobileFormat(String.Concat(client.MobilePhone.Where(c => !Char.IsWhiteSpace(c)))) : null;

                        if (site != null)
                        {
                            switch (client.EventId)
                            {
                                case "client.created":
                                    var existingMember = await _context.Member.FirstOrDefaultAsync(x => x.StudioId == site.StudioId &&
                                                                                                   x.MbuniqueId == client.ClientUniqueId);
                                    if (existingMember == null)
                                    {
                                        Member member = new Member()
                                        {
                                            StudioId = site.StudioId,
                                            Mbid = client.ClientId,
                                            MbuniqueId = client.ClientUniqueId,
                                            MemberStatusId = status.MemberStatusId,
                                            DisplayName = client.FirstName + " " + client.LastName,
                                            Dob = dob,
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
                                            PhotoUrl = client.PhotoUrl,
                                            MbcreationDate = DateTime.Parse(client.CreationDateTime),
                                            MblastModifiedDateTime = client.LastModifiedDateTime,
                                            SendAccountEmails = client.SendAccountEmails,
                                            SendAccountTexts = client.SendAccountTexts,
                                            SendPromotionalEmails = client.SendPromotionalEmails,
                                            SendPromotionalTexts = client.SendPromotionalTexts,
                                            SendScheduleEmails = client.SendScheduleEmails,
                                            SendScheduleTexts = client.SendScheduleTexts,
                                            CreditCardExpDate = client.CreditCardExpDate,
                                            DirectDebitLastFour = client.DirectDebitLastFour,
                                            CreditCardLastFour = client.CreditCardLastFour,
                                            CreatedById = 1,
                                            DateCreated = DateTime.Now
                                        };
                                        await _context.Member.AddAsync(member);
                                    }

                                    break;

                                case "client.updated":
                                    var updateClient = await _context.Member.FirstOrDefaultAsync(x => x.StudioId == site.StudioId &&
                                                                                                 x.MbuniqueId == client.ClientUniqueId);
                                    if (updateClient != null)
                                    {
                                        if (updateClient.MblastModifiedDateTime != null)
                                        {
                                            if (updateClient.MblastModifiedDateTime < client.LastModifiedDateTime)
                                            {
                                                await UpdateClientInfoAsync(pushedClients, mobileNo, site.StudioId, status.MemberStatusId, dob, gender.GenderId);
                                            }
                                        }
                                        else
                                        {
                                            if (updateClient.MbcreationDate < client.LastModifiedDateTime)
                                            {
                                                await UpdateClientInfoAsync(pushedClients, mobileNo, site.StudioId, status.MemberStatusId, dob, gender.GenderId);
                                            }
                                        }
                                    }
                                    else
                                    {
                                        Member member = new Member()
                                        {
                                            StudioId = site.StudioId,
                                            Mbid = client.ClientId,
                                            MbuniqueId = client.ClientUniqueId,
                                            MemberStatusId = status.MemberStatusId,
                                            DisplayName = client.FirstName + " " + client.LastName,
                                            Dob = dob,
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
                                            PhotoUrl = client.PhotoUrl,
                                            MbcreationDate = DateTime.Parse(client.CreationDateTime),
                                            MblastModifiedDateTime = client.LastModifiedDateTime,
                                            SendAccountEmails = client.SendAccountEmails,
                                            SendAccountTexts = client.SendAccountTexts,
                                            SendPromotionalEmails = client.SendPromotionalEmails,
                                            SendPromotionalTexts = client.SendPromotionalTexts,
                                            SendScheduleEmails = client.SendScheduleEmails,
                                            SendScheduleTexts = client.SendScheduleTexts,
                                            CreditCardExpDate = client.CreditCardExpDate,
                                            DirectDebitLastFour = client.DirectDebitLastFour,
                                            CreditCardLastFour = client.CreditCardLastFour,
                                            CreatedById = 1,
                                            DateCreated = DateTime.Now
                                        };
                                        await _context.Member.AddAsync(member);
                                    }

                                    break;
                                case "client.deactivated":
                                    var deactivateClient = await _context.Member.FirstOrDefaultAsync(x => x.StudioId == site.StudioId &&
                                                                                                     x.MbuniqueId == client.ClientUniqueId);
                                    if (deactivateClient != null)
                                    {
                                        deactivateClient.IsDeactivated = true;
                                        deactivateClient.ModifiedById = 1;
                                        deactivateClient.DateModified = DateTime.Now;
                                        _context.Update(deactivateClient);
                                    }
                                    break;
                                default:
                                    break;
                            }
                            pushedClients.IsSynced = true;
                            _context.Update(pushedClients);
                            await _context.SaveChangesAsync();
                        }
                        else
                        {
                            _logger.LogError("<=====================" + client.SiteId + " not found ==========================>");
                        }
                    }
                }
                _logger.LogInformation("=============== Sync Client Details for " + siteId + " done ===============");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + "=============== Sync Client Details for " + siteId + " Error ===============");
            }
        }
        public async Task UpdateClientInfoAsync(PushClientDetail client, string mobileNo, int studioId, int statusId, DateTime? dob, int genderId)
        {
            var updateClient = await _context.Member.
                                FirstOrDefaultAsync(x => x.StudioId == studioId
                                                && x.MbuniqueId == client.ClientUniqueId);

            updateClient.Mbid = client.ClientId;
            updateClient.MemberStatusId = statusId;
            updateClient.DisplayName = client.FirstName + " " + client.LastName;
            updateClient.FirstName = client.FirstName;
            updateClient.LastName = client.LastName;
            updateClient.MiddleName = client.MiddleName;
            updateClient.Dob = dob;
            updateClient.Email = client.Email;
            updateClient.MobilePhone = mobileNo;
            updateClient.HomePhone = client.HomePhone;
            updateClient.WorkPhone = client.WorkPhone;
            updateClient.AddressLine1 = client.AddressLine1;
            updateClient.AddressLine2 = client.AddressLine2;
            updateClient.City = client.City;
            updateClient.PostalCode = client.PostalCode;
            updateClient.State = client.State;
            updateClient.Country = client.Country;
            updateClient.GenderId = genderId;
            updateClient.PhotoUrl = client.PhotoUrl;
            updateClient.MbcreationDate = DateTime.Parse(client.CreationDateTime);
            updateClient.MblastModifiedDateTime = client.LastModifiedDateTime;
            updateClient.SendAccountEmails = client.SendAccountEmails;
            updateClient.SendAccountTexts = client.SendAccountTexts;
            updateClient.SendPromotionalEmails = client.SendPromotionalEmails;
            updateClient.SendPromotionalTexts = client.SendPromotionalTexts;
            updateClient.SendScheduleEmails = client.SendScheduleEmails;
            updateClient.SendScheduleTexts = client.SendScheduleTexts;
            updateClient.CreditCardExpDate = client.CreditCardExpDate;
            updateClient.DirectDebitLastFour = client.DirectDebitLastFour;
            updateClient.CreditCardLastFour = client.CreditCardLastFour;
            updateClient.ModifiedById = 1;
            updateClient.DateModified = DateTime.Now;
            _context.Update(updateClient);

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
        #endregion
        #region Client Contracts
        public async Task SyncClientContract(int siteId)
        {
            try
            {
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetUnsyncedClientContracts"; //sp name
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@SiteId", SqlDbType.Int) { Value = siteId };
                    cmd.Parameters.Add(param);
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                        {
                            var contracts = _context.MapToList<UnsycnedClientContract>(result);
                            UnsycnedClientContracts = contracts.ToList();
                        }
                        else
                        {
                            UnsycnedClientContracts = null;
                        }
                    }
                }
               
                if(UnsycnedClientContracts != null)
                {
                    foreach (var contract in UnsycnedClientContracts)
                    {
                        var pushedContract = await _context.PushClientContract
                            .FirstOrDefaultAsync(x => x.PushClientContractId == contract.PushClientContractId);

                        switch (contract.EventId)
                        {
                            case "clientContract.created":
                                var contractExist = await _context.Mbcontract
                                  .FirstOrDefaultAsync(x => x.SiteId == contract.SiteId &&
                                                          x.ClientId == contract.ClientId &&
                                                          x.Id == contract.ClientContractId);
                                if (contractExist == null)
                                {
                                    Mbcontract mbcontract = new Mbcontract()
                                    {
                                        MbcontractId = Guid.NewGuid(),
                                        Id = contract.ClientContractId.Value,
                                        SiteId = contract.SiteId,
                                        ClientId = contract.ClientId,
                                        AgreementDate = contract.AgreementDateTime,
                                        ContractSoldByStaffId = contract.ContractSoldByStaffId,
                                        ContractSoldByStaffFirstName = contract.ContractSoldByStaffFirstName,
                                        ContractSoldByStaffLastName = contract.ContractSoldByStaffLastName,
                                        ContractOriginationLocation = contract.ContractOriginationLocation,
                                        ContractId = contract.ContractId,
                                        ContractName = contract.ContractName,
                                        StartDate = contract.ContractStartDateTime,
                                        EndDate = contract.ContractEndDateTime,
                                        IsAutoRenewing = contract.IsAutoRenewing
                                    };
                                    await _context.Mbcontract.AddAsync(mbcontract);
                                    pushedContract.IsSynced = true;
                                    _context.Update(pushedContract);
                                    await _context.SaveChangesAsync();
                                }
                                break;
                            case "clientContract.updated":

                                var updateContract = await _context.Mbcontract
                                    .FirstOrDefaultAsync(x => x.SiteId == contract.SiteId &&
                                                            x.ClientId == contract.ClientId &&
                                                            x.Id == contract.ClientContractId);

                                if (updateContract != null)
                                {
                                    updateContract.AgreementDate = contract.AgreementDateTime;
                                    updateContract.StartDate = contract.ContractStartDateTime;
                                    updateContract.EndDate = contract.ContractEndDateTime;
                                    updateContract.IsAutoRenewing = contract.IsAutoRenewing;
                                    _context.Update(updateContract);
                                    pushedContract.IsSynced = true;
                                    _context.Update(pushedContract);
                                    await _context.SaveChangesAsync();
                                }                              

                                break;
                            case "clientContract.cancelled":

                                var cancelContract = await _context.Mbcontract
                                    .FirstOrDefaultAsync(x => x.SiteId == contract.SiteId &&
                                                            x.ClientId == contract.ClientId &&
                                                            x.Id == contract.ClientContractId);

                                if (cancelContract != null)
                                {
                                    var cancelAutopay = await _context.MbautopayEvents.Where(x => x.MbcontractId == cancelContract.MbcontractId).ToListAsync();
                                    _context.MbautopayEvents.RemoveRange(cancelAutopay);
                                    _context.Mbcontract.Remove(cancelContract);
                                    contract.IsSynced = true;
                                    _context.Update(contract);
                                    pushedContract.IsSynced = true;
                                    _context.Update(pushedContract);
                                    await _context.SaveChangesAsync();
                                }

                                break;
                            default:
                                break;
                        }
                     
                    }
                }
              
                _logger.LogInformation("=============== Sync Client Contract for " + siteId + " done ===============");               
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + "=============== Sync Client Contract for " + siteId + " Error ===============");
            }
        }
        #endregion
        #region Client Membership
        public async Task SyncClientMembership(int siteId)
        {
            try
            {
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetUnsyncedClientMembership"; //sp name
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlParameter param = new SqlParameter("@SiteId", SqlDbType.Int) { Value = siteId };
                    cmd.Parameters.Add(param);
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                        {
                            var memberships = _context.MapToList<UnsycnedClientMembership>(result);
                            UnsycnedClientMemberships = memberships.ToList();
                        }
                        else
                        {
                            UnsycnedClientMemberships = null;
                        }
                    }
                }
                if (UnsycnedClientMemberships != null)
                {
                    foreach (var membership in UnsycnedClientMemberships)
                    {
                        var pushedmembership = await _context.PushClientMembership
                            .FirstOrDefaultAsync(x => x.PushClientMembershipId == membership.PushClientMembershipId);

                        switch (membership.EventId)
                        {
                            case "clientMembershipAssignment.created":
                                MbclientActiveMembership mbMembership = new MbclientActiveMembership()
                                {
                                    ActiveMembershipId = Guid.NewGuid(),
                                    ClientId = membership.ClientId,
                                    MembershipId = membership.MembershipId,
                                    Name = membership.MembershipName
                                };

                                await _context.MbclientActiveMembership.AddAsync(mbMembership);
                                pushedmembership.IsSynced = true;
                                _context.Update(pushedmembership);
                                break;
                            case "clientMembershipAssignment.cancelled":

                                var cancelMembership = await _context.MbclientActiveMembership
                                    .FirstOrDefaultAsync(x => x.SiteId == membership.SiteId &&
                                                            x.ClientId == membership.ClientId &&
                                                            x.MembershipId == membership.MembershipId);
                                if (cancelMembership != null)
                                {
                                    _context.Remove(cancelMembership);
                                    pushedmembership.IsSynced = true;
                                    _context.Update(pushedmembership);
                                }

                                break;
                            default:
                                break;
                        }
                        await _context.SaveChangesAsync();
                    }
                }
                _logger.LogInformation("=============== Sync Client Membership for " + siteId + " done ===============");
               
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + "=============== Sync Client Membership for " + siteId + " Error ===============");            
            }
        }
        #endregion
        #region Client Sales 
        public async Task SyncClientSale(int siteId)
        {
            try
            {
                var sales = await _context.PushClientSale
                    .Include(x => x.PushClientSaleItem)
                    .Include(x => x.PushClientSalePayment)
                    .Where(x => x.IsSynced == false)
                    .ToListAsync();

                foreach (var sale in sales)
                {
                    var evnt = await _context.ClientWebhook.FirstOrDefaultAsync(x => x.ClientWebhookId == sale.ClientWebhookId);

                    if (evnt.EventId == "clientSale.created")
                    {
                        var date = sale.SaleDateTime.Value.ToString("yyyy-MM-dd");
                        var time = sale.SaleDateTime.Value.ToString("HH:mm:ss");
                        var description = sale.PushClientSaleItem.Where(x => x.PushClientSaleId == sale.PushClientSaleId).FirstOrDefault().Name;
                        var amountPaid = sale.PushClientSaleItem.Where(x => x.PushClientSaleId == sale.PushClientSaleId).FirstOrDefault().AmountPaid;
                        var quantity = sale.PushClientSaleItem.Where(x => x.PushClientSaleId == sale.PushClientSaleId).FirstOrDefault().Quantity;
                        var price = amountPaid / quantity;
                        var discount = sale.PushClientSaleItem.Where(x => x.PushClientSaleId == sale.PushClientSaleId).FirstOrDefault().AmountDiscounted;

                        var itemType = sale.PushClientSaleItem.Where(x => x.PushClientSaleId == sale.PushClientSaleId).FirstOrDefault().Type;
                        var itemId = sale.PushClientSaleItem.Where(x => x.PushClientSaleId == sale.PushClientSaleId).FirstOrDefault().ItemId;


                        Purchases purchase = new Purchases()
                        {
                            SiteId = sale.SiteId.Value,
                            Id = sale.SaleId.Value,
                            SaleDate = DateTime.Parse(date),
                            SaleTime = TimeSpan.Parse(time),
                            SaleDateTime = sale.SaleDateTime,
                            ClientId = sale.PurchasingClientId,
                            LocationId = sale.LocationId,
                            Description = description,
                            Price = price,
                            AmountPaid = amountPaid,
                            Discount = discount,
                            Quantity = quantity
                        };

                        await _context.Purchases.AddAsync(purchase);
                        await _context.SaveChangesAsync();


                        if (sale.PushClientSalePayment.Count != 0)
                        {
                            var paymentId = sale.PushClientSalePayment.Where(x => x.PushClientSaleId == sale.PushClientSaleId).FirstOrDefault().PaymentId;
                            var paymentAmount = sale.PushClientSalePayment.Where(x => x.PushClientSaleId == sale.PushClientSaleId).FirstOrDefault().PaymentAmountPaid;
                            var method = sale.PushClientSalePayment.Where(x => x.PushClientSaleId == sale.PushClientSaleId).FirstOrDefault().PaymentMethodId;
                            var type = sale.PushClientSalePayment.Where(x => x.PushClientSaleId == sale.PushClientSaleId).FirstOrDefault().PaymentMethod;
                            var notes = sale.PushClientSalePayment.Where(x => x.PushClientSaleId == sale.PushClientSaleId).FirstOrDefault().PaymentNotes;
                            Payments payment = new Payments()
                            {
                                PurchaseId = purchase.PurchaseId,
                                Id = paymentId,
                                Amount = paymentAmount,
                                Method = method,
                                Type = type,
                                Notes = notes
                            };

                            await _context.Payments.AddAsync(payment);
                        }

                        if (sale.PushClientSaleItem.Count != 0)
                        {
                            var isService = (itemType == "Service");
                            PurchasedItems item = new PurchasedItems()
                            {
                                PurchaseId = purchase.PurchaseId,
                                Id = itemId.Value,
                                IsService = isService
                            };
                            await _context.PurchasedItems.AddAsync(item);
                        }

                        sale.IsSynced = true;
                        _context.Update(sale);

                        await _context.SaveChangesAsync();
                    }
                }

                _logger.LogInformation("=============== Sync Client Sale done ===============");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }
        #endregion


        // for future use
        #region Site Classes
        //public async Task SyncSiteClasses(int siteId, int studioId)
        //{
        //    try
        //    {
        //        using (var cmd = _context.Database.GetDbConnection().CreateCommand())
        //        {
        //            cmd.CommandText = "dbo.uspGetUnsyncedSiteClasses"; //sp name
        //            cmd.CommandType = CommandType.StoredProcedure;
        //            SqlParameter param = new SqlParameter("@SiteId", SqlDbType.Int) { Value = siteId };
        //            cmd.Parameters.Add(param);
        //            _context.Database.OpenConnection();
        //            using (var result = cmd.ExecuteReader())
        //            {
        //                if (result.HasRows)
        //                {
        //                    var classes = _context.MapToList<UnsycnedSiteClasses>(result);
        //                    UnsycnedSiteClasses = classes.ToList();
        //                }
        //                else
        //                {
        //                    UnsycnedSiteClasses = null;
        //                }
        //            }
        //        }
        //        if (UnsycnedSiteClasses != null)
        //        {
        //            foreach (var siteClasses in UnsycnedSiteClasses)
        //            {
        //                var pushedWebhookSiteClasses = await _context.PushSiteClass
        //                    .FirstOrDefaultAsync(x => x.PushSiteClassId == siteClasses.PushSiteClassId);

        //                var classExist = await _context.Class
        //                       .FirstOrDefaultAsync(x => x.Id == siteClasses.ClassId &&
        //                                               x.StudioId == studioId);

        //                if(classExist != null)
        //                {                          

        //                    // update class per site
        //                    classExist.MbclassScheduleId = siteClasses.ClassScheduleId;
        //                    classExist.MblocationId = siteClasses.LocationId;
        //                    classExist.MbclassDescriptionId = siteClasses.ClassDescriptionId;
        //                    classExist.MbstaffId = siteClasses.StaffId;
        //                    classExist.IsCanceled = siteClasses.IsCancelled;
        //                    classExist.Substitute = siteClasses.IsStaffAsubstitute;
        //                    classExist.IsWaitlistAvailable = siteClasses.IsWaitlistAvailable;
        //                    classExist.StartDateTime = siteClasses.StartDateTime;
        //                    classExist.EndDateTime = siteClasses.EndDateTime;
        //                    classExist.LastModifiedDateTime = DateTime.Now;
        //                    _context.Update(classExist);

        //                    var pushedResources = await _context.PushSiteClassResource.Where(x => x.PushSiteClassId == pushedWebhookSiteClasses.PushSiteClassId).ToListAsync();
        //                    // update class resource
        //                    //foreach(var pushedResource in pushedResources)
        //                    //{
        //                    //    var resource = await _context.ClassResource.FirstOrDefaultAsync(x => x.)
        //                    //}

        //                    // update class staff



        //                    pushedWebhookSiteClasses.IsSynced = true;
        //                    _context.Update(pushedWebhookSiteClasses);
        //                    await _context.SaveChangesAsync();
        //                }

        //            }
        //        }

        //        _logger.LogInformation("=============== Sync Site Class for " + siteId + " done ===============");

        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex.Message + "=============== Sync Site Class for " + siteId + " Error ===============");
        //    }
        //}
        #endregion
        #region Site Class Description
        //public async Task SyncSiteClassDescription(int siteId, int studioId)
        //{
        //    try
        //    {
        //        using (var cmd = _context.Database.GetDbConnection().CreateCommand())
        //        {
        //            cmd.CommandText = "dbo.uspGetUnsyncedSiteClassDescription"; //sp name
        //            cmd.CommandType = CommandType.StoredProcedure;
        //            SqlParameter param = new SqlParameter("@SiteId", SqlDbType.Int) { Value = siteId };
        //            cmd.Parameters.Add(param);
        //            _context.Database.OpenConnection();
        //            using (var result = cmd.ExecuteReader())
        //            {
        //                if (result.HasRows)
        //                {
        //                    var descriptions = _context.MapToList<UnsycnedSiteClassDescription>(result);
        //                    UnsycnedSiteClassDescriptions = descriptions.ToList();
        //                }
        //                else
        //                {
        //                    UnsycnedSiteClassDescriptions = null;
        //                }
        //            }
        //        }
        //        if (UnsycnedSiteClassDescriptions != null)
        //        {
        //            foreach (var description in UnsycnedSiteClassDescriptions)
        //            {
        //                var pushedWebhookSiteClassDescription= await _context.PushSiteClassDescription
        //                    .FirstOrDefaultAsync(x => x.PushSiteClassDescriptionId == description.PushSiteClassDescriptionId);

        //                var descriptionExist = await _context.ClassDescription
        //                       .FirstOrDefaultAsync(x => x.Id == description.Id &&
        //                                               x.StudioId == studioId);

        //                if (descriptionExist != null)
        //                {

        //                    // update class description per site
        //                    descriptionExist.Name = description.Name;
        //                    descriptionExist.Description = description.Description;                           
        //                    _context.Update(descriptionExist);

        //                    pushedWebhookSiteClassDescription.IsSynced = true;
        //                    _context.Update(pushedWebhookSiteClassDescription);
        //                    await _context.SaveChangesAsync();
        //                }

        //            }
        //        }

        //        _logger.LogInformation("=============== Sync Site Class Descripition for " + siteId + " done ===============");

        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex.Message + "=============== Sync Site Class Descripition for " + siteId + " Error ===============");
        //    }
        //}
        #endregion
        #region Site Class Schedule
        //public async Task SyncSiteClassSchedule(int siteId, int studioId)
        //{
        //    try
        //    {
        //        using (var cmd = _context.Database.GetDbConnection().CreateCommand())
        //        {
        //            cmd.CommandText = "dbo.uspGetUnsyncedSiteClassSchedule"; //sp name
        //            cmd.CommandType = CommandType.StoredProcedure;
        //            SqlParameter param = new SqlParameter("@SiteId", SqlDbType.Int) { Value = siteId };
        //            cmd.Parameters.Add(param);
        //            _context.Database.OpenConnection();
        //            using (var result = cmd.ExecuteReader())
        //            {
        //                if (result.HasRows)
        //                {
        //                    var schedules = _context.MapToList<UnsycnedSiteClassSchedule>(result);
        //                    UnsycnedSiteClassSchedules = schedules.ToList();
        //                }
        //                else
        //                {
        //                    UnsycnedSiteClassSchedules = null;
        //                }
        //            }
        //        }

        //        if (UnsycnedSiteClassSchedules != null)
        //        {
        //            foreach (var schedule in UnsycnedSiteClassSchedules)
        //            {
        //                var pushedWebhookSiteClasSchedule = await _context.PushSiteClassSchedule
        //                    .FirstOrDefaultAsync(x => x.PushSiteClassScheduleId == schedule.PushSiteClassScheduleId);

        //                var pushedWebhookSiteClasScheduleDOWs = await _context.PushSiteClassScheduleDow
        //                    .Where(x => x.PushSiteClassScheduleId == pushedWebhookSiteClasSchedule.PushSiteClassScheduleId)
        //                    .ToListAsync();

        //                var scheduleExist = await _context.ClassSchedule
        //                    .FirstOrDefaultAsync(x => x.Id == schedule.ClassScheduleId && x.StudioId == studioId);

        //                switch (schedule.EventId)
        //                {
        //                    case "classSchedule.created":

        //                        if (scheduleExist == null)
        //                        {
        //                            // create class schedule per site                            
        //                            scheduleExist.IsAvailable = schedule.IsActive;
        //                            scheduleExist.StartDate = schedule.StartDate;
        //                            scheduleExist.EndDate = schedule.EndDate;
        //                            scheduleExist.StartTime = schedule.StartTime;
        //                            scheduleExist.EndTime = schedule.EndTime;
        //                            scheduleExist.DateCreated = DateTime.Now;
        //                            if (pushedWebhookSiteClasScheduleDOWs != null)
        //                            {
        //                                foreach (var DOW in pushedWebhookSiteClasScheduleDOWs)
        //                                {
        //                                    switch (DOW.Day)
        //                                    {
        //                                        case "Monday":
        //                                            scheduleExist.DayMonday = true;
        //                                            break;
        //                                        case "Tuesday":
        //                                            scheduleExist.DayTuesday = true;
        //                                            break;
        //                                        case "Wednesday":
        //                                            scheduleExist.DayWednesday = true;
        //                                            break;
        //                                        case "Thursday":
        //                                            scheduleExist.DayThursday = true;
        //                                            break;
        //                                        case "Friday":
        //                                            scheduleExist.DayFriday = true;
        //                                            break;
        //                                        case "Saturday":
        //                                            scheduleExist.DaySaturday = true;
        //                                            break;
        //                                        case "Sunday":
        //                                            scheduleExist.DaySunday = true;
        //                                            break;

        //                                    }
        //                                }
        //                            }

        //                            await _context.ClassSchedule.AddAsync(scheduleExist);
        //                            pushedWebhookSiteClasSchedule.IsSynced = true;
        //                            _context.Update(pushedWebhookSiteClasSchedule);
        //                            await _context.SaveChangesAsync("WebhookService");
        //                        }
        //                        break;

        //                    case "classSchedule.updated":
        //                        if (scheduleExist != null)
        //                        {
        //                            // update class schedule per site                            
        //                            scheduleExist.IsAvailable = schedule.IsActive;
        //                            scheduleExist.StartDate = schedule.StartDate;
        //                            scheduleExist.EndDate = schedule.EndDate;
        //                            scheduleExist.StartTime = schedule.StartTime;
        //                            scheduleExist.EndTime = schedule.EndTime;
        //                            scheduleExist.DateCreated = DateTime.Now;
        //                            if (pushedWebhookSiteClasScheduleDOWs != null)
        //                            {
        //                                foreach (var DOW in pushedWebhookSiteClasScheduleDOWs)
        //                                {
        //                                    switch (DOW.Day)
        //                                    {
        //                                        case "Monday":
        //                                            scheduleExist.DayMonday = true;
        //                                            break;
        //                                        case "Tuesday":
        //                                            scheduleExist.DayTuesday = true;
        //                                            break;
        //                                        case "Wednesday":
        //                                            scheduleExist.DayWednesday = true;
        //                                            break;
        //                                        case "Thursday":
        //                                            scheduleExist.DayThursday = true;
        //                                            break;
        //                                        case "Friday":
        //                                            scheduleExist.DayFriday = true;
        //                                            break;
        //                                        case "Saturday":
        //                                            scheduleExist.DaySaturday = true;
        //                                            break;
        //                                        case "Sunday":
        //                                            scheduleExist.DaySunday = true;
        //                                            break;

        //                                    }
        //                                }
        //                            }
        //                            _context.Update(scheduleExist);
        //                            pushedWebhookSiteClasSchedule.IsSynced = true;
        //                            _context.Update(pushedWebhookSiteClasSchedule);
        //                            await _context.SaveChangesAsync();
        //                        }
        //                        break;
        //                    case "classSchedule.cancelled":   

        //                        break;
        //                }                      

        //            }
        //        }

        //        _logger.LogInformation("=============== Sync Site Class Descripition for " + siteId + " done ===============");

        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex.Message + "=============== Sync Site Class Descripition for " + siteId + " Error ===============");
        //    }
        //}


        //public async Task<ClassSchedule> ClassSchedule(UnsycnedSiteClassSchedule mbSchedule, PushSiteClassScheduleDow DOWs)
        //{
        //    var Monday = null

        //    if (DOWs != null)
        //    {
        //        foreach (var DOW in DOWs)
        //        {
        //            switch (DOW.Day)
        //            {
        //                case "Monday":
        //                    scheduleExist.DayMonday = true;
        //                    break;
        //                case "Tuesday":
        //                    scheduleExist.DayTuesday = true;
        //                    break;
        //                case "Wednesday":
        //                    scheduleExist.DayWednesday = true;
        //                    break;
        //                case "Thursday":
        //                    scheduleExist.DayThursday = true;
        //                    break;
        //                case "Friday":
        //                    scheduleExist.DayFriday = true;
        //                    break;
        //                case "Saturday":
        //                    scheduleExist.DaySaturday = true;
        //                    break;
        //                case "Sunday":
        //                    scheduleExist.DaySunday = true;
        //                    break;

        //            }
        //        }
        //    }

        //    ClassSchedule schedule = new ClassSchedule()
        //    {
        //        IsAvailable = mbSchedule.IsActive,
        //        StartDate = mbSchedule.StartDate,
        //        EndDate = mbSchedule.EndDate,
        //        StartTime = mbSchedule.StartTime,
        //        EndTime = mbSchedule.EndTime,
        //        DateCreated = DateTime.Now,


        //    };



        //    scheduleExist.DateCreated = DateTime.Now;

        //    return schedule;
        //}
        #endregion
        #region Site Location
        #endregion
        #region Site Staff
        #endregion

        public async Task SyncClientVisitClassDescription(int siteId, int studioId)
        {
            try
            {
                var visits = await _context.MbclientVisits
                    .Where(x => x.SiteId == siteId && string.IsNullOrEmpty(x.Name))
                    .ToListAsync();

                if (visits != null)
                {
                    foreach (var visit in visits)
                    {
                        var iclass = await _context.Class.FirstOrDefaultAsync(x => x.Id == visit.ClassId && x.StudioId == studioId);
                    }
                }

                _logger.LogInformation("=============== Sync Client Visits with null class description for " + siteId + " done ===============");
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message + "=============== Sync Client Visits with null class description for " + siteId + " Error ===============");
            }
        }
    }
}
