using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Mbcontract
    {
        public Mbcontract()
        {
            UpcomingAutopayEvents = new HashSet<MbautopayEvents>();
        }

        public Guid MbcontractId { get; set; }
        public int Id { get; set; }
        public int? SiteId { get; set; }
        public string ClientId { get; set; }
        public int? OriginationLocationId { get; set; }
        public int? ContractId { get; set; }
        public string ContractName { get; set; }
        public DateTime? AgreementDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string AutopayStatus { get; set; }
        public int? ContractSoldByStaffId { get; set; }
        public string ContractSoldByStaffFirstName { get; set; }
        public string ContractSoldByStaffLastName { get; set; }
        public int? ContractOriginationLocation { get; set; }
        public bool? IsAutoRenewing { get; set; }

        public virtual ICollection<MbautopayEvents> UpcomingAutopayEvents { get; set; }

    }
}
