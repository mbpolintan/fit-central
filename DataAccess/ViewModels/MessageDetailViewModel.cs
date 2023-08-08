using System;

namespace DataAccess.ViewModels
{
    public class MessageDetailViewModel
    {
        public string Subject { get; set; }
        public int? MessageTypeId { get; set; }
        public string BodyContent { get; set; }
        public bool IsRead { get; set; }
        public bool IsAnonymousSender { get; set; }
        public string MessageDateTime { get; set; }
        public string MessageTime { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string EmailAddress { get; set; }
        public string MobilePhone { get; set; }
        public string PhotoUrl { get; set; }
        public byte[] Image { get; set; }
        public bool IsAdmin { get; set; }
    }
}
