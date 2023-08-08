using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.Contexts;
using DataAccess.Models;
using DataAccess.ViewModels;
using DataService.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace StudioCentral_External.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly StudioCentralContext _context;
        private readonly IMemoryCache _cache;

        public IndexModel(ILogger<IndexModel> logger, StudioCentralContext context, IMemoryCache cache)
        {
            _logger = logger;
            _context = context;
            _cache = cache;
        }

        [BindProperty]
        public IEnumerable<MemberStudioViewModel> Members { get; set; }

        [BindProperty]
        public IEnumerable<Studio> Studios { get; set; }

        public void OnGet()
        {
            if (_cache.Get("MemberId_" + User.Identity.Name) == null)
            {
                _cache.Remove("MemberId_" + User.Identity.Name);
            }
            var email = UserUtility.GetEmail(User);

            if(email != null)
            {
                Members = _context.uspGetMemberStudio(email);
            }
            else
            {
                Redirect("/login");
            }           
           


        }

        public JsonResult OnPostAssignMemberId(int memberId, string studio)
        {
            var success = false;
            try
            {
                if (_cache.Get("MemberId_" + User.Identity.Name) == null)
                {
                    _cache.Remove("MemberId_" + User.Identity.Name);
                }
                if (_cache.Get("Studio_" + User.Identity.Name) == null)
                {
                    _cache.Remove("Studio_" + User.Identity.Name);
                }

                _cache.Set("Studio_" + User.Identity.Name, studio);
                _cache.Set("MemberId_" + User.Identity.Name, memberId);                
                success = true;
            }
            catch (Exception ex)
            {

            }
            return new JsonResult(new { success });
        }
    }
}
