using DataService.Services.Interfaces;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace DataService.Services
{
    public class ScopedBackgroudService : IScopedBackgroudService
    {

        public IHostEnvironment HostingEnvironment { get; set; }
        public IMindBodyService _mindBodyService { get; set; }
        public IMindBodyFullSync _mindBodyFullSync { get; set; }

        public ISyncMindBody _syncMindBody { get; set; }
        private readonly ILogger _logger;

        public ScopedBackgroudService(IHostEnvironment hostingEnvironment,
                                    ILogger<ScopedBackgroudService> logger,
                                    IMindBodyService mindBodyService,
                                    IMindBodyFullSync mindBodyFullSync,
                                    ISyncMindBody syncMindBody)
        {
            HostingEnvironment = hostingEnvironment;
            _mindBodyFullSync = mindBodyFullSync;
            _mindBodyService = mindBodyService;
            _logger = logger;
            _syncMindBody = syncMindBody;
        }

        public async Task DoWorkAsync()
        {
        }

        public async Task SyncWebhook()
        {
            _logger.LogInformation("===============INITIATE BACKGROUND SERVICE - SyncWebhook() ===============");
            await _syncMindBody.SyncWebhookAsync();
        }

        public async Task Validation()
        {
            //_logger.LogInformation("===============INITIATE BACKGROUND SERVICE - Validation ===============");
            await Task.Run(() => _mindBodyFullSync.GetMindBodyFullSyncAsync());
            await Task.Run(() => _mindBodyService.GetClassesAndClassSchedule()); 
        }
    }
}
