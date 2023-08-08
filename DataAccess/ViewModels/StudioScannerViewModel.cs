using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.ViewModels
{
    public class StudioScannerViewModel
    {
        public int StudioScannerId { get; set; }
        [DisplayName("Studio")]
        public int StudioId { get; set; }
        [DisplayName("Scanner")]
        public int ScannerId { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        [Timestamp]
        public byte[] TimeStamp { get; set; }
    }
}
