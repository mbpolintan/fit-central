using System.Collections.Generic;

namespace DataService.ViewModels
{
    public partial class SalesRep
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Id { get; set; }
        public int SalesRepNumber { get; set; }
        public List<int> SalesRepNumbers { get; set; }
    }
}
