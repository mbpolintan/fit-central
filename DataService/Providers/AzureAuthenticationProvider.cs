using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using DataService.Utilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
//using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace DataService.Providers
{
    public class AzureAuthenticationProvider : IAuthenticationProvider
    {
        //private readonly IConfiguration _config;       
        private readonly string _clientId;
        private readonly string _clientSecret;
        private readonly string _tenantId;
        private readonly string _instance;

        public AzureAuthenticationProvider(
            IConfiguration config)
        {
            //_config = config;           
            _clientId = config["AzureAd:ClientId"].ToString();
            _clientSecret = config["AzureAd:ClientSecret"].ToString();
            _tenantId = config["AzureAd:TenantId"].ToString();
            _instance = config["AzureAd:Instance"].ToString();
        }

        public async Task AuthenticateRequestAsync(HttpRequestMessage request)
        {
            AuthenticationContext authenticationContext = new AuthenticationContext($"{_instance}{_tenantId}", false);
            ClientCredential clientCredential = new ClientCredential(_clientId, _clientSecret);
            AuthenticationResult authenticationResult = await authenticationContext.AcquireTokenAsync(MicrosoftGraphApiUtility.GetBaseAddress(), clientCredential);
            request.Headers.Authorization = new AuthenticationHeaderValue(MicrosoftGraphApiUtility.SCHEME, authenticationResult.AccessToken);

            //if (bool.Parse(_config["Staging:SaveAzureToken"]))
            //{
            //    // Save the token for testing purposes with postman
            //    var user = await _users.Find(x => x.Email == DefaultUser.DEVELOPER_EMAIL).FirstOrDefaultAsync();
            //    if (user != null)
            //    {
            //        _azureTokens.Add(new BrightspaceAzureToken()
            //        {
            //            Token = authenticationResult.AccessToken,
            //            CreatedDate = DateTime.Now,
            //            CreatedByUserId = user.UserId,
            //            CreatedByUser = user
            //        });
            //        await _unitOfWork.Commit(DefaultUser.DEVELOPER_EMAIL);
            //    }
            //}
        }
    }
}
