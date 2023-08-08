using DataAccess.Models;
using DataAccess.ViewModels;
using DataService.ServiceModels;
using DataService.ViewModels;
using System.Threading.Tasks;

namespace DataService.Services.Interfaces
{
    public interface IMindBodyService
    {
        public string GetUserToken(int siteId, int studioId);
        void LogCall(MbwebApi api, int siteId, int studioId);   
        
        void GetProducts(Mbinterface mbInterface, string username); 
      
        public MindbodyActivationCodeLink GetActivationCode(int siteId);           
        public MBPaymentTransactionViewModel CheckoutShoppingCart(BillingParamViewModel param);

        public Task<ClientViewModel> UpdateMemberProfileAsync(Mbinterface mbInterface, ClientViewModel member);
        public Task<ClientViewModel> AddMemberAsync(Mbinterface mbInterface, ClientViewModel member);

        //public Task GetCustomVisits();      
        public string MindbodyClientVisits(SyncVisitsParamViewModel param);
        
        void VisitsValidationServices(Mbinterface mbInterface);
        public bool ValidateMembersVisits(ValidateMemberVisitsViewModel param);

        public Task GetClassesAndClassSchedule();
        public Task GetClientVisits();

        //public string MindbodyCustomClientVisits(SyncVisitsParamViewModel param);
    }
}
