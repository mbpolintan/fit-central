using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class VwVisits
    {
        public string ClientId { get; set; }
        public string DisplayName { get; set; }
        public int? MemberStatusId { get; set; }
        public int? SiteId { get; set; }
        public string Time { get; set; }
        public string Description { get; set; }
        public string Teacher { get; set; }
        public string Status { get; set; }
        public string PaymentInfo { get; set; }
        public string LateCancelled { get; set; }
        public string SignedIn { get; set; }
        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
    }
}
