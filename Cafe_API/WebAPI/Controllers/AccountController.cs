using Cafe_API.Core.Entities;
using Cafe_API.Core.Interfaces;
using Cafe_API.WebAPI.DTOs.AppUser;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            if (await UserExistEmail(registerUserDto.Email))
            {
                return BadRequest("Email is already taken");
            }
            if (await UserExistUsername(registerUserDto.UserName))
            {
                return BadRequest("Username is already taken");
            }

            var user = new AppUser
            {
                Email = registerUserDto.Email,
                UserName = registerUserDto.UserName
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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginDto)
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.UserName == loginDto.Login || x.Email == loginDto.Login);

            if (user == null) return Unauthorized("Invalid username or email address");

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result) return Unauthorized("Invalid password");

            var dto = new
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
            };

            return Ok(dto);
        }

        private async Task<bool> UserExistEmail(string email)
        {
            return (await _repository.FindAsync(u => u.Email == email)).FirstOrDefault() != null;
        }
        private async Task<bool> UserExistUsername(string username)
        {
            return (await _repository.FindAsync(u => u.UserName == username)).FirstOrDefault() != null;
        }
    }
}
