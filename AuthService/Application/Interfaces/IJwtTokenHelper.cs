using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Application.Interfaces;

public interface IJwtTokenHelper
{
    string GenerateRefreshToken(IdentityUser user, IConfiguration configuration);
    Task<string> GenerateToken(IdentityUser user, IConfiguration configuration, UserManager<IdentityUser> userManager);
}
