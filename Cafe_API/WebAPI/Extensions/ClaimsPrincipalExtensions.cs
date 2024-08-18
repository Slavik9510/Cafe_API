using System.Security.Claims;

namespace Cafe_API.WebAPI.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static int? TryGetUserId(this ClaimsPrincipal user)
        {
            var claimValue = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(claimValue, out int userId))
            {
                return userId;
            }

            return null;
        }
    }
}
