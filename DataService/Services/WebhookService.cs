using DataService.Exceptions;
using DataService.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using DataService.ViewModels;
using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace DataService.Services
{
    public class WebhookService : IWebhookService
    {
        private readonly ILogger<WebhookService> _logger;
        private const string EnvSignatureKey = "ENVSIGNATUREKEY";
        private byte[] body;

        public WebhookService(ILogger<WebhookService> logger)
        {
            _logger = logger;
        }

        public async Task<T> ValidateWebhook<T>(HttpRequest httpRequest, string signatureKey) where T : BaseWebhookModel
        {

            // Find signature in request headers         
            if (!httpRequest.Headers.TryGetValue("X-Mindbody-Signature", out var values))
            {
                _logger.LogError("Request not signed. Expected X-Mindbody-Signature not found on request.");
                throw new BadRequestException("Request not signed. Expected X-Mindbody-Signature not found on request.");
            }

            var res = new object();
            var requestHash = values.First();

            // Get signature key stored from subscription creation
            string computedHash;
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(signatureKey ??
                throw new NullReferenceException($"Signature key, {EnvSignatureKey}, not found in the environment"))))
            {
                // Read request body, encode with UTF-8 and compute hash byte[] body;
                using (StreamReader reader = new StreamReader(httpRequest.Body, Encoding.UTF8))
                {

                    var result = await reader.ReadToEndAsync();
                    body = Encoding.UTF8.GetBytes(result);
                    //_logger.LogInformation("This is the result of the reader ====>>>>" + result);

                    res = JsonConvert.DeserializeObject<T>(result);
                }

                var hash = hmac.ComputeHash(body);
                computedHash = $"sha256={Convert.ToBase64String(hash)}";
            }

            // Compare the computed hash with the request's hash 
            if (computedHash != requestHash)
            {
                _logger.LogError("Invalid signature.X-Mindbody-Signature value was not as expected.");
                throw new BadRequestException("Invalid signature.X-Mindbody-Signature value was not as expected.");
            }

            return (T)res;
        }
    }
}