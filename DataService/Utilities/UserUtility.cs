using DataService.Constants.Claims;
using System.Linq;
using System.Security.Claims;

namespace DataService.Utilities
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

            var email = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == CustomClaimTypes.Email);

            if (email != null)
            {
                return email.Value;
            }
            else
            {
                return null;
            }
           
        }

        public static int GetMemberId(this ClaimsPrincipal claimsPrincipal)
        {
            return int.Parse(claimsPrincipal.Claims.FirstOrDefault(x => x.Type == CustomClaimTypes.MemberId)?.Value);
        }

        public static string GetMemberFirstName(this ClaimsPrincipal claimsPrincipal)
        {
            return claimsPrincipal.Claims.FirstOrDefault(x => x.Type == CustomClaimTypes.FirstName)?.Value;
        }
    }
}
