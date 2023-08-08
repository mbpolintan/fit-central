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
    public class MembershipWebhookController : ControllerBase
    {
        private readonly ILogger<MembershipWebhookController> _logger;
        private IWebhookService _webhookService;
        private readonly StudioCentralContext _context;
        public MembershipWebhookController(ILogger<MembershipWebhookController> logger,
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
            _logger.LogInformation("Process MembershipWebhook reply Web Response Hit");
            var dataAsString = Newtonsoft.Json.JsonConvert.SerializeObject(headers);
            _logger.LogInformation("Response MembershipWebhook ==> {@data}", dataAsString);
            return Ok();
        }

        [HttpPost("")]
        public async Task<IActionResult> PostClient([FromHeader(Name = "X-MINDBODY-Signature")] string signatureMessage)
        {
            try
            {
                var signatureKey = "EaBXqohxRF6klXb1uhWE08F2gjLzMewvQHOju9/t5MM=";
                var webhook = await _webhookService.ValidateWebhook<MembershipWebhookViewModel>(Request, signatureKey);

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

                    PushClientMembership pushMembership = new PushClientMembership()
                    {
                        ClientWebhookId = pushedWebhook.ClientWebhookId,
                        SiteId = webhook.EventData.SiteId,
                        ClientId = webhook.EventData.ClientId,
                        ClientUniqueId = webhook.EventData.ClientUniqueId,
                        ClientFirstName = webhook.EventData.ClientFirstName,
                        ClientLastName = webhook.EventData.ClientLastName,
                        ClientEmail = webhook.EventData.ClientEmail,
                        MembershipId = webhook.EventData.MembershipId,
                        MembershipName = webhook.EventData.MembershipName,
                        IsSynced = false
                    };
                    _context.PushClientMembership.Add(pushMembership);
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