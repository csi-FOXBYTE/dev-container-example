using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using MyApp.Utils;

namespace MyApp.Models;

public class TodoContextFactory : IDesignTimeDbContextFactory<TodoContext>
{
    public TodoContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<TodoContext>()
            .UseNpgsql(DbConnectionString.FromEnv())
            .Options;
        return new TodoContext(options);
    }
}
