using Newtonsoft.Json;

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
