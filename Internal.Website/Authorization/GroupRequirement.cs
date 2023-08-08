using DataAccess.Enums;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Internal.Website.Authorization
{
    public class GroupRequirement : IAuthorizationRequirement
    {
        public int GroupId { get; set; }
        public GroupRequirement(Group group)
        {
            GroupId = (int)group;
        }
    }
}
