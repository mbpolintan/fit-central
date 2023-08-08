using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataService.Services.Interfaces
{
    public interface IOutlookMailService
    {
        public Task GetEmails();
        public Task ReadContacts();
    }
}
