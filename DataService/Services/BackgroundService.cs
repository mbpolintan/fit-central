using DataAccess.Models;
using DataService.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DataService.Services
{
    public class BackgroundService : IHostedService, IDisposable
    {
        private readonly ILogger<BackgroundService> _logger;
        private Timer _timer;
        public IServiceProvider Services { get; }

        public IEnumerable<Mbinterface> Mbinterfaces { get; set; }

        public BackgroundService(ILogger<BackgroundService> logger,
                                IServiceProvider services)
        {
            _logger = logger;
            Services = services;
        }

        private void DoWork(object state)
        {
            var scope = Services.CreateScope();
            var scopedProcessingService = scope.ServiceProvider.GetRequiredService<IScopedBackgroudService>();
            scopedProcessingService.DoWorkAsync();           
        }
        private void SyncWebhook(object state)
        {
            var scope = Services.CreateScope();
            var scopedProcessingService = scope.ServiceProvider.GetRequiredService<IScopedBackgroudService>();
            scopedProcessingService.SyncWebhook();
        }

        private void Validation(object state)
        {

            //var day = DateTime.UtcNow.DayOfWeek.ToString();
            //if(day == "Sunday")
            //{
            //    var scope = Services.CreateScope();
            //    var scopedProcessingService = scope.ServiceProvider.GetRequiredService<IScopedBackgroudService>();
            //    scopedProcessingService.WeeklyValidation();
            //}

            //var time = DateTime.UtcNow.Hour;
            //if(time >= 13 && time <= 14)
            //{
                var scope = Services.CreateScope();
                var scopedProcessingService = scope.ServiceProvider.GetRequiredService<IScopedBackgroudService>();
                scopedProcessingService.Validation();
            //}


        }

        public void Dispose()
        {
            _timer?.Dispose();
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            //set when the service will run.
            //_timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromDays(1));
            //_timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromHours(1));
            //_timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromSeconds(60));

            _logger.LogInformation("Timed Hosted Service running.");    
            
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromHours(24));
            _timer = new Timer(Validation, null, TimeSpan.Zero, TimeSpan.FromHours(24));
            _timer = new Timer(SyncWebhook, null, TimeSpan.Zero, TimeSpan.FromHours(1));

            return Task.CompletedTask;
        }
        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Timed Hosted Service is stopping.");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

    }
}
