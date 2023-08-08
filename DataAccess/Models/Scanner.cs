using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace DataAccess.Models
{
    public partial class Scanner
    {
        public Scanner()
        {
            ScansImport = new HashSet<ScansImport>();
            StudioScanner = new HashSet<StudioScanner>();
        }

        public int ScannerId { get; set; }
        [DisplayName("Scanner Name")]
        public string ScannerName { get; set; }
        [DisplayName("Serial Number")]
        public string SerialNo { get; set; }
        [DisplayName("Purchase Date")]
        public DateTime? PurchaseDate { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
        public virtual ICollection<ScansImport> ScansImport { get; set; }
        public virtual ICollection<StudioScanner> StudioScanner { get; set; }
    }
}
