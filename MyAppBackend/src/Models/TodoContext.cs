using Microsoft.EntityFrameworkCore;
using MyApp.Utils;

namespace MyApp.Models;

public class TodoContext : DbContext
{
    public DbSet<TodoItem> TodoItems { get; set; } = null!;

    public TodoContext(DbContextOptions<TodoContext> options) : base(options) { }
}
