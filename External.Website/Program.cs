using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Compact;

namespace StudioCentral_External
{
    public class Program
    {
       public static Task Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.Map(
                    keyPropertyName: "Name",
                    defaultKey: "application",
                    configure: (name, configuration) =>
                        configuration.File(
                            formatter: new CompactJsonFormatter(),
                            path: $"./logs/log-{name}.json",
                            rollingInterval: RollingInterval.Day))
                .CreateLogger();

            try
            {
                Log.Information("Starting web host");

                var host = CreateWebHostBuilder(args).Build();

                #region Database Seeders and Initializers

                using (var scope = host.Services.CreateScope())
                {
                    var services = scope.ServiceProvider;

                    try
                    {

                    }
                    catch (Exception ex)
                    {
                        var logger = services.GetRequiredService<ILogger<Program>>();
                        logger.LogError(ex, "An error occurred while seeding the database.");
                    }
                }

                #endregion

                host.Run();

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly");
                return Task.FromException(ex);
            }
            finally
            {
                Log.CloseAndFlush();
            }
           
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                //.UseAzureAppServices()
                .UseStartup<Startup>()
                .UseSerilog();

    }
}
