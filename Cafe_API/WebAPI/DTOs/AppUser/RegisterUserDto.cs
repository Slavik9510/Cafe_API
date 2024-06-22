using System.ComponentModel.DataAnnotations;

namespace Cafe_API.WebAPI.DTOs.AppUser
{
    public class RegisterUserDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Password { get; set; }
    }
}
