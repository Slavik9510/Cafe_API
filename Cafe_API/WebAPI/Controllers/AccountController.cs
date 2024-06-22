using Cafe_API.Core.Entities;
using Cafe_API.Core.Interfaces;
using Cafe_API.WebAPI.DTOs.AppUser;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Cafe_API.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IRepository<AppUser> _repository;

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService,
            IRepository<AppUser> repository)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _repository = repository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
        {
            if (await UserExist(registerUserDto.Email))
            {
                return BadRequest("Email is already taken");
            }

            var user = new AppUser
            {
                UserName = registerUserDto.UserName.ToLower(),
                Email = registerUserDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerUserDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Customer");

            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            var dto = new
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
            };

            return Ok(dto);
        }

        private async Task<bool> UserExist(string email)
        {
            return (await _repository.FindAsync(u => u.Email == email)).FirstOrDefault() != null;
        }
    }
}
