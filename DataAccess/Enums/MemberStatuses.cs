using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.Enums
{
    public enum MemberStatuses
    {
        Active = 1,
        Expired = 2,
        NonMember = 3,
        Terminated = 4,
        Suspended = 5,
        Declined = 6,
        ActiveSuspended = 7,
        All = 8
    }

}
