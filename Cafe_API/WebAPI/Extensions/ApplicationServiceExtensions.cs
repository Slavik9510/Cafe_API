using Cafe_API.Core.Interfaces;
using Cafe_API.Core.Mapping;
using Cafe_API.Core.Services;
using Cafe_API.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Cafe_API.WebAPI.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration config)
        {
            services.AddCors();
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });
            services.AddAutoMapper(typeof(AutoMapperProfiles));
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IFoodRepository, FoodRepository>();
            services.AddSignalR();

            return services;
        }
    }
}
