using DataAccess.Contexts;
using DataAccess.Enums;
using DataAccess.Models;
using DataAccess.ViewModels;
using DataService.ServiceModels;
using DataService.Services.Interfaces;
using DataService.ViewModels;
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
using System.Threading;
using System.Threading.Tasks;

namespace DataService.Services
{
    public class MindBodyService : IMindBodyService
    {
        private readonly ILogger<MindBodyService> _logger;
        private readonly StudioCentralContext _context;
        private IConfiguration Configuration { get; }


        public MindBodyService(ILogger<MindBodyService> logger,
                              StudioCentralContext context,
                              IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            Configuration = configuration;
        }

        public MindbodyActivationCodeLink ActivationCodeLink { get; set; }
        public string API { get; set; }
        public MbclientVisits ClientVisits { get; set; }
        public Mbapilog MBApiLog { get; set; }
        public MindBodyClientVisits MBClientVisits { get; set; }
        public MindbodyClasses MBClasses { get; set; }
        public MindbodyClassSchedule MBClassSchedule { get; set; }
        public MindBodyProducts MBProducts { get; set; }
        public Product Product { get; set; }
        public MindBodyStaffMembers Staffs { get; set; }
        public List<Member> Members { get; set; }
        public List<MbclientVisits> VisitsToValidate { get; set; }
        public IEnumerable<Mbinterface> MbInterfaces { get; set; }

        public string GetUserToken(int siteId, int studioId)
        {
            AccessTokenViewModel accessToken = new AccessTokenViewModel();

            var api = _context.MbwebApi.Where(x => x.Title == "GetUserAccessToken").FirstOrDefault();

            API = Configuration.GetValue<string>("MindBody:APIKey");
            var username = Configuration.GetValue<string>("MindBody:UserName");
            var password = Configuration.GetValue<string>("MindBody:Password");
            var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");

            var client = new RestClient(api.Url);
            var request = new RestRequest(Method.POST);
            request.AddHeader("SiteId", siteId.ToString());
            request.AddHeader("Api-Key", API);
            request.AddHeader("User-Agent", userAgent);
            request.AddHeader("Content-Type", "application/json");
            request.AddParameter("application/json",
                                "{\r\n\t\"Username\": \"" + username +
                                "\",\r\n\t\"Password\": \"" + password + "\"\r\n}",
                                ParameterType.RequestBody);

            IRestResponse response = client.Execute(request);
            LogCall(api, siteId, studioId);

            if (response.IsSuccessful)
            {
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var UserAccessToken = response.Content;
                    accessToken = JsonConvert.DeserializeObject<AccessTokenViewModel>(UserAccessToken);

                    return accessToken.AccessToken;
                }
            }
            return accessToken.AccessToken;
        }
        public void LogCall(MbwebApi api, int siteId, int studioId)
        {
            MBApiLog = _context.Mbapilog
                .Where(x => x.MbwebApiid == api.MbwebApiid
                && x.StudioId == studioId
                && x.MbsiteId == siteId
                && x.DateSynced == DateTime.Today)
                .FirstOrDefault();

            if (MBApiLog != null)
            {
                MBApiLog.TotalCalls += 1;
                _context.Update(MBApiLog);

            }
            else
            {
                Mbapilog newLog = new Mbapilog()
                {
                    StudioId = studioId,
                    MbsiteId = siteId,
                    MbwebApiid = api.MbwebApiid,
                    TotalCalls = 1,
                    DateSynced = DateTime.Today
                };
                _context.Mbapilog.Add(newLog);
            }
            _context.SaveChanges();
        }

