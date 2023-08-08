using System;

namespace DataAccess.ViewModels
{
    public class ContractsViewModel
    {
        public int Id { get; set; }
        public int? SiteId { get; set; }
        public string ClientId { get; set; }
        public int? OriginationLocationId { get; set; }
        public string ContractName { get; set; }
        public DateTime? AgreementDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string AutopayStatus { get; set; }
    }

}
