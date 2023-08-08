using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataService.Services.Interfaces
{
    public interface IEmailService
    {
        public Task SendEmail(string[] emailTo, string emailSubject, string message, int studioId);
        public Task SendConfimationEmailAsync(string emailTo, string emailSubject, string message);
        string MapValuesToTemplate(Dictionary<string, string> mapping, string htmlTemplate);
    }
}
