using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistance.Context
{
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
    {
        public DbSet<ProfileEntity> Profiles => Set<ProfileEntity>();
        public DbSet<AddressEntity> Addresses => Set<AddressEntity>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProfileEntity>()
                .HasIndex(p => p.Id)
                .IsUnique();

            modelBuilder.Entity<ProfileEntity>()
                .HasOne(p => p.Address)
                .WithMany()
                .HasForeignKey(p => p.AddressId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ProfileEntity>()
                .Property(p => p.Id)
                .IsRequired();

            modelBuilder.Entity<ProfileEntity>()
                .HasIndex(p => p.EmailAddress);

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