using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class ScanChartViewModel
    {
        public List<string> TestDateTime { get; set; }
        public List<string> InBodyScore { get; set; }
        public List<string> Weight { get; set; }
        public List<string> Pbf { get; set; }
        public List<string> Smm { get; set; }
        public List<string> Vfl { get; set; }       

    }
}
