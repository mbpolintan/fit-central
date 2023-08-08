using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudioCentral.Authorization.Policy
{
    public class GroupPolicy
    {
        public const string AllUsers = "AllUsers";
        public const string AllAdmin = "Global/Owner";
        public const string GlobalAdmin = "GlobalAdmin";
    }
}
