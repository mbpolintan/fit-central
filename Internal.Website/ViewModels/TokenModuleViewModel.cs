using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class TokenModuleViewModel
    {
        [JsonProperty("id")]
        public dynamic Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("FullControl")]
        public bool AccessType { get; set; }
    }
}
