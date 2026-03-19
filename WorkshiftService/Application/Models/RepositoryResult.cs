
namespace Application.Models;
public class RepositoryResult
{
    public bool Succeeded { get; set; }
    public string? Error { get; set; }
}

public class RepositoryResult<T> : RepositoryResult
{
    public T? Result { get; set; }
}

