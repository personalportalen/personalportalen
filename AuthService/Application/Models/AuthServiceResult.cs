namespace Presentation.Models;
public class AuthServiceResult
{
    public bool Succeeded { get; set; }
    public int StatusCode { get; set; }
    public string? Message { get; set; }
}
