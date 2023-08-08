using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.Contexts;
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

namespace Internal.Website.Pages.Billing
{
    [BindProperties]
    [Authorize(Policy = GroupPolicy.AllUsers)]
    public class ReconciliationModel : PageModel
    {
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<ScanBillingModel> _logger;
        private readonly IStudioService _studioService;

        public ReconciliationModel(StudioCentralContext context,
                                IMemoryCache cache, IStudioService studioService,
                                ILogger<ScanBillingModel> logger)
        {
            _logger = logger;
            _context = context;
            _cache = cache;
            _studioService = studioService;
        }

        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }
        [BindProperty]
        public IEnumerable<PaymentTransactionLogViewModel> PaymentTransactionLogs { get; set; }
        [BindProperty]
        public IEnumerable<PaymentReconciliationViewModel> PaymentsReconciliation { get; set; }
        [BindProperty]
        public Studio SelectedStudio { get; set; }

        public void OnGet()
        {
            try
            {
                var groupId = UserUtility.GetGroupId(User);
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

        public async Task<JsonResult> OnPostReadPaymentReconciliationAsync(int studioId, string dateFrom, string dateTo, Boolean isReconciled, [DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                studioId = await _studioService.GetStudioIdAsync(studioId, User.Identity.Name);

                using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.CommandText = "dbo.uspGetPaymentReconciliation"; //sp name
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    List<SqlParameter> param = new List<SqlParameter>()
                    {
                        new SqlParameter("@StudioId", SqlDbType.Int) {Value = studioId},
                        new SqlParameter("@DateFrom", SqlDbType.DateTime) {Value = DateTime.Parse(dateFrom)},
                        new SqlParameter("@DateTo", SqlDbType.DateTime) {Value = DateTime.Parse(dateTo)},
                        new SqlParameter("@IsReconciled", SqlDbType.Bit) {Value = isReconciled}
                    };

                    cmd.Parameters.AddRange(param.ToArray());
                    _context.Database.OpenConnection();
                    using (var result = cmd.ExecuteReader())
                    {
                        if (result.HasRows)
                            PaymentsReconciliation = _context.MapToList<PaymentReconciliationViewModel>(result);
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(PaymentsReconciliation.ToDataSourceResult(request));
        }
        public JsonResult OnPostUpdatePaymentReconciliation(string paymentIds, int recon)
        {
            var reconcileStat = recon > 0 ? true : false;
            try
            {
                string[] ids = paymentIds.Split(',');

                var payments = _context.Payments.Where(x => ids.Contains(x.PaymentId.ToString())).ToList();
                foreach (var payment in payments)
                {
                    payment.Reconciled = recon > 0 ? false : true;
                    payment.ReconciledDatetime = DateTime.Now;
                    payment.ReconciledById = UserUtility.GetUserId(User);
                    _context.Update(payment);
                }
                _context.SaveChanges(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return new JsonResult(reconcileStat);
        }
    }
}
