using DataAccess.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataService.Services.Interfaces
{
    public interface ISmsService
    {
        /// <summary>
        /// Send SMS using Twilio
        /// </summary>
        /// <param name="sendTo">Mobile Number (ex. "+15558675310")</param>
        /// <param name="smsBody">Message</param>
        public Task SendSms(string sendTo, SmsSettingViewModel smsAccount);
    }
}
