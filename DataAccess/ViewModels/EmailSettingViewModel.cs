using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class EmailSettingViewModel
    {
        public int StudioId { get; set; }
        public string MailServer { get; set; }
        public int MailPort { get; set; }
        public string SenderName { get; set; }
        public string Sender { get; set; }
        public string Password { get; set; }
        public string Message { get; set; }
    }
}
