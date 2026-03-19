using Application.Models;

namespace Presentation.Models;
public class ApiResponse
{
    public bool Succeeded { get; set; }
    
    public string Message { get; set; }
    public object? Data { get; set; }


    public ApiResponse(bool succeeded, string message, object? data = null)
    {
        Succeeded = succeeded;
        Message = message;
        Data = data;
    }

    public static ApiResponse FromServiceResult(ServiceResult result)
     => new(result.Succeeded, result.Message);

    public static ApiResponse FromServiceResult<T>(ServiceResult<T> result)
        => new(result.Succeeded, result.Message, result.Data);
}
