using Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Context
{
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
    {
        public DbSet<ProfileEntity> Profiles => Set<ProfileEntity>();
        public DbSet<AddressEntity> Addresses => Set<AddressEntity>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AddressEntity>()
            .HasData(
                new AddressEntity
                {
                    Id = 5,
                    Street = "",
                    City = "",
                    State = "",
                    ZipCode = "",
                    Country = ""
                }
            );
        }
    }
}