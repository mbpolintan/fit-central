using StudioCentral.Authorization.Claims;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace StudioCentral.Utilities
{
    public static class UserUtility
    {
        public static int GetUserId(this ClaimsPrincipal claimsPrincipal)
        {
            return int.Parse(claimsPrincipal.Claims.FirstOrDefault(x => x.Type == CustomClaimTypes.UserId)?.Value);
        }

        public static int GetGroupId(this ClaimsPrincipal claimsPrincipal)
        {
            return int.Parse(claimsPrincipal.Claims.FirstOrDefault(x => x.Type == CustomClaimTypes.GroupId)?.Value);
        }
        public static string GetEmail(this ClaimsPrincipal claimsPrincipal)
        {
            return claimsPrincipal.Claims.FirstOrDefault(x => x.Type == CustomClaimTypes.Email).Value;
        }        
    }
}
