namespace SmartArticle.Api.Models;

public class UserActivity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int ArticleId { get; set; }
    public Article Article { get; set; } = null!;
    public int TimeSpentSeconds { get; set; }
    public int? Rating { get; set; }
    public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
}
