using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataService.Services.Interfaces
{
    public interface ISyncMindBody
    {
        public Task SyncWebhookAsync();
        public Task SyncClientDetails(int siteId);
        public Task SyncClientClassBooking(int siteId);
        public Task SyncClientContract(int siteId);
        public Task SyncClientSale(int siteId);
        public Task SyncClientMembership(int siteId);
        public Task SyncClientVisitClassDescription(int siteId, int studioId);
    }
}
