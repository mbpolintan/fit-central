using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Graph;
using AzureADUser = Microsoft.Graph.User;
using AzureADGroup = Microsoft.Graph.Group;
namespace DataService.Services.Interfaces
{
    public interface IAzureActiveDirectoryService
    {
        Task GetToken();
        Task<IEnumerable<AzureADUser>> GetAllUsers();
        Task<IEnumerable<AzureADGroup>> GetAllGroups();
        Task<IEnumerable<DirectoryObject>> GetAllMembers(string groupId);
    }
}
