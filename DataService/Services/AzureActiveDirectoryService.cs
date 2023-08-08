using DataService.Services.Interfaces;
using DataService.Utilities;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using AzureADUser = Microsoft.Graph.User;
using AzureADGroup = Microsoft.Graph.Group;

namespace DataService.Services
{
    public class AzureActiveDirectoryService : IAzureActiveDirectoryService
    {
        private readonly ILogger<AzureActiveDirectoryService> _logger;
        private readonly IAuthenticationProvider _authProvider;


        public AzureActiveDirectoryService(
            ILogger<AzureActiveDirectoryService> logger,
            IAuthenticationProvider authProvider)
        {
            _logger = logger;
            _authProvider = authProvider;
        }

        public async Task GetToken()
        {
            try
            {
                GraphServiceClient graphClient = new GraphServiceClient(_authProvider)
                {
                    BaseUrl = MicrosoftGraphApiUtility.GetBetaAddress()
                };

                IGraphServiceUsersCollectionPage users = await graphClient.Users.Request().Top(500).GetAsync(); // The hard coded Top(500) is what allows me to pull all the users, the blog post did this on a param passed in
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                throw;
            }
        }
        public async Task<IEnumerable<AzureADUser>> GetAllUsers()
        {
            try
            {
                List<AzureADUser> userResult = new List<AzureADUser>();

                GraphServiceClient graphClient = new GraphServiceClient(_authProvider);
                graphClient.BaseUrl = MicrosoftGraphApiUtility.GetBetaAddress();

                IGraphServiceUsersCollectionPage users = await graphClient.Users.Request().Top(500).GetAsync(); // The hard coded Top(500) is what allows me to pull all the users, the blog post did this on a param passed in
                userResult.AddRange(users);

                while (users.NextPageRequest != null)
                {
                    users = await users.NextPageRequest.GetAsync();
                    userResult.AddRange(users);
                }

                return userResult;
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new List<AzureADUser>();
            }
        }
        public async Task<IEnumerable<AzureADGroup>> GetAllGroups()
        {
            try
            {
                List<AzureADGroup> groupResult = new List<AzureADGroup>();

                GraphServiceClient graphClient = new GraphServiceClient(_authProvider);
                graphClient.BaseUrl = MicrosoftGraphApiUtility.GetBetaAddress();

                IGraphServiceGroupsCollectionPage groups = await graphClient.Groups.Request().Top(500).GetAsync(); // The hard coded Top(500) is what allows me to pull all the users, the blog post did this on a param passed in
                groupResult.AddRange(groups);

                while (groups.NextPageRequest != null)
                {
                    groups = await groups.NextPageRequest.GetAsync();
                    groupResult.AddRange(groups);
                }

                return groupResult;
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new List<AzureADGroup>();
            }
        }
        public async Task<IEnumerable<DirectoryObject>> GetAllMembers(string groupId)
        {
            List<DirectoryObject> userResult = new List<DirectoryObject>();

            try
            {
                GraphServiceClient graphClient = new GraphServiceClient(_authProvider);
                graphClient.BaseUrl = MicrosoftGraphApiUtility.GetBetaAddress();

                IGroupMembersCollectionWithReferencesPage users = await graphClient.Groups[groupId].Members.Request().Top(500).GetAsync(); // The hard coded Top(500) is what allows me to pull all the users, the blog post did this on a param passed in

                userResult.AddRange(users);

                while (users.NextPageRequest != null)
                {
                    users = await users.NextPageRequest.GetAsync();
                    userResult.AddRange(users);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
            }

            return userResult;
        }
    }
}
