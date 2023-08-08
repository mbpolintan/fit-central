using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using System.IO;

namespace Internal.Website.Authorization
{
    public class WebhookAuthorizeAttribute : ActionFilterAttribute
    {
        
        private const string EnvSignatureKey = "ENVSIGNATUREKEY";
        private byte[] body;
        
        public override void OnActionExecuting(ActionExecutingContext context)
        {                     
            // Find signature in request headers
            if (!context.HttpContext.Request.Headers.TryGetValue("X-Mindbody-Signature", out var values))
            {                
                context.Result = new BadRequestResult();
            }          

            var requestHash = values.First();

            // Get signature key stored from subscription creation
            var signatureKey = "/9osqfDc64iJ/2UXj+H1vREFCrrzCSOYGNt9A9bBAWg=";
            string computedHash;
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(signatureKey ??
                throw new NullReferenceException($"Signature key, {EnvSignatureKey}, not found in the environment"))))
            {
                // Read request body, encode with UTF-8 and compute hash byte[] body;
                using (StreamReader reader = new StreamReader(context.HttpContext.Request.Body, Encoding.UTF8))
                {                    
                    body = Encoding.UTF8.GetBytes(reader.ReadToEndAsync().Result);
                }
                var hash = hmac.ComputeHash(body);



                computedHash = $"sha256={Convert.ToBase64String(hash)}";
            }
            // Compare the computed hash with the request's hash 
            if (computedHash != requestHash)
            {                
                context.Result = new BadRequestResult();
            }            
           
        }
       
    }
}
