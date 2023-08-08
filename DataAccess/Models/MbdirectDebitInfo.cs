using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class MbdirectDebitInfo
    {
        public int MbdirectDebitInfoId { get; set; }
        public string ClientId { get; set; }
        public int MbuniqueId { get; set; }
        public int SiteId { get; set; }
        public int StudioId { get; set; }
        public string NameOnAccount { get; set; }
        public string RoutingNumber { get; set; }
        public string AccountNumber { get; set; }
        public string AccountType { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }
    }
}
