namespace DataAccess.ViewModels
{
    public class PaymentMethodViewModel
    {
        public int PaymentMethodId { get; set; }
        public int? MemberId { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public int? PaymentSourceId { get; set; }
        public int? PaymentMethodTypeId { get; set; }
        public int? PaidByOtherMemberId { get; set; }   
             
        public string Source { get; set; }       
        public string MethodType { get; set; }       
        public string ForOtherMemberDisplayName { get; set; }      
    }
}
