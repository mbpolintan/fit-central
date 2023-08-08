using DataAccess.Contexts;
using DataAccess.Models;
using DataService.Exceptions;
using DataService.Services.Interfaces;
using DataService.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

namespace Internal.Website.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors(PolicyName = "CorsPolicy")]
    public class ClientWebhookController : ControllerBase
    {
        private readonly ILogger<ClientWebhookController> _logger;
        private IWebhookService _webhookService;
        private readonly StudioCentralContext _context;
        public ClientWebhookController(ILogger<ClientWebhookController> logger,
                                        IWebhookService webhookService,
                                        StudioCentralContext context)
        {
            _logger = logger;
            _webhookService = webhookService;
            _context = context;
        }

        [HttpHead("")]
        public IActionResult Head()
        {
            var re = Request;
            var headers = re.Headers;
            _logger.LogInformation("Process Webhook reply Web Response Hit");
            var dataAsString = Newtonsoft.Json.JsonConvert.SerializeObject(headers);
            _logger.LogInformation("Response Webhook ==> {@data}", dataAsString);

            return Ok();
        }

        [HttpPost("")]
        public async Task<IActionResult> PostClient([FromHeader(Name = "X-MINDBODY-Signature")] string signatureMessage)
        {
            try
            {
                var signatureKey = "/9osqfDc64iJ/2UXj+H1vREFCrrzCSOYGNt9A9bBAWg=";
                var webhook = await _webhookService.ValidateWebhook<ClientWebhookViewModel>(Request, signatureKey);

                var clientWebhook = _context.ClientWebhook
                    .Where(x => x.MessageId == webhook.MessageId)
                    .FirstOrDefault();

                if (clientWebhook == null)
                {
                    ClientWebhook pushedClient = new ClientWebhook()
                    {
                        EventId = webhook.EventId,
                        EventInstanceOriginationDateTime = webhook.EventInstanceOriginationDateTime,
                        EventSchemaVersion = webhook.EventSchemaVersion,
                        MessageId = webhook.MessageId
                    };

                    _context.ClientWebhook.Add(pushedClient);
                    _context.SaveChanges();

                    PushClientDetail pushClientDetail = new PushClientDetail()
                    {
                        ClientWebhookId = pushedClient.ClientWebhookId,
                        SiteId = webhook.EventData.SiteId,
                        ClientId = webhook.EventData.ClientId,
                        ClientUniqueId = webhook.EventData.ClientUniqueId,
                        CreationDateTime = webhook.EventData.CreationDateTime,
                        Status = webhook.EventData.Status,
                        FirstName = webhook.EventData.FirstName,
                        LastName = webhook.EventData.LastName,
                        MiddleName = webhook.EventData.MiddleName,
                        Email = webhook.EventData.Email,
                        MobilePhone = webhook.EventData.MobilePhone,
                        HomePhone = webhook.EventData.HomePhone,
                        WorkPhone = webhook.EventData.WorkPhone,
                        AddressLine1 = webhook.EventData.AddressLine1,
                        AddressLine2 = webhook.EventData.AddressLine2,
                        City = webhook.EventData.City,
                        State = webhook.EventData.State,
                        PostalCode = webhook.EventData.PostalCode,
                        Country = webhook.EventData.Country,
                        BirthDateTime = webhook.EventData.BirthDateTime,
                        Gender = webhook.EventData.Gender,
                        AppointmentGenderPreference = webhook.EventData.AppointmentGenderPreference,
                        FirstAppointmentDateTime = webhook.EventData.FirstAppointmentDateTime,
                        ReferredBy = webhook.EventData.ReferredBy,
                        IsProspect = webhook.EventData.IsProspect,
                        IsCompany = webhook.EventData.IsCompany,
                        IsLiabilityRelease = webhook.EventData.IsLiabilityRelease,
                        LiabilityAgreementDateTime = webhook.EventData.LiabilityAgreementDateTime,
                        HomeLocation = webhook.EventData.HomeLocation,
                        ClientNumberOfVisitsAtSite = webhook.EventData.ClientNumberOfVisitsAtSite,
                        SendAccountEmails = webhook.EventData.SendAccountEmails,
                        SendAccountTexts = webhook.EventData.SendAccountTexts,
                        SendPromotionalEmails = webhook.EventData.SendPromotionalEmails,
                        SendPromotionalTexts = webhook.EventData.SendPromotionalTexts,
                        SendScheduleEmails = webhook.EventData.SendScheduleEmails,
                        SendScheduleTexts = webhook.EventData.SendScheduleTexts,
                        CreditCardLastFour = webhook.EventData.CreditCardLastFour,
                        CreditCardExpDate = webhook.EventData.CreditCardExpDate,
                        DirectDebitLastFour = webhook.EventData.DirectDebitLastFour,
                        Notes = webhook.EventData.Notes,
                        LastModifiedDateTime = webhook.EventData.LastModifiedDateTime,
                        PhotoUrl = webhook.EventData.PhotoUrl,
                        PreviousEmail = webhook.EventData.PreviousEmail,
                        IsSynced = false
                    };
                    _context.PushClientDetail.Add(pushClientDetail);
                    _context.SaveChanges();
                }

                return Ok();
            }
            catch (BadRequestException ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}