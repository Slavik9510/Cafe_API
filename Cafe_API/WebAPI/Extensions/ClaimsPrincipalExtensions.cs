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
        public static string? TryGetUserName(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }

        public static string[] GetUserRoles(this ClaimsPrincipal user)
        {
            return user.FindAll(ClaimTypes.Role).Select(x => x.Value).ToArray();
        }
    }
}
