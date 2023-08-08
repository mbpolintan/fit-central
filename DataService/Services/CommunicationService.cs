using DataAccess.Contexts;
using DataAccess.ViewModels;
using DataService.Services.Interfaces;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DataService.Services
{
    public class CommunicationService : ICommunicationService
    {

        public IHostEnvironment _hostingEnvironment { get; set; }
        private readonly IEmailService _emailService;
        private readonly ISmsService _smsService;
        private readonly StudioCentralContext _context;

        public CommunicationService(IHostEnvironment hostingEnvironment,
                                        IEmailService emailService,
                                        ISmsService smsService,
                                        StudioCentralContext context)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
            _emailService = emailService;
            _smsService = smsService;
        }
        //private readonly ISmsService SmsService;
        public async Task SendEmailMessage(string message, string subject, List<string> emails, int studioId)
        {
            string[] emailTo = { };
            string[] emailCC = { };

            //// TODO:[Cleanup]
            if (_hostingEnvironment.IsDevelopment())
            {
                emailTo = new string[] { "mark.jc.polintan@bettstechnologies.com" };
            }
            else
            {
                emailTo = emails.ToArray();
            }
            await _emailService.SendEmail(emailTo, subject, message, studioId);
        }

        public async Task SendSMSMessage(SmsSettingViewModel smsAccount, List<string> mobileNos)
        {
            foreach (var mobileNo in mobileNos)
            {
                var sendTo = Regex.Replace(mobileNo, "^0", "+61");
                await _smsService.SendSms(sendTo, smsAccount);
            }

            //////TODO:[Cleanup]
            //if (_hostingEnvironment.IsDevelopment())
            //{
            //    smsAccount.Message = "PLEASE IGNORE THIS IS ONLY A TEST. " + smsAccount.Message;
            //    //var mobileNo = "+61467017463"; // Stephen's Mobile Number 
            //    var mobileNo = "+61477770842"; // Stephen's Mobile Number
            //    await _smsService.SendSms(mobileNo, smsAccount);
            //}
            //else
            //{
            //    foreach (var mobileNo in mobileNos)
            //    {
            //        var sendTo = Regex.Replace(mobileNo, "^0", "+61");
            //        await _smsService.SendSms(sendTo, smsAccount);
            //    }
            //}
        }
    }
}
