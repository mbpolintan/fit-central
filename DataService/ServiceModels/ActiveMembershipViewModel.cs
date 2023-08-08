﻿using DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.ServiceModels
{
    public class ActiveMembershipViewModel
    {
        public Guid ActiveMembershipId { get; set; }
        public string ClientId { get; set; }
        public int? MembershipId { get; set; }
        public DateTime? ActiveDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        public int? Count { get; set; }
        public bool? Current { get; set; }
        public int? Id { get; set; }
        public int? ProductId { get; set; }
        public string Name { get; set; }
        public int? Remaining { get; set; }
        public int? SiteId { get; set; }
        public string Action { get; set; }
        public string IconCode { get; set; }
        public int? ProgramId { get; set; }

        public virtual Program Program { get; set; }
    }
}
