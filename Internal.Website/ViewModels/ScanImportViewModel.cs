using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class ScanImportViewModel
    {
        public int ScansImportId { get; set; }
        public int ScannerId { get; set; }
        public string ScannerName { get; set; }
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
    }
}
