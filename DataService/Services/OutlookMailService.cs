using DataService.Services.Interfaces;
using DataService.Utilities;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AzureMailFolder = Microsoft.Graph.MailFolder;

namespace DataService.Services
{
    public class OutlookMailService : IOutlookMailService
    {
        private readonly ILogger<OutlookMailService> _logger;
        private readonly IAuthenticationProvider _authProvider;

        public OutlookMailService(
         ILogger<OutlookMailService> logger,
         IAuthenticationProvider authProvider)
        {
            _logger = logger;
            _authProvider = authProvider;
        }

        public async Task GetEmails()
        {
            try
            {
                List<AzureMailFolder> mailResult = new List<AzureMailFolder>();
                GraphServiceClient graphClient = new GraphServiceClient(_authProvider);
                graphClient.BaseUrl = MicrosoftGraphApiUtility.GetSiteEmails();

                var mailFolder = await graphClient.Me.Request()
                    .GetAsync();

                //var messages = await graphClient.Me.Messages.Request().GetAsync(); ; // The hard coded Top(500) is what allows me to pull all the users, the blog post did this on a param passed in

            }
            catch (Exception e)
            {
                var error = e.Message;
            }

        }
        public async Task ReadContacts()
        {
            var handler = new HttpClientHandler();
            handler.Credentials = new NetworkCredential()
            {
                //UserName = ConfigurationManager.AppSettings["UserName"],
                //Password = ConfigurationManager.AppSettings["Password"]

                UserName = "mark.jc.polintan@bettstechnologies.com",
                Password = "t30Cal1betts"
            };

            using (var client = new HttpClient(handler))
            {
                var url = "https://outlook.office365.com/api/v1.0/me/contacts";
                var result = await client.GetStringAsync(url);

                var data = JObject.Parse(result);

                foreach (var item in data["value"])
                {
                    Console.WriteLine(item["DisplayName"]);
                }
            }
        }
    }
}
