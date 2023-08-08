using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using DataService.Services.Interfaces;
using DataService.Constants.Policy;

namespace Internal.Website.Pages
{
    [Authorize(Policy = GroupPolicy.AllUsers)]
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly IStudioService _studioService;
        public IndexModel(ILogger<IndexModel> logger, IStudioService studioService)
        {
            _logger = logger;
            _studioService = studioService;
        }

        public void OnGet()
        {
            //var groupId = UserUtility.GetGroupId(User);
            //var userId = UserUtility.GetUserId(User);
            //ViewData["Studios"] = _studioService.GetStudios(groupId, userId);
            //_studioService.GetTimeZone();
        }

      

    }
}
