namespace Application.Models;
public sealed record ServiceResult
(
    bool Succeeded,
    string Message,
    int StatusCode
) 
{
    public static ServiceResult Success(string msg = "Success", int code = 200)
        => new(true, msg, code);

    public static ServiceResult Fail(string msg, int code = 400)
        => new(false, msg, code);
}

public sealed record ServiceResult<T>(
    bool Succeeded,
    string Message,
    int StatusCode,
    T? Data
    )
{
    public static ServiceResult<T> Success(T data, string msg = "Success", int code = 200)
        => new(true, msg, code, data);

    public static ServiceResult<T> Fail(string msg, int code = 400)
        => new(false, msg, code, default);
}

