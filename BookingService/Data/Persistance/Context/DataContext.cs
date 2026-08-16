using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistance.Context;
public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    public DbSet<BookingEntity> Bookings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BookingEntity>()
            .HasIndex(x => x.WorkshiftId)
            .IsUnique();
    }
}
