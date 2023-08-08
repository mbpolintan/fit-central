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
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;


namespace Internal.Website.Pages.Billing
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllUsers)]
    public class ScanBillingModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ScanBillingModel> _logger;
        private readonly IMindBodyService _mindBodyService;
        private readonly IMindBodyFullSync _mindBodyFullSync;
        private readonly IStudioService _studioService;

        public ScanBillingModel(StudioCentralContext context,
                                IMemoryCache cache,
                                ILogger<ScanBillingModel> logger,
                                IMindBodyService mindBodyService,
                                IStudioService studioService,
                                IMindBodyFullSync mindBodyFullSync)
        {
            _logger = logger;
            _context = context;
            _cache = cache;
            _mindBodyService = mindBodyService;
            _studioService = studioService;
            _mindBodyFullSync = mindBodyFullSync;
        }

        [BindProperty]
        public IEnumerable<VwChallegeScans> ChallengeScans { get; set; }
        [BindProperty]
        public IEnumerable<VwIndividualScans> IndividualScans { get; set; }
        [BindProperty]
        public IEnumerable<PaymentReconciliationViewModel> PaymentsReconciliation { get; set; }
        [BindProperty]
        public IEnumerable<PaymentTransactionLogViewModel> PaymentTransactionLogs { get; set; }
        [BindProperty]
        public IEnumerable<Product> Products { get; set; }
        [BindProperty]      
        public IEnumerable<ScanForBillingViewModel> ScanForBilling { get; set; }
        [BindProperty]
        public IEnumerable<ScansBillableViewModel> Scans { get; set; }
        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }        

        [BindProperty]
        public Studio SelectedStudio { get; set; }

        public void OnGet()
        {
            try
            {
                var groupId = UserUtility.GetGroupId(User);
                User.GetGroupId();
                var userId = UserUtility.GetUserId(User);

                Studios = _studioService.GetStudios(groupId, userId);
                ViewData["Studios"] = _studioService.GetStudios(groupId, userId);
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
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

        }       

        public JsonResult OnPostReadScanBilling(int studioId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                studioId = _studioService.GetStudioId(studioId, User.Identity.Name);
                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetScanForBilling"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    List<SqlParameter> param = new List<SqlParameter>()
                    {                            
                        new SqlParameter("@StudioId", SqlDbType.Int) {Value = studioId}
                    };

                    cmd.Parameters.AddRange(param.ToArray());
                    _context.Database.OpenConnection();

                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                            ScanForBilling = _context.MapToList<ScanForBillingViewModel>(result);

                    }

                }   
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(ScanForBilling.ToDataSourceResult(request));
        }       

        public  JsonResult OnPostReadScans(int memberId, string scanType, int studioId, int challengeNo, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<ScansBillableViewModel> billableScans = new List<ScansBillableViewModel>();
                switch (scanType)
                {
                    case "Individual":
                       var indiScans =  _context.VwIndividualScansBillable
                            .Where(x => x.MemberId == memberId 
                                    && x.StudioId == studioId)
                            .ToList();
                       
                        foreach(var scan in indiScans)
                        {
                            ScansBillableViewModel billableScan = new ScansBillableViewModel()
                            {
                                ScanId = scan.ScanId,
                                MemberId = scan.MemberId,
                                StudioId = scan.StudioId,
                                TestDateTime = scan.TestDateTime
                            };
                            billableScans.Add(billableScan);
                        }

                        break;

                    case "Challenge":
                        var chaScans =  _context.VwChallegeScansBillable
                            .Where(x => x.MemberId == memberId 
                                    && x.StudioId == studioId 
                                    && x.ChallengeNo == challengeNo)
                            .ToList();

                        foreach (var scan in chaScans)
                        {
                            ScansBillableViewModel billableScan = new ScansBillableViewModel()
                            {
                                ScanId = scan.ScanId,
                                MemberId = scan.MemberId,
                                StudioId = scan.StudioId,
                                TestDateTime = scan.TestDateTime
                            };
                            billableScans.Add(billableScan);
                        }
                        break;
                    default:
                        break;
                }

                Scans = billableScans;

            }
            catch (Exception ex)
            {

                _logger.LogError(ex.Message);
            }

            return new JsonResult(Scans.ToDataSourceResult(request));
        }
        public async Task<JsonResult> OnPostCardBillingAsync(int memberId, string scanType, int studioId, string mbProductId, int productId,
                                                            string amount, int quantity, int siteId, int challengeNo, int challengeMemberId)
        {
            var success = false;
            var memberName = string.Empty;
            var statusDescription = string.Empty;
            PaymentTransactionLog transactionLog = new PaymentTransactionLog();
            PaymentMethod memberPaymentMethod = new PaymentMethod();
            try
            {                
                // get token 
                var token = await _mindBodyFullSync.GetuserTokenAsync(siteId, studioId); 
                var member = await _context.Member.FirstOrDefaultAsync(x => x.MemberId == memberId && x.StudioId == studioId);
                memberName = member.DisplayName;

                //get member payment method
                memberPaymentMethod = await _context.PaymentMethod.Where(x => x.MemberId == memberId && x.IsDefault == true).FirstOrDefaultAsync(); 
                
                if(memberPaymentMethod != null)
                {
                    var paidBy = (memberPaymentMethod.PaymentMethodTypeId == (int)DataAccess.Enums.PaymentMethodType.PaidByOtherMember) 
                        ? await _context.Member.FirstOrDefaultAsync(x => x.MemberId == memberPaymentMethod.PaidByOtherMemberId && x.StudioId == studioId) 
                        : member;

                    //get the actual paymentMethod to use                    

                    var PaymentType = (paidBy.MemberId != memberId) 
                        ? await _context.PaymentMethod.Where(x => x.MemberId == paidBy.MemberId).FirstOrDefaultAsync()
                        : memberPaymentMethod;

                    if (PaymentType != null)
                    {
                        BillingParamViewModel param = new BillingParamViewModel()
                        {
                            PaidBy = paidBy,
                            Token = token,
                            SiteId = siteId,
                            MBProductId = mbProductId,
                            Username = User.Identity.Name,
                            PaymentMethodTypeId = PaymentType.PaymentMethodTypeId.Value,
                            Quantity = quantity,
                            Amount = decimal.Parse(amount)
                        };

                        //transact payments in mindbody
                        var mbTransaction = _mindBodyService.CheckoutShoppingCart(param);

                        //Call transaction once more if fails
                        var apiCallCounter = 0;
                        if (!mbTransaction.TransactionStatus)
                        {
                            apiCallCounter += 1;
                            if (apiCallCounter == 1)                            
                                mbTransaction = _mindBodyService.CheckoutShoppingCart(param);                            
                        }

                        if (mbTransaction.TransactionStatus)
                        {
                            // create payment transaction items
                            PaymentTransactionViewModel paymentTransaction = new PaymentTransactionViewModel()
                            {
                                PaymentMethodTypeId = PaymentType.PaymentMethodTypeId.Value,
                                PaymentMethodId = memberPaymentMethod.PaymentMethodId,
                                MemberId = memberId,
                                ProductId = productId,
                                StudioId = studioId,
                                Quantity = quantity,
                                Amount = decimal.Parse(amount),
                                ChallengeMemberId = challengeMemberId
                            };

                            await OnPostBillScan(paymentTransaction);
                            //update billed scan status
                            await OnPostUpdateScanStatusOnly(memberId, scanType, studioId, (byte)ScanBillStatus.Billed);
                            success = true;
                        }
                        else
                        {
                            statusDescription = "Transaction failed in Mindbody " + mbTransaction.TransactionMessage;
                        }
                    }
                    else
                    {
                        statusDescription = "Cannot find paid by:" + memberName + " Payment Method.";
                    }                   
                }
                else
                {
                    statusDescription = "Cannot find " + memberName + " Payment Method.";
                }


                transactionLog.PaymentGatewayId = 1; // default to Mindbody as of now Todo:[] change this when new payment gateway implemented
                transactionLog.TransactionDate = DateTime.Now;
                transactionLog.ProcessedById = UserUtility.GetUserId(User);
                transactionLog.MemberId = memberId;
                transactionLog.PaymentMethodId = memberPaymentMethod != null ? memberPaymentMethod.PaymentMethodId : 0;
                transactionLog.Amount = decimal.Parse(amount);
                transactionLog.Status = success;
                transactionLog.StatusDescription = (!success) ? statusDescription : null;
                transactionLog.Reconciled = false;
                transactionLog.DateCreated = DateTime.Now;
                transactionLog.StudioId = studioId;


                  // save transaction log
                  await OnPostPaymentTransactionLog(transactionLog);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(new { success , memberName, statusDescription });

        }
        public async Task<JsonResult> OnPostCashBilling(int memberId, string scanType, int studioId, int productId, string amount, int quantity, int challengeMemberId)
        {
            var success = false;
            var memberName = string.Empty;
            var statusDescription = string.Empty;
            PaymentTransactionLog transactionLog = new PaymentTransactionLog();
            PaymentMethod memberPaymentMethod = new PaymentMethod();
            
            try
            {
                memberPaymentMethod = await _context.PaymentMethod.Where(x => x.MemberId == memberId).FirstOrDefaultAsync();
                var member = await _context.Member.FirstOrDefaultAsync(x => x.MemberId == memberId && x.StudioId == studioId);
                memberName = member.DisplayName;
                // create payment transaction items
                PaymentTransactionViewModel paymentTransaction = new PaymentTransactionViewModel()
                {
                    PaymentMethodTypeId = (int)DataAccess.Enums.PaymentMethodType.Cash,
                    PaymentMethodId = memberPaymentMethod.PaymentMethodId,
                    MemberId = memberId,
                    ProductId = productId,
                    StudioId = studioId,
                    Quantity = quantity,
                    Amount = decimal.Parse(amount),
                    ChallengeMemberId = challengeMemberId
                };

                await OnPostBillScan(paymentTransaction);  
                await OnPostUpdateScanStatusOnly(memberId, scanType, studioId, (byte)ScanBillStatus.Billed);
                success = true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                statusDescription = ex.Message;
            }

            transactionLog.PaymentGatewayId = 1; // default to Mindbody as of now Todo:[] change this when new payment gateway implemented
            transactionLog.TransactionDate = DateTime.Now;
            transactionLog.ProcessedById = UserUtility.GetUserId(User);
            transactionLog.MemberId = memberId;
            transactionLog.PaymentMethodId = memberPaymentMethod != null ? memberPaymentMethod.PaymentMethodId : 0;
            transactionLog.Amount = decimal.Parse(amount);
            transactionLog.Status = success;
            transactionLog.StatusDescription = (!success) ? statusDescription : null;
            transactionLog.Reconciled = false;
            transactionLog.DateCreated = DateTime.Now;
            transactionLog.StudioId = studioId;
            // save transaction log
            await OnPostPaymentTransactionLog(transactionLog);

            return new JsonResult(new { success, memberName, statusDescription });

        }
        public async Task<JsonResult> OnPostIgnoreBilling(int memberId, string scanType, int studioId)
        {
            var success = false;
            try
            {                
                await OnPostUpdateScanStatusOnly(memberId, scanType, studioId, (byte)ScanBillStatus.Ignore);
                success = true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
                       
            return new JsonResult(new { success });

        }
        public async Task<JsonResult> OnPostAlreadyPaid(int memberId, string scanType, int studioId, int productId, string amount, int quantity, int challengeMemberId)
        {

            var success = false;
            var memberName = string.Empty;
            var statusDescription = string.Empty;
            PaymentTransactionLog transactionLog = new PaymentTransactionLog();
            PaymentMethod memberPaymentMethod = new PaymentMethod();
            try
            {
                memberPaymentMethod = await _context.PaymentMethod.Where(x => x.MemberId == memberId).FirstOrDefaultAsync();
                var member = await _context.Member.FirstOrDefaultAsync(x => x.MemberId == memberId && x.StudioId == studioId);
                memberName = member.DisplayName;

                if (memberPaymentMethod.PaymentMethodTypeId.HasValue)
                {
                    // create payment transaction items
                    PaymentTransactionViewModel paymentTransaction = new PaymentTransactionViewModel()
                    {
                        PaymentMethodTypeId = memberPaymentMethod.PaymentMethodTypeId.Value,
                        PaymentMethodId = memberPaymentMethod.PaymentMethodId,
                        MemberId = memberId,
                        ProductId = productId,
                        StudioId = studioId,
                        Quantity = quantity,
                        Amount = decimal.Parse(amount),
                        ChallengeMemberId = challengeMemberId
                    };
                    await OnPostBillScan(paymentTransaction);
                    await OnPostUpdateScanStatusOnly(memberId, scanType, studioId, (byte)ScanBillStatus.Billed);
                    success = true;
                    statusDescription = "Transaction Completed";
                }
                else
                {
                    statusDescription = "Client has no assigned default Payment Method";
                }           
               
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            transactionLog.PaymentGatewayId = 1; // default to Mindbody as of now Todo:[] change this when new payment gateway implemented
            transactionLog.TransactionDate = DateTime.Now;
            transactionLog.ProcessedById = UserUtility.GetUserId(User);
            transactionLog.MemberId = memberId;
            transactionLog.PaymentMethodId = memberPaymentMethod != null ? memberPaymentMethod.PaymentMethodId : 0;
            transactionLog.Amount = decimal.Parse(amount);
            transactionLog.Status = success;
            transactionLog.StatusDescription = (!success) ? statusDescription : null;
            transactionLog.Reconciled = false;
            transactionLog.DateCreated = DateTime.Now;
            transactionLog.StudioId = studioId;
            // save transaction log
            await OnPostPaymentTransactionLog(transactionLog);

            return new JsonResult(new { success, memberName, statusDescription });
        }  

        public async Task OnPostBillScan(PaymentTransactionViewModel paymentTransaction)
        {
            try
            {
                PaymentTransaction trans = new PaymentTransaction()
                {
                    PaymentMethodTypeId = paymentTransaction.PaymentMethodTypeId,
                    PaymentMethodId = paymentTransaction.PaymentMethodId,
                    MemberId = paymentTransaction.MemberId,
                    ProductId = paymentTransaction.ProductId,
                    StudioId = paymentTransaction.StudioId,
                    Quantity = paymentTransaction.Quantity,
                    Amount = paymentTransaction.Amount,
                    DateCreated = DateTime.Now
                };
                await _context.PaymentTransaction.AddAsync(trans);

                //update challenge member payment transaction Id
                if(paymentTransaction.ChallengeMemberId != 0)
                {
                    var challengeMember = await _context.ChallengeMember.FirstOrDefaultAsync(x => x.ChallengeMemberId == paymentTransaction.ChallengeMemberId);
                    challengeMember.PaymentTransactionId = trans.PaymentTransactionId;
                    challengeMember.ModifiedById = UserUtility.GetUserId(User);
                    challengeMember.DateModified = DateTime.Now;
                    _context.Update(challengeMember);
                }

                await _context.SaveChangesAsync(User.Identity.Name);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

        }
        public async Task OnPostUpdateScanStatusOnly(int memberId, string scanType, int studioId, byte billingStatus)
        {           
            try
            {
                switch (scanType)
                {
                    case "Individual":
                        var individualScans = await _context.VwIndividualScansBillable.Where(x => x.MemberId == memberId && x.StudioId == studioId).ToListAsync();
                        if (IndividualScans != null)
                        {
                            foreach (var individualScan in individualScans)
                            {
                                await OnPostUpdateScanBillingStatus(individualScan.ScanId, billingStatus);
                                
                            }
                        }
                        break;

                    case "Challenge":
                        var challengeScans = await _context.VwChallegeScansBillable.Where(x => x.MemberId == memberId && x.StudioId == studioId).ToListAsync();
                        if (challengeScans != null)
                        {
                            foreach (var challengeScan in challengeScans)
                            {
                                await OnPostUpdateScanBillingStatus(challengeScan.ScanId, billingStatus);
                            }
                        }
                        break;
                    default:
                        break;
                }               
            }
            catch (Exception ex)
            {
                
                _logger.LogError(ex.Message);
            }           
        }
        public async Task OnPostUpdateScanBillingStatus(int scanId, byte billStatus)
        {
            
            try
            {
                var scan = await _context.Scan.FirstOrDefaultAsync(x => x.ScanId == scanId);
                scan.BillStatus = billStatus;
                _context.Update(scan);
                await _context.SaveChangesAsync(User.Identity.Name);
                                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
           
        }
        public async Task OnPostUpdateChallengeMemberTransaction(int challengeMemberId, int paymentTransactionId)
        {
            try
            {
               var challengeMember =  await _context.ChallengeMember.FirstOrDefaultAsync(x => x.ChallengeMemberId == challengeMemberId);

                if(challengeMember != null)
                {
                    challengeMember.PaymentTransactionId = paymentTransactionId;
                    _context.Update(challengeMember);
                    await _context.SaveChangesAsync(User.Identity.Name);
                }
                else
                {
                    _logger.LogError("Cannot find " + challengeMemberId + " in Challenge Member table.");
                }               

            }catch(Exception ex)
            {
                _logger.LogError(ex.Message + "==========> Update Challenge Member Transaction");
            }
        }

        public async Task OnPostPaymentTransactionLog(PaymentTransactionLog transactionLog)
        {
            try
            {
                await _context.PaymentTransactionLog.AddAsync(transactionLog);
                await _context.SaveChangesAsync(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + "==========> Insert Tansaction Log");
            }
        }
                
        public async Task<JsonResult> OnPostReadPaymentTransactionLogAsync(int studioId, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                studioId = _studioService.GetStudioId(studioId, User.Identity.Name);

                PaymentTransactionLogs = await _context.PaymentTransactionLog
                    .Include(x => x.PaymentGateway)
                    .Include(x => x.ProcessedBy)
                    .Include(x => x.Member)
                    .Include(x => x.PaymentMethod)
                    //.Include(x => x.PaymentMethod.PaymentMethodType)
                    .Where(x => x.StudioId == studioId)
                    .Select(x => new PaymentTransactionLogViewModel {
                        PaymentTransactionLogId = x.PaymentTransactionLogId,
                        StudioId = x.StudioId,
                        PaymentGatewayId = x.PaymentGatewayId,
                        Gateway = x.PaymentGateway.Gateway,
                        TransactionDate = x.TransactionDate,
                        ProcessedById = x.ProcessedById,
                        ProcessedByDisplayName = x.ProcessedBy.UserEmail,
                        MemberId = x.MemberId,
                        DisplayName = x.Member.DisplayName,
                        PaymentMethodId = x.PaymentMethodId,
                        PaymentMethodType = x. PaymentMethod.PaymentMethodType.Description,
                        Amount = x.Amount,
                        Status = x.Status,
                        StatusDescription = x.StatusDescription,
                        Reconciled = x.Reconciled,
                        ReconciledComments = x.ReconciledComments,
                        DateCreated = x.DateCreated,
                        TimeStamp = x.TimeStamp
                     })

                    .ToListAsync();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(PaymentTransactionLogs.ToDataSourceResult(request));
        }      
        public async Task<JsonResult> OnPostUpdatePaymentTransactionLogAsync([DataSourceRequest] DataSourceRequest request, PaymentTransactionLogViewModel transactionLogs)
        {
            try
            {
                var transLog = await _context.PaymentTransactionLog.FirstOrDefaultAsync(x => x.PaymentTransactionLogId == transactionLogs.PaymentTransactionLogId);
                transLog.Reconciled = transactionLogs.Reconciled;
                transLog.ReconciledComments = transactionLogs.ReconciledComments;
                _context.Update(transLog);
                await _context.SaveChangesAsync(User.Identity.Name);
            }catch(Exception ex)
            {
                _logger.LogError(ex.Message);
            }      
            return new JsonResult(new[] { transactionLogs }.ToDataSourceResult(request, ModelState));
        }
    }


}
