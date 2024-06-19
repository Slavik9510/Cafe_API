using Cafe_API.Core.Entities;
using Cafe_API.Core.Helpers;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Cafe_API.Infrastructure.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int>
    {
        public DataContext(DbContextOptions options) : base(options) { }

        public DbSet<Food> Foods { get; set; }
        public DbSet<FoodItem> FoodItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void ConfigureConventions(ModelConfigurationBuilder builder)
        {
            base.ConfigureConventions(builder);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<FoodAdditionalInfo>().ToTable("FoodAdditionalInfos");

            builder.Entity<Food>()
                .Property(f => f.Ingredients)
                .HasConversion(new HashSetStringConverter());

            builder.Entity<FoodItem>()
                .Property(fi => fi.Price)
                .HasPrecision(5, 2);

            builder.Entity<OrderItem>()
                .Property(oi => oi.Price)
                .HasPrecision(5, 2);
        }
    }
}
