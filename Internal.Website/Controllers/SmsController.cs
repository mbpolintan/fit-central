using DataAccess.Contexts;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using Twilio.AspNet.Core;
using Twilio.TwiML;
using DataAccess.Enums;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.SignalR;
using DataService.Infrastructure;
using DataAccess.ViewModels;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Microsoft.Data.SqlClient;

namespace Internal.Website.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class SmsController : TwilioController
    {
        private readonly StudioCentralContext _context;
        private readonly ILogger<SmsController> _logger;
        private IHubContext<SignalServer> _hub;
        public SmsController(ILogger<SmsController> logger, StudioCentralContext context, IHubContext<SignalServer> hub)
        {
            _context = context;
            _logger = logger;
            _hub = hub;
        }

        public IEnumerable<MessageDetailViewModel> NewLoadedSMS { get; set; }
        public MessageDetailViewModel InboundSMS { get; set; }
        public SmsSetting smsAccount { get; set; }

        [HttpPost("incoming-sms")]
        public TwiMLResult IncomingSms(string From, string Body, string To)
        {
            //var response = new MessagingResponse()
            //    .Message("Thank you for texting Studio XCentral. " +
            //        "Your text message has been delivered. " +
            //        "To access your account please visit : https://studioportal.xcentral.solutions/");
            var response = new MessagingResponse();

            try
            {              
                // Get Studio
                smsAccount = _context.SmsSetting.Where(x => x.Number == To).FirstOrDefault();

                if (smsAccount != null)
                {
                    var mobilePhone = Regex.Replace(From, "^\\+61", "0");
                    var member = _context.Member.Where(x => x.StudioId == smsAccount.StudioId && x.MobilePhone == mobilePhone).FirstOrDefault();
                    var senderName = member != null ? member.DisplayName : From;

                    Inbox newMessage = new Inbox()
                    {
                        StudioId = smsAccount.StudioId,
                        MessageTypeId = (int)Message.Sms,
                        Subject = "SMS Message",
                        BodyContentType = "text",
                        BodyContent = Body,
                        ReceivedDateTime = DateTime.Now,
                        SenderName = senderName,
                        SenderMobilePhone = Regex.Replace(From, "^\\+61", "0"),
                        IsAnonymousSender = member == null,
                        IsRead = false,
                        DateCreated = DateTime.Now
                    };

                    _context.Inbox.Add(newMessage);
                    _context.SaveChanges("TwilioWebhook");

                    //Get the latest reply sms 
                    using (var cmd = _context.Database.GetDbConnection().CreateCommand())
                    {
                        cmd.CommandText = "dbo.uspGetLatestReplySMS"; //sp name
                        cmd.CommandType = CommandType.StoredProcedure;
                        List<SqlParameter> param = new List<SqlParameter>()
                            {
                                new SqlParameter("@SenderMobileNumber", SqlDbType.NVarChar) {Value = "0477770842"},
                                new SqlParameter("@StudioId", SqlDbType.Int) { Value = 1 }
                            };
                        cmd.Parameters.AddRange(param.ToArray());
                        _context.Database.OpenConnection();
                        using (var result = cmd.ExecuteReader())
                        {
                            if (result.HasRows)
                                NewLoadedSMS = _context.MapToList<MessageDetailViewModel>(result);

                            InboundSMS = NewLoadedSMS.Select(x => new MessageDetailViewModel
                            {
                                BodyContent = x.BodyContent,
                                MessageDateTime = x.MessageDateTime,
                                MobilePhone = x.MobilePhone
                            }).FirstOrDefault();
                        }
                    }
                    //signalr Get SMS Inbound Messages
                    _hub.Clients.All.SendAsync("getSMSInboundMessage", InboundSMS);
                }         
            }
            catch (Exception ex)
            {
                _logger.LogError("<<<<<<<<<<=========== Twillio webhook Error =======> " + ex.Message);
            }

            return TwiML(response);
        }
    }
}