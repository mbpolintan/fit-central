using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class MbautopayEvents
    {
        public int AutoPatEventId { get; set; }
        public Guid MbcontractId { get; set; }
        public int? ClientContractId { get; set; }
        public decimal? ChargeAmount { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime? ScheduleDate { get; set; }

        public virtual Mbcontract Mbcontract { get; set; }
    }
}
