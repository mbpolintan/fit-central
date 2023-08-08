using Microsoft.AspNetCore.Http;
using DataService.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataService.Services.Interfaces
{
    public interface IWebhookService
    {
        public Task<T> ValidateWebhook<T>(HttpRequest httpRequest, string signatureKey) where T : BaseWebhookModel;
    }
}
