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

namespace StudioCentral_External.Authorization
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
            var user = _context.Member.Where(x => x.Email == email).FirstOrDefault();
            if (user != null)
            {
                claimsIdentity.AddClaim(new Claim(CustomClaimTypes.FirstName, user.FirstName));
                claimsIdentity.AddClaim(new Claim(CustomClaimTypes.Email, email));
                claimsIdentity.AddClaim(new Claim(CustomClaimTypes.MemberId, user.MemberId.ToString()));
            }    

            return Task.FromResult(principal);
        }
    }
}
