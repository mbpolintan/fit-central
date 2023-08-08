using DataAccess.Enums;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Internal.Website.Authorization
{
    public class ModuleRequirement : IAuthorizationRequirement
    {

        public int GroupId { get; set; }
        public int ModuleId { get; set; }
        public ModuleRequirement(Group group, Module module)
        {
            GroupId = (int)group;
            ModuleId = (int)module;
        }
    }
}
