using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.ServiceModels
{
    public class TwilioSettings
    {
        public string AccountSid { get; set; }
        public string AuthToken { get; set; }
        public string TwilioNumber { get; set; }
    }
}
