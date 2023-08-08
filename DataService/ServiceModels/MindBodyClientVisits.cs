using DataAccess.Models;
using DataAccess.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.ServiceModels
{
    public class MindBodyClientVisits
    {
        public MindBodyClientVisits()
        {
            Visits = new List<ClientVisitsViewModel>();
        }
        public PaginationResponse PaginationResponse { get; set; }
        public IEnumerable<ClientVisitsViewModel> Visits { get; set; }
    }
}
