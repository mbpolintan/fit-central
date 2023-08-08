using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class MbclientCreaditCard
    {
        public int MemberCreaditCardId { get; set; }
        public Guid MbclientId { get; set; }
        public int? MbuniqueId { get; set; }
        public int? SiteId { get; set; }
        public string Address { get; set; }
        public string CardHolder { get; set; }
        public string CardNumber { get; set; }
        public string CardType { get; set; }
        public string City { get; set; }
        public string ExpMonth { get; set; }
        public string ExpYear { get; set; }
        public string LastFour { get; set; }
        public string PostalCode { get; set; }
        public string State { get; set; }
    }
}
