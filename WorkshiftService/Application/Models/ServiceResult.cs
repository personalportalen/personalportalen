namespace Application.Models;
public class ServiceResult
{
    public bool Succeeded { get; set; }
    public string Message { get; set; } = null!;
}

public class ServiceResult<T> : ServiceResult
{
    public T? Result { get; set; }
}
