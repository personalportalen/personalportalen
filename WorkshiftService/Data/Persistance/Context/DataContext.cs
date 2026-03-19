using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistance.Context;
public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    public DbSet<WorkshiftEntity> Workshifts { get; set; }
    //public DbSet<EmployeeEntity> Employees { get; set; }
    //public DbSet<AreaEntity> Areas { get; set; }
    
}
