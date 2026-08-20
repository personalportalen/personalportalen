using Application.Models;

namespace Presentation.Models;

public class ApiResponse(bool succeeded, string msg, object? data = null)
{
    public bool Succeeded { get; set; } = succeeded;
    public string? Message { get; set; } = msg;
    public object? Data { get; set; } = data;

    public static ApiResponse FromServiceResult(ServiceResult result)
        => new(result.Succeeded, result.Message);
}
