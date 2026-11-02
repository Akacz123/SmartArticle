using Microsoft.EntityFrameworkCore;
using SmartArticle.Api.Models;

namespace SmartArticle.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<UserActivity> UserActivities => Set<UserActivity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.HasIndex(u => u.Username).IsUnique();
        });

        modelBuilder.Entity<UserActivity>(e =>
        {
            e.HasOne(ua => ua.User).WithMany().HasForeignKey(ua => ua.UserId);
            e.HasOne(ua => ua.Article).WithMany().HasForeignKey(ua => ua.ArticleId);
        });
    }
}
