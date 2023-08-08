using Newtonsoft.Json;
using System.Collections.Generic;

namespace DataAccess.ViewModels
{
    public class UserTokenViewModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("userId")]
        public int UserId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("module")]
        public IEnumerable<TokenModuleViewModel> Modules { get; set; }

        public UserTokenViewModel()
        {
            Modules = new List<TokenModuleViewModel>();
        }
    }
}
