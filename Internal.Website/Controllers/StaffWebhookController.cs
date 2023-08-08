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
    public class StaffWebhookController : ControllerBase
    {
        private readonly ILogger<StaffWebhookController> _logger;
        private IWebhookService _webhookService;
        private readonly StudioCentralContext _context;
        public StaffWebhookController(ILogger<StaffWebhookController> logger,
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
                var webhook = await _webhookService.ValidateWebhook<StaffWebhookViewModel>(Request, signatureKey);

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


                    PushSiteStaff mbStaff = new PushSiteStaff()
                    {
                        ClientWebhookId = pushedWebhook.ClientWebhookId,
                        IsSynced = false,
                        SiteId = webhook.EventData.SiteId,
                        StaffId = webhook.EventData.StaffId,
                        AddressLine1 = webhook.EventData.AddressLine1,
                        AddressLine2 = webhook.EventData.AddressLine2,
                        StaffFirstName = webhook.EventData.StaffFirstName,
                        StaffLastName = webhook.EventData.StaffLastName,
                        City = webhook.EventData.City,
                        State = webhook.EventData.State,
                        Country = webhook.EventData.Country,
                        PostalCode = webhook.EventData.PostalCode,
                        SortOrder = webhook.EventData.SortOrder,
                        IsIndependentContractor = webhook.EventData.IsIndependentContractor,
                        AlwaysAllowDoubleBooking = webhook.EventData.AlwaysAllowDoubleBooking,
                        ImageUrl = webhook.EventData.ImageUrl,
                        Biography = webhook.EventData.Biography,
                        Gender = webhook.EventData.Gender,
                        DateCreated = DateTime.Now
                    };

                    await _context.PushSiteStaff.AddAsync(mbStaff);
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