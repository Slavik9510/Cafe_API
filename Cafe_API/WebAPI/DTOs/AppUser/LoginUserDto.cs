using System.ComponentModel.DataAnnotations;

namespace Cafe_API.WebAPI.DTOs.AppUser
{
    public class LoginUserDto
    {
        [Required]
        public string Login { get; set; } //Username or email
        [Required]
        public string Password { get; set; }
    }
}
