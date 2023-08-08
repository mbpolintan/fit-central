using DataAccess.ViewModels;
using DataService.ServiceModels;
using DataService.Services.Interfaces;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace DataService.Services
{
    public class SmsService : ISmsService
    {
        private readonly TwilioSettings _smsSettings;
        public IHostEnvironment HostingEnvironment { get; set; }

        public SmsService(IOptions<TwilioSettings> smsSettings, IHostEnvironment hostingEnvironment)
        {
            _smsSettings = smsSettings.Value;
            HostingEnvironment = hostingEnvironment;
        }

        public async Task SendSms(string sendTo, SmsSettingViewModel smsAccount)
        {
            TwilioClient.Init(smsAccount.AccountSid, smsAccount.AuthToken);
            var message = await MessageResource.CreateAsync(
                body: smsAccount.Message,
                from: new Twilio.Types.PhoneNumber(smsAccount.Number),
                to: new Twilio.Types.PhoneNumber(sendTo)
            );
        }
    }
}
