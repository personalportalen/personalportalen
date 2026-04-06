//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Design;
//using Microsoft.Extensions.Configuration;

//namespace Infrastructure.Persistance.Context;

//public class DataContextFactory : IDesignTimeDbContextFactory<DataContext>
//{
//    public DataContext CreateDbContext(string[] args)
//    {
//        // Bygg config manuellt
//        var configuration = new ConfigurationBuilder()
//            .SetBasePath(Directory.GetCurrentDirectory())
//            .AddJsonFile("appsettings.json", optional: true)
//            .Build();

//        var connectionString = configuration.GetConnectionString("DefaultConnection");

//        var optionsBuilder = new DbContextOptionsBuilder<DataContext>();
//        optionsBuilder.UseSqlServer(connectionString);

//        return new DataContext(optionsBuilder.Options);
//    }
//}