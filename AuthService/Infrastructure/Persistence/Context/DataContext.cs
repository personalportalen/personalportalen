using Domain.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Context;
public class DataContext(DbContextOptions<DataContext> options) : IdentityDbContext<AppUser>(options)
{
}
