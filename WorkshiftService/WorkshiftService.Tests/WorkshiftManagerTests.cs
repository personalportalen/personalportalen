using Application.Dtos;
using Application.Interfaces;
using Application.Services.Managers;
using Domain.Entities;
using Moq;

namespace WorkshiftService.Tests;

public class WorkshiftManagerTests
{
    [Fact]
    public async Task CreateAsync_ShouldReturnSuccess()
    {
        var repository = new Mock<IWorkshiftRepository>();
        var bookingClient = new Mock<IBookingClient>();

        var manager = new WorkshiftManager(
            repository.Object,
            bookingClient.Object);

        var form = new WorkshiftRegistrationForm
        {
            Area = "Test",
            Level = "Junior",
            Starttime = DateTime.UtcNow,
            Endtime = DateTime.UtcNow.AddHours(8),
            EmployeeId = "employee-1"
        };

        var result = await manager.CreateAsync(form, "user-1");

        Assert.True(result.Succeeded);
    }

    [Fact]
    public async Task CreateAsync_ShouldAddAndSaveWorkshift()
    {
        var repository = new Mock<IWorkshiftRepository>();
        var bookingClient = new Mock<IBookingClient>();

        var manager = new WorkshiftManager(
            repository.Object,
            bookingClient.Object);

        var form = new WorkshiftRegistrationForm
        {
            Area = "Test",
            Level = "Junior",
            Starttime = DateTime.UtcNow,
            Endtime = DateTime.UtcNow.AddHours(8),
            EmployeeId = "employee-1"
        };

        await manager.CreateAsync(form, "user-1");

        repository.Verify(
            x => x.AddAsync(It.IsAny<WorkshiftEntity>()),
            Times.Once);

        repository.Verify(
            x => x.SaveAsync(),
            Times.Once);
    }
}