        #region Site Services       
        public MindbodyActivationCodeLink GetActivationCode(int siteId)
        {

            Mbinterface mbInterface = _context.Mbinterface.Where(x => x.MindbodyStudioId == siteId).FirstOrDefault();

            var token = GetUserToken(siteId, mbInterface.StudioId);
            var api = _context.MbwebApi.Where(x => x.Title == "GetActivationCode").FirstOrDefault();
            var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");
            var client = new RestClient(api.Url);

            var request = new RestRequest(Method.GET);
            request.AddHeader("SiteId", siteId.ToString());
            request.AddHeader("Api-Key", API);
            request.AddHeader("User-Agent", userAgent);
            request.AddHeader("Authorization", token);
            IRestResponse response = client.Execute(request);
            LogCall(api, siteId, mbInterface.StudioId);

            if (response.IsSuccessful)
            {
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var result = response.Content;
                    ActivationCodeLink = JsonConvert.DeserializeObject<MindbodyActivationCodeLink>(result);
                }
                else
                {
                    _logger.LogError(response.StatusCode + response.ErrorMessage);
                }
            }
            else
            {
                _logger.LogError(response.StatusCode + response.ErrorMessage);
            }
            return ActivationCodeLink;
        }
        #endregion

        #region Billing Services
        public void GetProducts(Mbinterface mbInterface, string username)
        {
            var result = string.Empty;
            API = Configuration.GetValue<string>("MindBody:APIKey");
            var api = _context.MbwebApi.Where(x => x.Title == "GetProducts").FirstOrDefault();
            var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");
            var client = new RestClient(api.Url);
            var token = GetUserToken(mbInterface.MindbodyStudioId, mbInterface.StudioId);
            var request = new RestRequest(Method.GET);
            request.AddHeader("SiteId", mbInterface.MindbodyStudioId.ToString());
            request.AddHeader("Api-Key", API);
            request.AddHeader("User-Agent", userAgent);
            request.AddHeader("Authorization", token);
            IRestResponse response = client.Execute(request);
            LogCall(api, mbInterface.MindbodyStudioId, mbInterface.StudioId);

            if (response.IsSuccessful)
            {
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    result = response.Content;
                    MBProducts = JsonConvert.DeserializeObject<MindBodyProducts>(result);

                    foreach (var mbProduct in MBProducts.Products)
                    {
                        //Products
                        var products = _context.Product.Where(x => x.SiteId == mbInterface.MindbodyStudioId && x.Id == mbProduct.Id).FirstOrDefault();
                        Product newProduct = new Product();
                        if (products != null)
                        {
                            products.SiteId = mbInterface.MindbodyStudioId;
                            products.Price = mbProduct.Price;
                            products.TaxIncluded = mbProduct.TaxIncluded;
                            products.TaxRate = mbProduct.TaxRate;
                            products.Id = mbProduct.Id;
                            products.GroupId = mbProduct.GroupId;
                            products.Name = mbProduct.Name;
                            products.OnlinePrice = mbProduct.OnlinePrice;
                            products.ShortDescription = mbProduct.ShortDescription;
                            products.LongDescription = mbProduct.LongDescription;
                            products.DateModified = DateTime.Now;

                            _context.Update(products);
                            _context.SaveChanges(username);

                            Product = products;
                        }
                        else
                        {
                            //insert Product table
                            newProduct.SiteId = mbInterface.MindbodyStudioId;
                            newProduct.Price = mbProduct.Price;
                            newProduct.TaxIncluded = mbProduct.TaxIncluded;
                            newProduct.TaxRate = mbProduct.TaxRate;
                            newProduct.Id = mbProduct.Id;
                            newProduct.GroupId = mbProduct.GroupId;
                            newProduct.Name = mbProduct.Name;
                            newProduct.OnlinePrice = mbProduct.OnlinePrice;
                            newProduct.ShortDescription = mbProduct.ShortDescription;
                            newProduct.LongDescription = mbProduct.LongDescription;
                            newProduct.DateCreated = DateTime.Now;

                            _context.Product.Add(newProduct);
                            _context.SaveChanges(username);
                            Product = newProduct;
                        }

                        //Colors
                        var color = mbProduct.Color;
                        var productItemColor = _context.ProductColor.Where(x => x.ProductId == Product.ProductId && x.Id == color.Id).FirstOrDefault();
                        if (productItemColor != null)
                        {
                            productItemColor.Name = color.Name;
                            productItemColor.DateModified = DateTime.Now;
                            _context.Update(productItemColor);
                        }
                        else
                        {
                            ProductColor newProductColor = new ProductColor()
                            {
                                ProductId = newProduct.ProductId,
                                Id = color.Id,
                                Name = color.Name,
                                DateCreated = DateTime.Now
                            };
                            _context.ProductColor.Add(newProductColor);
                        }

                        _context.SaveChanges(username);

                        //size
                        var Size = mbProduct.Size;
                        var productItemSize = _context.ProductSize.Where(x => x.ProductId == Product.ProductId && x.Id == Size.Id).FirstOrDefault();
                        if (productItemSize != null)
                        {
                            productItemSize.Name = Size.Name;
                            productItemSize.DateModified = DateTime.Now;
                            _context.Update(productItemSize);
                        }
                        else
                        {
                            ProductSize newProductSize = new ProductSize()
                            {
                                ProductId = newProduct.ProductId,
                                Id = Size.Id,
                                Name = Size.Name,
                                DateCreated = DateTime.Now
                            };
                            _context.ProductSize.Add(newProductSize);
                        }

                        _context.SaveChanges(username);
                    }

                }
            }
        }
        public MBPaymentTransactionViewModel CheckoutShoppingCart(BillingParamViewModel param)
        {
            CheckoutShoppingCartViewModel shoppingCart = new CheckoutShoppingCartViewModel();
            ErrorViewModel error = new ErrorViewModel();
            var success = false;
            var Amount = decimal.Round(param.Amount, 2, MidpointRounding.AwayFromZero);
            var message = string.Empty;
            try
            {
                var result = string.Empty;
                var clientId = !string.IsNullOrWhiteSpace(param.PaidBy.Mbid) ? param.PaidBy.Mbid : param.PaidBy.MbuniqueId.ToString();

                API = Configuration.GetValue<string>("MindBody:APIKey");
                var api = _context.MbwebApi.Where(x => x.Title == "PostCheckoutShoppingCart").FirstOrDefault();
                var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");
                var client = new RestClient(api.Url);
                var request = new RestRequest(Method.POST);
                request.AddHeader("SiteId", param.SiteId.ToString());
                request.AddHeader("Api-Key", API);
                request.AddHeader("User-Agent", userAgent);
                request.AddHeader("Authorization", param.Token);

                if (param.PaymentMethodTypeId == (int)DataAccess.Enums.PaymentMethodType.DirectDebit)
                {
                    request.AddParameter("application/json",
                    "{\r\n" +
                    "   \"ClientId\": \"" + clientId + "\",\r\n" +
                    "   \"Test\": true,\r\n" +
                    "   \"Items\":[\r\n " +
                    "   {\r\n" +
                    "       \"Item\": {\r\n" +
                    "           \"Type\": \"Product\",\r\n" +
                    "           \"Metadata\": {\r\n\t" +
                    "               \"Id\" : \"" + param.MBProductId + "\"\r\n" +
                    "           }\r\n" +
                    "       },\r\n " +
                    "   \"Quantity\":" + param.Quantity + "\r\n" +
                    "   }\r\n " +
                    " ],\r\n  " +
                    "\"InStore\": true,\r\n  " +
                    "\"Payments\":[\r\n" +
                    "   {\r\n" +
                    "       \"Type\": \"DirectDebit\",\r\n" +
                    "       \"Metadata\": {\r\n\t" +
                    "           \"Amount\":" + Amount + "" +
                    "       }\r\n    " +
                    "   }\r\n  " +
                    "],\r\n  " +
                    "\"SendEmail\": true,\r\n" +
                    "}", ParameterType.RequestBody);
                }
                else if (param.PaymentMethodTypeId == (int)DataAccess.Enums.PaymentMethodType.CreditCard)
                {
                    request.AddParameter("application/json",
                    "{\r\n" +
                    "   \"ClientId\": \"" + clientId + "\",\r\n" +
                    "   \"Test\": true,\r\n" +
                    "   \"Items\":[\r\n " +
                    "   {\r\n" +
                    "       \"Item\": {\r\n" +
                    "           \"Type\": \"Product\",\r\n" +
                    "           \"Metadata\": {\r\n\t" +
                    "               \"Id\" : \"" + param.MBProductId + "\"\r\n" +
                    "           }\r\n" +
                    "       },\r\n " +
                    "   \"Quantity\":" + param.Quantity + "\r\n" +
                    "   }\r\n " +
                    " ],\r\n  " +
                    "\"InStore\": true,\r\n  " +
                    "\"Payments\":[\r\n" +
                    "   {\r\n" +
                    "        \"Type\": \"StoredCard\",\r\n" +
                    "        \"Metadata\": {\r\n\t" +
                    "           \"Amount\": " + Amount + ",\r\n\t" +
                    "           \"LastFour\": \"" + param.PaidBy.CreditCardLastFour + "\"\r\n" +
                    "   }\r\n    " +
                    "}\r\n  ],\r\n" +
                    "\"SendEmail\": true,\r\n" +
                    "}", ParameterType.RequestBody);
                }


                Thread.Sleep(100);
                IRestResponse response = client.Execute(request);
                message = response.ErrorMessage;
                LogCall(api, param.SiteId, param.PaidBy.StudioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        result = response.Content;

                        shoppingCart = JsonConvert.DeserializeObject<CheckoutShoppingCartViewModel>(result);

                        if (shoppingCart.ShoppingCart != null)
                        {
                            success = true;
                            ShoppingCart cart = new ShoppingCart()
                            {
                                Id = shoppingCart.ShoppingCart.Id,
                                ClientId = clientId,
                                SiteId = param.SiteId,
                                SubTotal = shoppingCart.ShoppingCart.SubTotal,
                                DiscountTotal = shoppingCart.ShoppingCart.DiscountTotal,
                                TaxTotal = shoppingCart.ShoppingCart.TaxTotal,
                                GrandTotal = shoppingCart.ShoppingCart.GrandTotal,
                                TransactionDate = DateTime.Now
                            };
                            _context.ShoppingCart.Add(cart);
                            _context.SaveChanges(param.Username);
                        }
                    }
                }
                else
                {
                    result = response.Content;
                    error = JsonConvert.DeserializeObject<ErrorViewModel>(result);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            MBPaymentTransactionViewModel transaction = new MBPaymentTransactionViewModel()
            {
                TransactionStatus = success,
                TransactionMessage = error.Error != null ? error.Error.Message : null
            };

            return transaction;
        }
        #endregion

        #region Member Profile 
        public async Task<ClientViewModel> UpdateMemberProfileAsync(Mbinterface mbInterface, ClientViewModel memberView)
        {
            ClientViewModel clientInfo = new ClientViewModel();
            try
            {
                ClientUpdate clientUpdate = new ClientUpdate
                {
                    Client = memberView,
                    CrossRegionalUpdate = false,
                    Test = false
                };

                var result = string.Empty;
                API = Configuration.GetValue<string>("MindBody:APIKey");
                var token = GetUserToken(mbInterface.MindbodyStudioId, mbInterface.StudioId);
                var api = _context.MbwebApi.Where(x => x.Title == "PostClientProfile").FirstOrDefault();
                var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");
                var client = new RestClient(api.Url + memberView.Id);

                var request = new RestRequest(Method.POST);
                request.AddHeader("SiteId", mbInterface.MindbodyStudioId.ToString());
                request.AddHeader("Api-Key", API);
                request.AddHeader("User-Agent", userAgent);
                request.AddHeader("Authorization", token);
                request.AddJsonBody(clientUpdate);
                IRestResponse response = await client.ExecuteAsync(request);
                LogCall(api, mbInterface.MindbodyStudioId, mbInterface.StudioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {

                        result = response.Content;
                        var clientResponse = JsonConvert.DeserializeObject<ClientResponse>(result);
                        clientInfo = clientResponse.Client;
                        clientInfo.MobilePhone = UpdateMobileFormat(clientInfo.MobilePhone);
                        clientInfo.Message = "Member successfully synced in MindBody.";
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return clientInfo;
        }
        public async Task<ClientViewModel> AddMemberAsync(Mbinterface mbInterface, ClientViewModel clientView)
        {
            ClientViewModel clientInfo = new ClientViewModel();
            try
            {
                var result = string.Empty;
                API = Configuration.GetValue<string>("MindBody:APIKey");
                var token = GetUserToken(mbInterface.MindbodyStudioId, mbInterface.StudioId);
                var api = _context.MbwebApi.Where(x => x.Title == "PostAddClient").FirstOrDefault();
                var userAgent = Configuration.GetValue<string>("MindBody:UserAgent");
                var client = new RestClient(api.Url);

                var request = new RestRequest(Method.POST);
                request.AddHeader("SiteId", mbInterface.MindbodyStudioId.ToString());
                request.AddHeader("Api-Key", API);
                request.AddHeader("User-Agent", userAgent);
                request.AddHeader("Authorization", token);
                request.AddParameter("application/json", JsonConvert.SerializeObject(clientView), ParameterType.RequestBody);
                IRestResponse response = await client.ExecuteAsync(request);
                LogCall(api, mbInterface.MindbodyStudioId, mbInterface.StudioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        result = response.Content;
                        var clientResponse = JsonConvert.DeserializeObject<ClientResponse>(result);
                        clientInfo = clientResponse.Client;
                        clientInfo.MobilePhone = UpdateMobileFormat(clientInfo.MobilePhone);
                        clientInfo.Message = "Member successfully synced in MindBody.";
                    }
                }
                else
                {
                    clientInfo.Message = response.ErrorMessage;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return clientInfo;
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

        #region Visits Services
        public async Task GetClientVisits()
        {
            MbInterfaces = await _context.Mbinterface.ToListAsync();
            foreach (var mbInterface in MbInterfaces)
            {
                await Task.Run(() => VisitsValidationServices(mbInterface));
            }
        }
        public void VisitsValidationServices(Mbinterface mbInterface)
        {
            var site = 0;
            try
            {
                site = mbInterface.MindbodyStudioId;
                var dateFrom = _context.ValidateVisit
                    .Where(x => x.StudioId == mbInterface.StudioId)
                    .OrderByDescending(x => x.ToDateValidation)
                    .FirstOrDefault();

                var dateTo = DateTime.Now.Date;
                _logger.LogInformation("<<========== Validate Visits started: " + DateTime.Now + " for site: " + mbInterface.MindbodyStudioId + " ============>");


                int[] memberStatusIds = new int[] { (int)MemberStatuses.Active, (int)MemberStatuses.Suspended };

                Members = _context.Member
                    .Where(x => memberStatusIds.Contains(x.MemberStatusId)
                            && x.StudioId == mbInterface.StudioId)
                    .ToList();

                if (Members != null)
                {
                    _logger.LogInformation("<<<======= Total number of Members to sync : " + Members.Count() + " =========>>>");
                    ValidateMemberVisitsViewModel param = new ValidateMemberVisitsViewModel()
                    {
                        Members = Members,
                        DateFrom = dateFrom.ToDateValidation.Date.AddDays(1).ToString("s"),
                        DateTo = DateTime.Now.Date.ToString("s"),
                        StudioId = mbInterface.StudioId,
                        User = "BackgroundService"
                    };

                    var success = ValidateMembersVisits(param);

                    if (success)
                    {
                        ValidateVisit updates = new ValidateVisit()
                        {
                            FromDateValidation = dateFrom.ToDateValidation.Date.AddDays(1),
                            ToDateValidation = DateTime.Now.Date,
                            StudioId = mbInterface.StudioId,
                            DateCreated = DateTime.Now
                        };
                        _context.ValidateVisit.Add(updates);
                        _context.SaveChanges();
                    }
                }

                _logger.LogInformation("<<========== Validate Visits ended " + DateTime.Now + " for site: " + mbInterface.MindbodyStudioId + " ============>");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + "<<========== Error in Validate Weekly Visits for site: " + site + " ============>");
            }

        }
        public bool ValidateMembersVisits(ValidateMemberVisitsViewModel param)
        {
            var success = false;
            try
            {
                var siteId = _context.Studio
                    .Where(x => x.StudioId == param.StudioId)
                    .FirstOrDefault().SiteId;
                var token = GetUserToken(siteId.Value, param.StudioId);

                foreach (var member in param.Members)
                {
                    int offset = 0;
                    var clientId = String.IsNullOrEmpty(member.Mbid) ? member.MbuniqueId.ToString() : member.Mbid;

                    // run this to update visits dated from the given data range.
                    SyncVisitsParamViewModel visitParam = new SyncVisitsParamViewModel()
                    {
                        Offset = offset,
                        SiteId = siteId.Value.ToString(),
                        ClientId = clientId,
                        StartDate = param.DateFrom,
                        EndDate = param.DateTo,
                        StudioId = param.StudioId,
                        Token = token
                    };
                    var result = MindbodyClientVisits(visitParam);

                    if (result != string.Empty)
                    {
                        MBClientVisits = JsonConvert.DeserializeObject<MindBodyClientVisits>(result);
                        int totalResult = MBClientVisits.PaginationResponse.TotalResults;

                        if (MBClientVisits.Visits.Count() != 0)
                        {
                            //remove visits to validate

                            var DateFromUTC = TimeZoneInfo.ConvertTimeToUtc(DateTime.Parse(param.DateFrom)).ToString("s");
                            var visitToValidate = _context.MbclientVisits
                                .Where(x => x.ClientId == clientId && x.SiteId == siteId.Value &&
                                x.StartDateTime >= DateTime.Parse(DateFromUTC) && x.EndDateTime <= DateTime.Parse(param.DateTo))
                                .ToList();

                            _context.RemoveRange(visitToValidate);
                            _context.SaveChanges();

                            //using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                            //{
                            //    cmd.CommandText = "dbo.uspDeleteVisitsToValidate"; //sp name
                            //    cmd.CommandType = CommandType.StoredProcedure;
                            //    List<SqlParameter> iparam = new List<SqlParameter>()
                            //            {
                            //                new SqlParameter("@ClientId", SqlDbType.VarChar) { Value = clientId },
                            //                new SqlParameter("@SiteId", SqlDbType.Int) { Value = siteId.Value},
                            //                new SqlParameter("@DateFrom", SqlDbType.DateTime) { Value =  DateTime.Parse(DateFromUTC) },
                            //                new SqlParameter("@DateTo", SqlDbType.DateTime) { Value = DateTime.Parse(param.DateTo) }
                            //            };
                            //    cmd.Parameters.AddRange(iparam.ToArray());
                            //    _context.Database.OpenConnection();
                            //    cmd.ExecuteNonQuery();
                            //    cmd.Dispose();                               
                            //}                                                

                            for (int count = 0; count <= totalResult;)
                            {
                                if (offset > 0)
                                {
                                    SyncVisitsParamViewModel iParam = new SyncVisitsParamViewModel()
                                    {
                                        Offset = offset,
                                        SiteId = siteId.Value.ToString(),
                                        ClientId = clientId,
                                        StartDate = param.DateFrom,
                                        EndDate = param.DateTo,
                                        StudioId = param.StudioId,
                                        Token = token
                                    };
                                    result = MindbodyClientVisits(iParam);
                                }

                                if (result != string.Empty)
                                {
                                    MBClientVisits = JsonConvert.DeserializeObject<MindBodyClientVisits>(result);

                                    if (MBClientVisits.Visits.Count() != 0)
                                    {
                                        var visits = MBClientVisits.Visits.ToList();

                                        foreach (var visit in visits)
                                        {
                                            var LastModifiedDateTime = DateTime.Parse(visit.LastModifiedDateTime.ToString());

                                            if (LastModifiedDateTime < DateTime.Parse("1759-01-01"))
                                            {
                                                visit.LastModifiedDateTime = null;
                                            }
                                            else
                                            {
                                                visit.LastModifiedDateTime = LastModifiedDateTime;
                                            }

                                            var staff = _context.VwClasses
                                                .Where(x => x.StudioId == param.StudioId && x.ClassId == visit.ClassId)
                                                .FirstOrDefault();

                                            MbclientVisits mbclientVisits = new MbclientVisits()
                                            {

                                                Id = visit.Id,
                                                ClientId = visit.ClientId,
                                                ClientUniqueId = visit.ClientUniqueId,
                                                ClassId = visit.ClassId,
                                                SiteId = visit.SiteId,
                                                LocationId = visit.LocationId,
                                                AppointmentId = visit.AppointmentId,
                                                ServiceId = visit.ServiceId,
                                                ProductId = visit.ProductId,
                                                StaffId = visit.StaffId,
                                                StaffName = staff?.StaffName,
                                                AppointmentGenderPreference = visit.AppointmentGenderPreference,
                                                AppointmentStatus = visit.AppointmentStatus,
                                                StartDateTime = TimeZoneInfo.ConvertTimeToUtc(visit.StartDateTime.Value),
                                                EndDateTime = TimeZoneInfo.ConvertTimeToUtc(visit.EndDateTime.Value),
                                                LastModifiedDateTime = visit.LastModifiedDateTime,
                                                LateCancelled = visit.LateCancelled,
                                                MakeUp = visit.MakeUp,
                                                Name = visit.Name,
                                                ServiceName = visit.ServiceName,
                                                SignedIn = visit.SignedIn,
                                                WebSignup = visit.WebSignup,
                                                Action = visit.Action,
                                                SignedInStatus = visit.SignedIn == "true" ? "SignedIn" : "NotSignedIn",
                                                MaxCapacity = visit.MaxCapacity,
                                                WebCapacity = visit.WebCapacity,
                                                TotalBooked = visit.TotalBooked,
                                                WebBooked = visit.WebBooked,
                                                TotalWaitlisted = visit.TotalWaitlisted,
                                                ClientPassId = visit.ClientPassId,
                                                ClientPassSessionsTotal = visit.ClientPassSessionsTotal,
                                                ClientPassSessionsDeducted = visit.ClientPassSessionsDeducted,
                                                ClientPassSessionsRemaining = visit.ClientPassSessionsRemaining,
                                                ClientPassActivationDateTime = visit.ClientPassActivationDateTime,
                                                ClientPassExpirationDateTime = visit.ClientPassExpirationDateTime,
                                                BookingOriginatedFromWaitlist = visit.BookingOriginatedFromWaitlist,
                                                ClientsNumberOfVisitsAtSite = visit.ClientsNumberOfVisitsAtSite,
                                                ItemSiteId = visit.ItemSiteId
                                            };
                                            _context.MbclientVisits.Add(mbclientVisits);
                                        }
                                        _context.SaveChanges();
                                    }

                                }
                                offset += 200;
                                count = offset;
                            }
                        }
                    }
                }

                success = true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return success;
        }
        public string MindbodyClientVisits(SyncVisitsParamViewModel param)
        {
            var result = string.Empty;
            try
            {
                var api = _context.MbwebApi.Where(x => x.Title == "GetClientVisits").FirstOrDefault();
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
                IRestResponse response = client.Execute(request);
                LogCall(api, int.Parse(param.SiteId), param.StudioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        result = response.Content;
                    }
                }
                else
                {
                    var retry = param.Retry;
                    retry++;
                    if (retry < 2)
                    {
                        param.Retry = retry;
                        param.Token = GetUserToken(int.Parse(param.SiteId), param.StudioId);
                        MindbodyClientVisits(param);
                    }
                    else
                    {
                        _logger.LogError(response.StatusCode + response.ErrorMessage + " APIVisits " + param.ClientId);
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + "APIVisits");
            }
            return result;
        }
        #endregion

        #region Classes and Class Schedules Services
        public async Task GetClassesAndClassSchedule()
        {
            _logger.LogInformation("=============== Sync Weekly class and class schedule Start: " + DateTime.Now + " ===============");
            MbInterfaces = await _context.Mbinterface.ToListAsync();
            foreach (var mbInterface in MbInterfaces)
            {
                await Task.Run(() => SyncClassesFromMindBody(mbInterface));


                await Task.Run(() => VisitsValidationServices(mbInterface));
            }

            _logger.LogInformation("===============Full sync ended: " + DateTime.Now + " ===============");
        }

        #region Sync classes from Mindbody
        public async Task SyncClassesFromMindBody(Mbinterface mbInterface)
        {
            try
            {
                _logger.LogInformation("<<<<<=========== classes full sync for site: " + mbInterface.MindbodyStudioId + " started ===========>>>>>");

                int offset = 0;
                var startDate = await _context.Class
                    .Where(x => x.StudioId == mbInterface.StudioId)
                    .OrderByDescending(x => x.StartDateTime)
                    .FirstOrDefaultAsync();

                SyncParamViewModel param = new SyncParamViewModel()
                {
                    Offset = offset,
                    SiteId = mbInterface.MindbodyStudioId,
                    StudioId = mbInterface.StudioId,
                    StartDate = startDate.StartDateTime.Value.Date.AddHours(23).ToString()
                };

                //call API
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
                                StartDate = startDate.StartDateTime.Value.Date.AddDays(1).ToString()
                            };

                            //call API
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
                                    #region insert class
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

                                    #endregion

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

                                        if (locationExist == null)
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

                                        if (resourceExist == null)
                                        {
                                            ClassResource resource = new ClassResource()
                                            {
                                                StudioId = mbInterface.StudioId,
                                                Id = mbClass.Resource.Id,
                                                Name = mbClass.Resource.Name,
                                                DateCreated = DateTime.Now
                                            };
                                            await _context.ClassResource.AddAsync(resource);
                                            await _context.SaveChangesAsync();
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
                                                await _context.SaveChangesAsync();
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
                                                await _context.SaveChangesAsync();
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
                                                        await _context.SaveChangesAsync();
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

                _logger.LogInformation("<<<<<=========== classes full sync for site: " + mbInterface.MindbodyStudioId + " ended ===========>>>>>");

                // Update Class Schedule
                await SyncClassScheduleFromMindBody(mbInterface);

            }


            catch (Exception ex)
            {
                _logger.LogError(ex.Message + "<<<<<=========== Error in saving Class for site: " + mbInterface.MindbodyStudioId + " ===========>>>>>");
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
                LogCall(api, param.SiteId, param.StudioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                        result = response.Content;
                }
                else
                {
                    _logger.LogError(response.StatusCode + response.ErrorMessage + " <<<<<=========== response failed in calling API Class for site: " + param.SiteId + " ===========>>>>>  ");
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + " <<<<<=========== APIClass Failed for site: " + param.SiteId + "  ===========>>>>>");
            }
            return result;
        }

        #endregion

        #region Sync class schedule from Mindbody
        public async Task SyncClassScheduleFromMindBody(Mbinterface mbInterface)
        {
            _logger.LogInformation("<<<<<=========== class schedule full sync for site: " + mbInterface.MindbodyStudioId + " started ===========>>>>>");
            try
            {
                int offset = 0;

                var startDate = await _context.ClassSchedule
                    .Where(x => x.StudioId == mbInterface.StudioId)
                    .OrderByDescending(x => x.StartDate)
                    .FirstOrDefaultAsync();

                var endDate = DateTime.Now.ToString("s");
                SyncParamViewModel param = new SyncParamViewModel()
                {
                    Offset = offset,
                    SiteId = mbInterface.MindbodyStudioId,
                    StudioId = mbInterface.StudioId,
                    StartDate = startDate.StartDate.Value.ToString("s"),
                    EndDate = endDate
                };

                //call API
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
                                StartDate = startDate.StartDate.Value.ToString("s"),
                                EndDate = endDate
                            };
                            //call API
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

                                    var classSchedule = await _context.ClassSchedule
                                        .FirstOrDefaultAsync(x => x.Id == mbSchedule.Id && x.StudioId == mbInterface.StudioId);
                                    //insert Class schedule
                                    ClassSchedule schedule = new ClassSchedule()
                                    {
                                        StudioId = mbInterface.StudioId,
                                        Id = mbSchedule.Id,
                                        SemesterId = mbSchedule.SemesterId,
                                        IsAvailable = mbSchedule.IsAvailable,
                                        StartDate = DateTime.Parse(mbSchedule.StartDate),
                                        EndDate = DateTime.Parse(mbSchedule.EndDate),
                                        StartTime = DateTime.Parse(mbSchedule.StartTime),
                                        EndTime = DateTime.Parse(mbSchedule.EndTime),
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

                                    location.BusinessDescription = mbSchedule.Location.BusinessDescription;
                                    _context.Update(location);
                                    await _context.SaveChangesAsync();

                                }
                            }
                        }
                        offset += 200;
                        count = offset;
                    }
                }

                _logger.LogInformation("<<<<<=========== class schedule full sync for site: " + mbInterface.MindbodyStudioId + " ended ===========>>>>>");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + "<<<<<=========== Error in saving Class schedule for site: " + mbInterface.MindbodyStudioId + " ===========>>>>>");
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
                  ? new RestClient(api.Url + "?StartDate=" + param.StartDate + "&EndDate=" + param.EndDate + "&CrossRegionalLookup=false&limit=200&offset=" + param.Offset)
                  : new RestClient(api.Url + "?StartDate=" + param.StartDate + "&EndDate=" + param.EndDate + "&CrossRegionalLookup=false&limit=200");

                var request = new RestRequest(Method.GET);
                request.AddHeader("SiteId", param.SiteId.ToString());
                request.AddHeader("Api-Key", Configuration.GetValue<string>("MindBody:APIKey"));
                request.AddHeader("User-Agent", userAgent);

                IRestResponse response = await client.ExecuteAsync(request);
                LogCall(api, param.SiteId, param.StudioId);

                if (response.IsSuccessful)
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                        result = response.Content;
                }
                else
                {
                    _logger.LogError(response.StatusCode + response.ErrorMessage + " <<<<<=========== response failed in calling API Class schedule for site: " + param.SiteId + " ===========>>>>>  ");
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + " <<<<<=========== APIClassSchedule Failed for site: " + param.SiteId + "  ===========>>>>>");
            }
            return result;
        }
        #endregion

        #endregion

        #region Custom Services 
        //public async Task GetCustomVisits()
        //{
        //    _logger.LogInformation("<<========== Get visit started " + DateTime.Now + " ============>");
        //    using (var cmd = _context.Database.GetDbConnection().CreateCommand())
        //    {
        //        cmd.CommandText = "dbo.uspCustomMemberGetVisits"; //sp name
        //        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        //        _context.Database.OpenConnection();
        //        using (var result = cmd.ExecuteReader())
        //        {
        //            if (result.HasRows)
        //            {
        //                var members = _context.MapToList<Member>(result);
        //                Members = members.ToList();
        //            }
        //        }
        //    }
        //    if (Members != null)
        //    {
        //        _logger.LogInformation("<<<======= Total number of Members to sync : " + Members.Count() + " =========>>>");
        //        var mbInterface = await _context.Mbinterface.FirstOrDefaultAsync(x => x.StudioId == 2);
        //       // SyncClientVisitsFromMindBody(mbInterface, Members, "BackgroudService");
        //    }
        //    _logger.LogInformation("<<========== Get visit ended " + DateTime.Now + " ============>");
        //}
        #endregion


    }
}
