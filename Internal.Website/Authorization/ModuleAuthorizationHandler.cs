//using Internal.Website.Authorization.Claims;

using DataService.Constants.Claims;
using DataAccess.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Internal.Website.Authorization
{
    public class ModuleAuthorizationHandler : AuthorizationHandler<ModuleRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ModuleRequirement requirement)
        {
            if (!context.User.HasClaim(c => c.Type == CustomClaimTypes.Groups))
            {
                return Task.CompletedTask;
            }
            else
            {
                var groupClaim = context.User.Claims.FirstOrDefault(x => x.Type == CustomClaimTypes.Groups);

                if (groupClaim != null)
                {
                    var groups = JsonConvert.DeserializeObject<List<UserTokenViewModel>>(groupClaim.Value);

                    foreach (var group in groups)
                    {
                        // Checking for All users = 101
                        if (requirement.GroupId == 101)
                        {
                            if (group.Id == 1 || group.Id == 2 || group.Id == 3)
                            {
                                foreach (var module in group.Modules)
                                {
                                    if ((int)module.Id == requirement.ModuleId)
                                    {
                                        context.Succeed(requirement);
                                    }
                                }
                            }
                        }
                        // Checking for All Admin = 102 
                        else if (requirement.GroupId == 102)
                        {
                            if (group.Id == 1 || group.Id == 2)
                            {
                                foreach (var module in group.Modules)
                                {
                                    if ((int)module.Id == requirement.ModuleId)
                                    {
                                        context.Succeed(requirement);
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (group.Id == requirement.GroupId)
                            {
                                foreach (var module in group.Modules)
                                {
                                    if ((int)module.Id == requirement.ModuleId)
                                    {
                                        context.Succeed(requirement);
                                    }
                                }
                            }
                        }

                    }
                }
            }

            return Task.CompletedTask;
        }
    }
}
