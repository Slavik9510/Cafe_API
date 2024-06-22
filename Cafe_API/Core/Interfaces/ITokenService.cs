using Cafe_API.Core.Entities;

namespace Cafe_API.Core.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
    }
}
