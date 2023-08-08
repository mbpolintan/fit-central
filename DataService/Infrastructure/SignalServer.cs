using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace DataService.Infrastructure
{
    public class SignalServer : Hub
    {
        //public override Task OnConnectedAsync()
        //{
        //    // Add your own code here.
        //    // For example: in a chat application, record the association between
        //    // the current connection ID and user name, and mark the user as online.
        //    // After the code in this method completes, the client is informed that
        //    // the connection is established; for example, in a JavaScript client,
        //    // the start().done callback is executed.
        //    return base.OnConnectedAsync();
        //}
    }
}
