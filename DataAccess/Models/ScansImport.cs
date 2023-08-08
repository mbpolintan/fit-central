using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ScansImport
    {
        public ScansImport()
        {
            Scan = new HashSet<Scan>();
        }

        public int ScansImportId { get; set; }
        public int ScannerId { get; set; }
        public DateTime ImportDate { get; set; }
        public int ScanCount { get; set; }
        public int? UpdatedScans { get; set; }
        public int? CreatedScans { get; set; }
        public string ImportedFileName { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
        public virtual Scanner Scanner { get; set; }
        public virtual ICollection<Scan> Scan { get; set; }
    }
}
