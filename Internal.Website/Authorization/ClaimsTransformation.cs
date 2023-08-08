//using Internal.Website.Authorization.Claims;

using DataService.Constants.Claims;
using DataAccess.ViewModels;
using DataAccess.Contexts;
using Microsoft.AspNetCore.Authentication;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Internal.Website.Authorization
{
    public class ClaimsTransformation : IClaimsTransformation
    {
        private readonly StudioCentralContext _context;
        public ClaimsTransformation(StudioCentralContext context)
        {
            _context = context;
        }

        public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            var claimsIdentity = (ClaimsIdentity)principal.Identity;
            var emailIdentity = principal.Identity.Name;
            var email = string.Empty;

            if (emailIdentity.Contains("#"))
            {
                var stringEmail = emailIdentity.Split("#");
                email = stringEmail[1];
            }
            else
            {
                email = emailIdentity;
            }

            //validate user
            var user = _context.AppUser.Where(x => x.UserEmail == email).FirstOrDefault();
            if (user != null)
            {
                var access = new List<UserTokenViewModel>
                {
                    new UserTokenViewModel
                    {
                        Id = user.AppGroupId,
                        UserId = user.AppUserId,
                        Name = _context.AppGroup.Where(x => x.AppGroupId == user.AppGroupId).FirstOrDefault().Description,
                        Modules = (from module in _context.AppModule
                                   join accessModule in _context.AppUserAccess on module.AppModuleId equals accessModule.AppModuleId
                                   where accessModule.AppUserId == user.AppUserId
                                   select new TokenModuleViewModel
                                   {
                                       Id = module.AppModuleId,
                                       Name = module.Description,
                                       AccessType = accessModule.AccessType
                                   })
                    .ToList()
                    }
                };
                claimsIdentity.AddClaim(new Claim(CustomClaimTypes.Email, email));
                claimsIdentity.AddClaim(new Claim(CustomClaimTypes.UserId, user.AppUserId.ToString()));
                claimsIdentity.AddClaim(new Claim(CustomClaimTypes.GroupId, user.AppGroupId.ToString()));
                claimsIdentity.AddClaim(new Claim(CustomClaimTypes.Groups, JsonConvert.SerializeObject(access)));
            }    

            return Task.FromResult(principal);
        }
    }
}
