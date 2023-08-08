using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.Utilities
{
    public static class MicrosoftGraphApiUtility
    {
        public const string SCHEME = "bearer";

        public static string GetBaseAddress()
        {
            return "https://graph.microsoft.com";
        }

        public static string GetBaseAddressVersion1()
        {
            return "https://graph.microsoft.com/v1.0";
        }

        public static string GetBetaAddress()
        {
            return "https://graph.microsoft.com/beta";
        }

        public static string GetMembersPerGroup(string groupId)
        {
            return $"https://graph.microsoft.com/beta/groups/{groupId}/members";
        }
        public static string GetSiteEmails()
        {
            return "https://graph.microsoft.com/v1.0/users/AppDev@bettstechnologies.com/messages";
        }


    }
}
