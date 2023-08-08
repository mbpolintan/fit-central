using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Models;
using DataAccess.ViewModels;
//using DataService.ServiceModels;

namespace DataService.Services.Interfaces
{
    public interface ICommunicationService
    {  
        public Task SendEmailMessage(string message, string subject, List<string> emails, int studioId);
        public Task SendSMSMessage(SmsSettingViewModel smsAccount, List<string> mobileNos);
    }
}
