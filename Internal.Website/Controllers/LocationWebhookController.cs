using DataAccess.Contexts;
using DataAccess.Models;
using DataService.Exceptions;
using DataService.Services.Interfaces;
using DataService.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace Internal.Website.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors(PolicyName = "CorsPolicy")]
    public class LocationWebhookController : ControllerBase
    {
        private readonly ILogger<LocationWebhookController> _logger;
        private IWebhookService _webhookService;
        private readonly StudioCentralContext _context;
        public LocationWebhookController(ILogger<LocationWebhookController> logger,
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
                var signatureKey = "Pgn+RU1OQ1te5DBjDOLDNhPP+43xZaXAxkmY4kCvdUY="; //<<<<<<<< Update this after subscrition
                var webhook = await _webhookService.ValidateWebhook<LocationWebhookViewModel>(Request, signatureKey);

                var clientWebhook = await _context.ClientWebhook
                     .Where(x => x.MessageId == webhook.MessageId
                           && x.EventId == webhook.EventId)
                     .FirstOrDefaultAsync();

                if (clientWebhook == null)
                {
                    ClientWebhook pushedWebhook = new ClientWebhook()
                    {
                        EventId = webhook.EventId,
                        EventInstanceOriginationDateTime = webhook.EventInstanceOriginationDateTime,
                        EventSchemaVersion = webhook.EventSchemaVersion,
                        MessageId = webhook.MessageId
                    };

                    await _context.ClientWebhook.AddAsync(pushedWebhook);
                    await _context.SaveChangesAsync("Webhook");

                    PushSiteLocation mbLocation = new PushSiteLocation()
                    {
                        ClientWebhookId = pushedWebhook.ClientWebhookId,
                        IsSynced = false,
                        SiteId = webhook.EventData.SiteId,
                        LocationId = webhook.EventData.LocationId,
                        Name = webhook.EventData.Name,
                        Description = webhook.EventData.Description,
                        HasClasses = webhook.EventData.HasClasses,
                        PhoneExtension = webhook.EventData.PhoneExtension,
                        Phone = webhook.EventData.Phone,
                        AddressLine1 = webhook.EventData.AddressLine1,
                        AddressLine2 = webhook.EventData.AddressLine2,
                        City = webhook.EventData.City,
                        State = webhook.EventData.State,
                        PostalCode = webhook.EventData.PostalCode,
                        Latitude = webhook.EventData.Latitude,
                        Longitude = webhook.EventData.Longitude,
                        Tax1 = webhook.EventData.Tax1,
                        Tax2 = webhook.EventData.Tax2,
                        Tax3 = webhook.EventData.Tax3,
                        Tax4 = webhook.EventData.Tax4,
                        Tax5 = webhook.EventData.Tax5,
                        WebColor5 = webhook.EventData.WebColor5,
                        DateCreated = DateTime.Now
                    };

                    await _context.PushSiteLocation.AddAsync(mbLocation);
                    await _context.SaveChangesAsync("Webhook");
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