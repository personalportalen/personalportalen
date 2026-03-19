namespace Application.Dtos;
public class SignInResponseDto
{
    public string Token { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}
