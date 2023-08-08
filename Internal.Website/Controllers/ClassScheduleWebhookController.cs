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
    public class ClassScheduleWebhookController : ControllerBase
    {
        private readonly ILogger<ClassScheduleWebhookController> _logger;
        private IWebhookService _webhookService;
        private readonly StudioCentralContext _context;
        public ClassScheduleWebhookController(ILogger<ClassScheduleWebhookController> logger,
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
                var webhook = await _webhookService.ValidateWebhook<ClassScheduleWebhookViewModel>(Request, signatureKey);

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

                    PushSiteClassSchedule mbSchedule = new PushSiteClassSchedule()
                    {
                        ClientWebhookId = pushedWebhook.ClientWebhookId,
                        IsSynced = false,
                        SiteId = webhook.EventData.SiteId,
                        LocationId = webhook.EventData.LocationId,
                        MaxCapacity = webhook.EventData.MaxCapacity,
                        WebCapacity = webhook.EventData.WebCapacity,
                        StaffId = webhook.EventData.StaffId,
                        StaffName = webhook.EventData.StaffName,
                        IsActive = webhook.EventData.IsActive,
                        StartDate = webhook.EventData.StartDate,
                        EndDate = webhook.EventData.EndDate,
                        StartTime = DateTime.Parse("1899-12-30T" + webhook.EventData.StartTime),
                        EndTime = DateTime.Parse("1899-12-30T" + webhook.EventData.EndTime),
                        AssistantOneId = webhook.EventData.AssistantOneId,
                        AssistantOneName = webhook.EventData.AssistantOneName,
                        AssistantTwoId = webhook.EventData.AssistantTwoId,
                        AssistantTwoName = webhook.EventData.AssistantTwoName,
                        DateCreated = DateTime.Now
                    };

                    await _context.PushSiteClassSchedule.AddAsync(mbSchedule);
                    await _context.SaveChangesAsync("Webhook");

                    if (webhook.EventData.DaysOfWeek != null)
                    {
                        foreach (var day in webhook.EventData.DaysOfWeek)
                        {

                            PushSiteClassScheduleDow mbDOW = new PushSiteClassScheduleDow()
                            {
                                PushSiteClassScheduleId = mbSchedule.PushSiteClassScheduleId,
                                Day = day,
                                DateCreated = DateTime.Now
                            };

                            await _context.PushSiteClassScheduleDow.AddAsync(mbDOW);                           
                        }
                        await _context.SaveChangesAsync("Webhook");
                    }
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
