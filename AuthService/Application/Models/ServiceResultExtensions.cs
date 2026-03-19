using Microsoft.AspNetCore.Identity;

namespace Application.Models;
public static class ServiceResultExtensions
{
    public static ServiceResult FromIdentityResult(this IdentityResult result, string message)
    {
        var errors = result.Errors.Select(e => e.Description);
        return ServiceResult.Fail(message, 400, errors);
    }
    public static ServiceResult<T> FromIdentityResult<T>(this IdentityResult result, string message)
    {
        var errors = result.Errors.Select(e => e.Description);

        return ServiceResult<T>.Fail(message, 400, errors);
    }
}
