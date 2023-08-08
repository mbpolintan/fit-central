using DataAccess.Models;
using DataService.ServiceModels;
using DataService.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataService.Services.Interfaces
{
    public interface IMindBodyFullSync
    {
        public Task GetMindBodyFullSyncAsync();
        public Task<string> GetuserTokenAsync(int siteId, int studioId);
        public Task ManualFullSync(Mbinterface site);

        public Task<string> GetMindBodyClientsAsync(int offset, string siteId, string token, int studioId);
        public Task SyncClientsFromMindBodyAsync(Mbinterface mbInterface, int userId);
        public Task UpdateMbClientInfoAsync(ClientInfo client, string mobileNo);

        public Task SyncClientVisitsFromMindBodyAsync(Mbinterface mbInterface, MbclientInfo mbclientInfo, string token);
        public Task<string> MindbodyClientVisitsAsync(SyncVisitsParamViewModel param);

        public Task SyncClientPurchasesFromMindBodyAsync(Mbinterface mbInterface, MbclientInfo mbclientInfo);
        public Task<string> MindbodyClientPurchaseAsync(int offset, string siteId, string clientId, string startDate, int studioId);
        public Task InsertClientsPurchasesAsync(Mbpurchases purchase, int siteId, string clientId);

        public Task SyncClientContractFromMindBodyAsync(Mbinterface mbInterface, MbclientInfo mbclientInfo);
        public Task SyncClientActiveMembershipFromMindBody(Mbinterface mbInterface, MbclientInfo mbclientInfo, string token);

        public Task SyncClientDirectDebitFromMindBodyAsync(Mbinterface mbInterface, Member mbclientInfo, string token);
        public Task SyncMemberDirectDebitInfoAsync();
    
    }
}
