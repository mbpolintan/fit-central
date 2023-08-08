using System;

namespace DataService.ViewModels
{
    public class ContractEventData 
    {
        public int? SiteId { get; set; }
        public string ClientId { get; set; }
        public int? ClientUniqueId { get; set; }
        public string ClientFirstName { get; set; }
        public string ClientLastName { get; set; }
        public string ClientEmail { get; set; }
        public DateTime? AgreementDateTime { get; set; }
        public int? ContractSoldByStaffId { get; set; }
        public string ContractSoldByStaffFirstName { get; set; }
        public string ContractSoldByStaffLastName { get; set; }
        public int? ContractOriginationLocation { get; set; }
        public int? ContractId { get; set; }
        public string ContractName { get; set; }
        public int? ClientContractId { get; set; }
        public DateTime? ContractStartDateTime { get; set; }
        public DateTime? ContractEndDateTime { get; set; }
        public bool? IsAutoRenewing { get; set; }
    }
}
