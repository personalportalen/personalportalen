namespace Presentation.Helpers;

public class CookieService(IWebHostEnvironment env)
{
    private readonly IWebHostEnvironment _env = env;

    public CookieOptions CreateAccessTokenCookie()
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = !_env.IsDevelopment(),
            SameSite = _env.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(15)
        };
    }

    public CookieOptions CreateRefreshTokenCookie()
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = !_env.IsDevelopment(),
            SameSite = _env.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        };
    }
}
