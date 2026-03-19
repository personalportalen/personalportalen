using Application.Dtos;
using Application.Interfaces;
using Application.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace Application.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<UserManager<IdentityUser>> _userManagerMock;
    private readonly Mock<SignInManager<IdentityUser>> _signInManagerMock;
    private readonly Mock<RoleManager<IdentityRole>> _roleManagerMock;

    private readonly Mock<IConfiguration> _configurationMock;

    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        var userStore = new Mock<IUserStore<IdentityUser>>();

        _userManagerMock = new Mock<UserManager<IdentityUser>>(
            userStore.Object,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        );

        var contextAccessor = new Mock<IHttpContextAccessor>();
        var userPrincipalFactory = new Mock<IUserClaimsPrincipalFactory<IdentityUser>>();
        var options = new Mock<IOptions<IdentityOptions>>();
        var logger = new Mock<ILogger<SignInManager<IdentityUser>>>();
        var schemes = new Mock<IAuthenticationSchemeProvider>();

        _signInManagerMock = new Mock<SignInManager<IdentityUser>>(
            _userManagerMock.Object,
            contextAccessor.Object,
            userPrincipalFactory.Object,
            options.Object,
            logger.Object,
            schemes.Object
        );

        var roleStore = new Mock<IRoleStore<IdentityRole>>();

        _roleManagerMock = new Mock<RoleManager<IdentityRole>>(
            roleStore.Object,
            null,
            null,
            null,
            null
        );

        _configurationMock = new Mock<IConfiguration>();
        var jwtHelperMock = new Mock<IJwtTokenHelper>();

        _authService = new AuthService(
            _userManagerMock.Object,
            _signInManagerMock.Object,
            _roleManagerMock.Object,
            _configurationMock.Object,
            jwtHelperMock.Object
        );
    }

    [Fact]
    public async Task SignUpAsync_ShouldFail_WhenEmailAlreadyExists()
    {
        // Arrange
        var request = new SignUpRequestDto
        {
            Email = "test@test.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        _userManagerMock
            .Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync(new IdentityUser());

        // Act
        var result = await _authService.SignUpAsync(request);

        // Assert
        result.Succeeded.Should().BeFalse();
        result.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task SignUpAsync_ShouldFail_WhenPasswordsDoNotMatch()
    {
        // Arrange
        var request = new SignUpRequestDto
        {
            Email = "test@test.com",
            Password = "Password123!",
            ConfirmPassword = "DifferentPassword!"
        };

        _userManagerMock
            .Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync((IdentityUser)null);

        // Act
        var result = await _authService.SignUpAsync(request);

        // Assert
        result.Succeeded.Should().BeFalse();
        result.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task SignUpAsync_ShouldCreateUser_WhenDataIsValid()
    {
        // Arrange
        var request = new SignUpRequestDto
        {
            Email = "test@test.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        _userManagerMock
            .Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync((IdentityUser)null);

        _userManagerMock
            .Setup(x => x.CreateAsync(It.IsAny<IdentityUser>(), request.Password))
            .ReturnsAsync(IdentityResult.Success);

        _roleManagerMock
            .Setup(x => x.RoleExistsAsync("Anställd"))
            .ReturnsAsync(true);

        _userManagerMock
            .Setup(x => x.AddToRoleAsync(It.IsAny<IdentityUser>(), "Anställd"))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _authService.SignUpAsync(request);

        // Assert
        result.Succeeded.Should().BeTrue();
        result.Data.Should().NotBeNull();
    }

    [Fact]
    public async Task SignInAsync_ShouldFail_WhenUserNotFound()
    {
        // Arrange
        var request = new SignInRequestDto
        {
            Email = "missing@test.com",
            Password = "Password123!"
        };

        _userManagerMock
            .Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync((IdentityUser)null);

        // Act
        var result = await _authService.SignInAsync(request);

        // Assert
        result.Succeeded.Should().BeFalse();
        result.StatusCode.Should().Be(404);
    }

    [Fact]
    public async Task SignOutAsync_ShouldReturnSuccess()
    {
        // Arrange
        _signInManagerMock
            .Setup(x => x.SignOutAsync())
            .Returns(Task.CompletedTask);

        // Act
        var result = await _authService.SignOutAsync();

        // Assert
        result.Succeeded.Should().BeTrue();
    }

    [Fact]
    public async Task UserExists_ShouldReturnTrue_WhenUserExists()
    {
        // Arrange
        _userManagerMock
            .Setup(x => x.FindByEmailAsync("test@test.com"))
            .ReturnsAsync(new IdentityUser());

        var request = new VerifyEmailRequestDto
        {
            Email = "test@test.com"
        };

        // Act
        var result = await _authService.UserExists(request);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task UserExists_ShouldReturnFalse_WhenUserDoesNotExist()
    {
        // Arrange
        _userManagerMock
            .Setup(x => x.FindByEmailAsync("missing@test.com"))
            .ReturnsAsync((IdentityUser)null);

        var request = new VerifyEmailRequestDto
        {
            Email = "test@test.com"
        };

        // Act
        var result = await _authService.UserExists(request);

        // Assert
        result.Should().BeFalse();
    }
}