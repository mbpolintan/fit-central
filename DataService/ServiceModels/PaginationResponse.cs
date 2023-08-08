using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.ServiceModels
{
    public class PaginationResponse
    {
        public int RequestedLimit { get; set; }
        public int RequestedOffset { get; set; }
        public int PageSize { get; set; }
        public int TotalResults { get; set; }

    }
}
