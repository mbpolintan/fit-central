namespace DataService.ViewModels
{
    public class MembershipEventData
    {
        public int SiteId { get; set; }       
        public string ClientId { get; set; }
        public int ClientUniqueId { get; set; }   
        public string ClientFirstName { get; set; }
        public string ClientLastName { get; set; }
        public string ClientEmail { get; set; }
        public int MembershipId { get; set; }
        public string MembershipName { get; set; }

    }


}
