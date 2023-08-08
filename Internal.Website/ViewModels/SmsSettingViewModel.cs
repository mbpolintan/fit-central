using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class SmsSettingViewModel
    {
        public int StudioId { get; set; }
        public string AccountSid { get; set; }
        public string AuthToken { get; set; }
        public string Number { get; set; }
        public string Message { get; set; }
    }
}
