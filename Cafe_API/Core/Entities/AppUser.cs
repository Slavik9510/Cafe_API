using Microsoft.AspNetCore.Identity;

namespace Cafe_API.Core.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public string Email { get; set; }
    }
}
