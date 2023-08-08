namespace DataAccess.ViewModels
{
    public class MessageListViewModel
    {
        public string Subject { get; set; }
        public int? MessageTypeId { get; set; }
        public string BodyContent { get; set; }
        public int Classification { get; set; }
        public int NewMessage { get; set; }
        public bool IsAnonymousSender { get; set; }     
        public string Name { get; set; }
        public string DisplayName { get; set; }  
        public string SenderMobilePhone { get; set; }
        public string EmailAddress { get; set; }
        public string PhotoUrl { get; set; }
        public byte[] Image { get; set; }  
    }
}
