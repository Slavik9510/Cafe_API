using Microsoft.AspNetCore.Identity;

namespace Cafe_API.Core.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
