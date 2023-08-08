using System.Threading.Tasks;

namespace DataService.Services.Interfaces
{
    public interface IScopedBackgroudService
    {
 
        Task DoWorkAsync();
        Task SyncWebhook();
        Task Validation();
    }
}
