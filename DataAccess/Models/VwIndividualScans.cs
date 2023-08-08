using System;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models
{
    public partial class VwIndividualScans
    {
        public int? MemberId { get; set; }
        public int ScanId { get; set; }
        public string DisplayName { get; set; }
        public int? StudioId { get; set; }
        public DateTime? TestDateTime { get; set; }
        public byte? BillStatus { get; set; }
    }
}
