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
    public class ClassesWebhookController : ControllerBase
    {
        private readonly ILogger<ClassesWebhookController> _logger;
        private IWebhookService _webhookService;
        private readonly StudioCentralContext _context;
        public ClassesWebhookController(ILogger<ClassesWebhookController> logger,
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
                var webhook = await _webhookService.ValidateWebhook<ClassesWebhookViewModel>(Request, signatureKey);

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
                     
                    PushSiteClass mbClass = new PushSiteClass()
                    {
                        ClientWebhookId = pushedWebhook.ClientWebhookId,
                        IsSynced = false,
                        SiteId = webhook.EventData.SiteId,
                        LocationId = webhook.EventData.LocationId,
                        ClassId = webhook.EventData.ClassId,
                        ClassDescriptionId = webhook.EventData.ClassDescriptionId,
                        ClassScheduleId = webhook.EventData.ClassScheduleId,
                        IsCancelled = webhook.EventData.IsCanceled,
                        IsStaffAsubstitute = webhook.EventData.IsStaffASubstitute,
                        IsWaitlistAvailable = webhook.EventData.IsWaitlistAvailable,
                        IsIntendedForOnlineViewing = webhook.EventData.IsIntendedForOnlineViewing,
                        StaffId = webhook.EventData.StaffId,
                        StaffName = webhook.EventData.StaffName,
                        StartDateTime = webhook.EventData.StartDateTime,
                        EndDateTime = webhook.EventData.EndDateTime,
                        AssistantOneId = webhook.EventData.AssistantOneId,
                        AssistantOneName = webhook.EventData.AssistantOneName,
                        AssistantTwoId = webhook.EventData.AssistantTwoId,
                        AssistantTwoName = webhook.EventData.AssistantTwoName,
                        DateCreated = DateTime.Now
                    };

                    await _context.PushSiteClass.AddAsync(mbClass);
                    await _context.SaveChangesAsync("Webhook");


                    if (webhook.EventData.Resources != null)
                    {
                        foreach (var resource in webhook.EventData.Resources)
                        {
                            PushSiteClassResource mbresources = new PushSiteClassResource()
                            {
                                PushSiteClassId = mbClass.PushSiteClassId,
                                Id = resource.Id,
                                Name = resource.Name,
                                DateCreated = DateTime.Now
                            };
                            await _context.PushSiteClassResource.AddAsync(mbresources);                            
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