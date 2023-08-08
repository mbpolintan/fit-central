using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.AzureAD.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;

using DataAccess.Contexts;
using DataService.Constants.Policy;
using DataService.Utilities;
using Internal.Website.Authorization;
using DataAccess.Enums;
using DataService.Services;
using DataService.Services.Interfaces;
using DataService.ServiceModels;
using Microsoft.EntityFrameworkCore.Metadata;
using FluentValidation.AspNetCore;
using DataAccess.Validator;
using Microsoft.Graph;
using DataService.Providers;
using Group = DataAccess.Enums.Group;
using DataService.Infrastructure;

namespace Internal.Website
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddAuthentication(AzureADDefaults.AuthenticationScheme)
            //        .AddAzureAD(options => Configuration.Bind("AzureAd", options));

            services.AddAuthorization(options =>
            {
                options.AddPolicy(GroupPolicy.AllUsers, policy => policy.Requirements.Add(new GroupRequirement(Group.AllUsers)));
                options.AddPolicy(GroupPolicy.AllAdmin, policy => policy.Requirements.Add(new GroupRequirement(Group.AllAdmin)));
                options.AddPolicy(GroupPolicy.GlobalAdmin, policy => policy.Requirements.Add(new GroupRequirement(Group.GlobalAdmin)));

                options.AddPolicy(GroupPolicy.GlobalAdmin, policy => policy.Requirements.Add(new ModuleRequirement(Group.AllAdmin, Module.BillingConfig)));
                options.AddPolicy(GroupPolicy.GlobalAdmin, policy => policy.Requirements.Add(new ModuleRequirement(Group.AllAdmin, Module.ChallengeManagement)));
                options.AddPolicy(GroupPolicy.GlobalAdmin, policy => policy.Requirements.Add(new ModuleRequirement(Group.AllAdmin, Module.ScannerManagement)));
                options.AddPolicy(GroupPolicy.GlobalAdmin, policy => policy.Requirements.Add(new ModuleRequirement(Group.AllAdmin, Module.StudioLocation)));
                options.AddPolicy(GroupPolicy.GlobalAdmin, policy => policy.Requirements.Add(new ModuleRequirement(Group.AllAdmin, Module.ManagerAdmin)));
                options.AddPolicy(GroupPolicy.GlobalAdmin, policy => policy.Requirements.Add(new ModuleRequirement(Group.AllAdmin, Module.ScoringTemplate)));
                options.AddPolicy(GroupPolicy.GlobalAdmin, policy => policy.Requirements.Add(new ModuleRequirement(Group.AllAdmin, Module.ClubsManagement)));

                options.AddPolicy(GroupPolicy.GlobalAdmin, policy => policy.Requirements.Add(new ModuleRequirement(Group.GlobalAdmin, Module.TrainingGym)));
                options.AddPolicy(GroupPolicy.GlobalAdmin, policy => policy.Requirements.Add(new ModuleRequirement(Group.GlobalAdmin, Module.UserAdmin)));

            });

            services.AddSingleton<IAuthorizationHandler, GroupAuthorizationHandler>();
            services.AddSingleton<IAuthorizationHandler, ModuleAuthorizationHandler>();
            services.AddTransient<IClaimsTransformation, ClaimsTransformation>();

            services.AddRazorPages()
                    .AddMvcOptions(options =>
                    {
                        var policy = new AuthorizationPolicyBuilder()
                            .RequireAuthenticatedUser()
                            .Build();
                        options.Filters.Add(new AuthorizeFilter(policy));
                    })
                    .AddRazorPagesOptions(options =>
                {
                    options.Conventions.AuthorizeFolder("/Billing");
                    options.Conventions.AuthorizeFolder("/Challenges");
                    options.Conventions.AuthorizeFolder("/GlobalAdmin");
                    options.Conventions.AuthorizeFolder("/Members");
                    options.Conventions.AuthorizeFolder("/Reports");
                    options.Conventions.AuthorizeFolder("/Scans");
                    options.Conventions.AuthorizeFolder("/Shared");
                    options.Conventions.AuthorizeFolder("/StudioAdmin");
                    options.Conventions.AuthorizePage("/Index");
                    options.Conventions.AuthorizePage("/Account");
                    options.Conventions.AuthorizePage("/Privacy");
                    options.Conventions.AuthorizePage("/Error");
                });

            // Add Services
            services.Configure<WebSolutionSettings>(Configuration.GetSection("WebSolutionSettings"));
            services.Configure<EmailSettings>(Configuration.GetSection("EmailSettings"));
            services.Configure<TwilioSettings>(Configuration.GetSection("TwilioSettings"));

            services.AddScoped<ICommunicationService, CommunicationService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<ISmsService, SmsService>();
            services.AddScoped<IMindBodyService, MindBodyService>();
            services.AddScoped<IMindBodyFullSync, MindBodyFullSync>();
            services.AddScoped<IScopedBackgroudService, ScopedBackgroudService>();
            services.AddScoped<IStudioService, StudioService>();
            services.AddScoped<IWebhookService, WebhookService>();
            services.AddScoped<ISyncMindBody, SyncMindBody>();
            services.AddScoped<IOutlookMailService, OutlookMailService>();
            services.AddScoped<IAzureActiveDirectoryService, AzureActiveDirectoryService>();
            services.AddScoped<IAuthenticationProvider, AzureAuthenticationProvider>();
            services.AddCors(options =>
            {
                string[] origins = Configuration.GetSection("CorsPolicy:Origins").Get<string[]>();

                options.AddPolicy("CorsPolicy",
                    builder => builder
                        .WithOrigins(origins)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            // Add Background Service
            services.AddHostedService<DataService.Services.BackgroundService>();
            services.AddSignalR();
            services.AddMvc()
                    .AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver())
                    .AddFluentValidation(config => config.RegisterValidatorsFromAssemblyContaining<AppUserValidator>());

            //services.AddTransient<IValidator<Person>, PersonValidator>();

            // Add the Kendo UI services to the services container.
            services.AddKendo();
            Syncfusion.Licensing.SyncfusionLicenseProvider.RegisterLicense("MzQ2NzA5QDMxMzgyZTMzMmUzMFAzbFh1RWxOQUkyVjJHOXFuYWxkdTFmTGgrYWFIT25McVdDZFc4OG00RXc9; MzQ2NzEwQDMxMzgyZTMzMmUzMGs3YnJwOWJ0R1hhUlRyVFp6Y3N6dFZQakhXaEFScFBvOEhNd3Y4Q2pscE09; MzQ2NzExQDMxMzgyZTMzMmUzMGdmVlRtRnRrNXFwRDNUS2hIdXJaVmFwaVJrK0NiM29jQTltbGlSNGlWR0E9; MzQ2NzEyQDMxMzgyZTMzMmUzMG1UWG9Hemd1NU0rRVpGdklHWGhMTlljQk5BTjM0UXB3K2l2S2VHby8xaDA9");

            services.AddDbContext<StudioCentralContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            services.AddApplicationInsightsTelemetry(Configuration["APPINSIGHTS_INSTRUMENTATIONKEY"]);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapControllers();
                endpoints.MapHub<SignalServer>("/signalServer");
            });
        }
    }
}
