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
    public class ContractWebhookController : ControllerBase
    {
        private readonly ILogger<ContractWebhookController> _logger;
        private IWebhookService _webhookService;
        private readonly StudioCentralContext _context;
        public ContractWebhookController(ILogger<ContractWebhookController> logger,
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
            _logger.LogInformation("Process ContractWebhook reply Web Response Hit");
            var dataAsString = Newtonsoft.Json.JsonConvert.SerializeObject(headers);
            _logger.LogInformation("Response ContractWebhook ==> {@data}", dataAsString);
            return Ok();
        }

        [HttpPost("")]
        public async Task<IActionResult> PostClient([FromHeader(Name = "X-MINDBODY-Signature")] string signatureMessage)
        {
            try
            {
                var signatureKey = "/RgVCMGWE6t9YlY4T/J8iEp8iYRdK/dn7JrvYOFICm4=";
                var webhook = await _webhookService.ValidateWebhook<ContractWebhookViewModel>(Request, signatureKey);

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

                    PushClientContract pushContract = new PushClientContract()
                    {
                        ClientWebhookId = pushedWebhook.ClientWebhookId,
                        IsSynced = false,
                        SiteId = webhook.EventData.SiteId,
                        ClientId = webhook.EventData.ClientId,
                        ClientUniqueId = webhook.EventData.ClientUniqueId,
                        ClientFirstName = webhook.EventData.ClientFirstName,
                        ClientLastName = webhook.EventData.ClientLastName,
                        ClientEmail = webhook.EventData.ClientEmail,
                        AgreementDateTime = webhook.EventData.AgreementDateTime,
                        ContractSoldByStaffId = webhook.EventData.ContractSoldByStaffId,
                        ContractSoldByStaffFirstName = webhook.EventData.ContractSoldByStaffFirstName,
                        ContractSoldByStaffLastName = webhook.EventData.ContractSoldByStaffLastName,
                        ContractOriginationLocation = webhook.EventData.ContractOriginationLocation,
                        ContractId = webhook.EventData.ContractId,
                        ContractName = webhook.EventData.ContractName,
                        ClientContractId = webhook.EventData.ClientContractId,
                        ContractStartDateTime = webhook.EventData.ContractStartDateTime,
                        ContractEndDateTime = webhook.EventData.ContractEndDateTime,
                        IsAutoRenewing = webhook.EventData.IsAutoRenewing
                    };
                    _context.PushClientContract.Add(pushContract);
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
