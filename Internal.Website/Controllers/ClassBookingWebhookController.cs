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
    public class ClassBookingWebhookController : ControllerBase
    {
        private readonly ILogger<ClassBookingWebhookController> _logger;
        private IWebhookService _webhookService;
        private readonly StudioCentralContext _context;
        public ClassBookingWebhookController(ILogger<ClassBookingWebhookController> logger,
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
            _logger.LogInformation("Process ClassBookingWebhook reply Web Response Hit");
            var dataAsString = Newtonsoft.Json.JsonConvert.SerializeObject(headers);
            //_logger.LogInformation("Response ClassBookingWebhook ==> {@data}", dataAsString);
            return Ok();
        }

        [HttpPost("")]
        public async Task<IActionResult> PostClient([FromHeader(Name = "X-MINDBODY-Signature")] string signatureMessage)
        {
            try
            {
                var signatureKey = "Pgn+RU1OQ1te5DBjDOLDNhPP+43xZaXAxkmY4kCvdUY=";
                var webhook = await _webhookService.ValidateWebhook<ClassBookingWebhookViewModel>(Request, signatureKey);

                var clientWebhook = _context.ClientWebhook
                    .Where(x => x.MessageId == webhook.MessageId
                          && x.EventId == webhook.EventId)
                    .FirstOrDefault();

                if (clientWebhook == null)
                {
                    ClientWebhook pushedWebhook = new ClientWebhook()
                    {
                        EventId = webhook.EventId,
                        EventInstanceOriginationDateTime = webhook.EventInstanceOriginationDateTime,
                        EventSchemaVersion = webhook.EventSchemaVersion,
                        MessageId = webhook.MessageId
                    };

                    _context.ClientWebhook.Add(pushedWebhook);
                    _context.SaveChanges();

                    PushClientClassBooking pushBooking = new PushClientClassBooking()
                    {
                        ClientWebhookId = pushedWebhook.ClientWebhookId,
                        SiteId = webhook.EventData.SiteId,
                        LocationId = webhook.EventData.LocationId,
                        ClassId = webhook.EventData.ClassId,
                        ClassRosterBookingId = webhook.EventData.ClassRosterBookingId,
                        ClassStartDateTime = webhook.EventData.ClassStartDateTime,
                        ClassEndDateTime = webhook.EventData.ClassEndDateTime,
                        SignedInStatus = webhook.EventData.SignedInStatus,
                        StaffId = webhook.EventData.StaffId,
                        StaffName = webhook.EventData.StaffName,
                        MaxCapacity = webhook.EventData.MaxCapacity,
                        WebCapacity = webhook.EventData.WebCapacity,
                        TotalBooked = webhook.EventData.TotalBooked,
                        WebBooked = webhook.EventData.WebBooked,
                        TotalWaitlisted = webhook.EventData.TotalWaitlisted,
                        ClientId = webhook.EventData.ClientId,
                        ClientUniqueId = webhook.EventData.ClientUniqueId,
                        ClientFirstName = webhook.EventData.ClientFirstName,
                        ClientLastName = webhook.EventData.ClientLastName,
                        ClientEmail = webhook.EventData.ClientEmail,
                        ClientPhone = webhook.EventData.ClientPhone,
                        ClientPassId = webhook.EventData.ClientPassId,
                        ClientPassSessionsTotal = webhook.EventData.ClientPassSessionsTotal,
                        ClientPassSessionsDeducted = webhook.EventData.ClientPassSessionsDeducted,
                        ClientPassSessionsRemaining = webhook.EventData.ClientPassSessionsRemaining,
                        ClientPassActivationDateTime = webhook.EventData.ClientPassActivationDateTime,
                        ClientPassExpirationDateTime = webhook.EventData.ClientPassExpirationDateTime,
                        BookingOriginatedFromWaitlist = webhook.EventData.BookingOriginatedFromWaitlist,
                        ClientsNumberOfVisitsAtSite = webhook.EventData.ClientsNumberOfVisitsAtSite,
                        ItemId = webhook.EventData.ItemId,
                        ItemName = webhook.EventData.ItemName,
                        ItemSiteId = webhook.EventData.ItemSiteId,
                        IsSynced = false
                    };
                    _context.PushClientClassBooking.Add(pushBooking);
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
