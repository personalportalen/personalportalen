using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context;
public class DataContext(DbContextOptions<DataContext> options) : IdentityDbContext(options)
{
}
