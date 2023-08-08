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
    public class SaleWebhookController : ControllerBase
    {
        private readonly ILogger<SaleWebhookController> _logger;
        private IWebhookService _webhookService;
        private readonly StudioCentralContext _context;
        public SaleWebhookController(ILogger<SaleWebhookController> logger,
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
            _logger.LogInformation("Process SaleWebhook reply Web Response Hit");
            var dataAsString = Newtonsoft.Json.JsonConvert.SerializeObject(headers);
            _logger.LogInformation("Response SaleWebhook ==> {@data}", dataAsString);
            return Ok();
        }

        [HttpPost("")]
        public async Task<IActionResult> PostClient([FromHeader(Name = "X-MINDBODY-Signature")] string signatureMessage)
        {
            try
            {
                var signatureKey = "pL7Y/7mawUeln9leG05s0FfRnajYJY7MO2/BvfYx6Do=";
                var webhook = await _webhookService.ValidateWebhook<SaleWebhookViewModel>(Request, signatureKey);

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

                    PushClientSale pushSale = new PushClientSale()
                    {
                        ClientWebhookId = pushedWebhook.ClientWebhookId,
                        SaleId = webhook.EventData.SaleId,
                        SiteId = webhook.EventData.SiteId,
                        PurchasingClientId = webhook.EventData.PurchasingClientId,
                        SaleDateTime = webhook.EventData.SaleDateTime,
                        SoldById = webhook.EventData.SoldById,
                        SoldByName = webhook.EventData.SoldByName,
                        LocationId = webhook.EventData.LocationId,
                        TotalAmountPaid = webhook.EventData.TotalAmountPaid,
                        IsSynced = false
                    };
                    _context.PushClientSale.Add(pushSale);
                    _context.SaveChanges();

                    var payments = webhook.EventData.Payments.ToList();

                    foreach (var payment in payments)
                    {
                        PushClientSalePayment salePayment = new PushClientSalePayment()
                        {
                            PushClientSaleId = pushSale.PushClientSaleId,
                            PaymentId = payment.PaymentId,
                            PaymentMethodId = payment.PaymentMethodId,
                            PaymentMethod = payment.PaymentMethodName,
                            PaymentAmountPaid = payment.PaymentAmountPaid,
                            PaymentLastFour = payment.PaymentLastFour,
                            PaymentNotes = payment.PaymentNotes
                        };
                        _context.PushClientSalePayment.Add(salePayment);
                    }

                    var items = webhook.EventData.Items.ToList();

                    foreach (var item in items)
                    {
                        PushClientSaleItem saleItem = new PushClientSaleItem()
                        {
                            PushClientSaleId = pushSale.PushClientSaleId,
                            ItemId = item.ItemId,
                            Type = item.Type,
                            Name = item.Name,
                            AmountPaid = item.AmountPaid,
                            AmountDiscounted = item.AmountDiscounted,
                            Quantity = item.Quantity,
                            RecipientClientId = item.RecipientClientId,
                            PaymentReferenceId = item.PaymentReferenceId
                        };
                        _context.PushClientSaleItem.Add(saleItem);
                    }

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
