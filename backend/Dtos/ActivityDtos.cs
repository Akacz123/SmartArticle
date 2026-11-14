namespace SmartArticle.Api.Dtos;

public class TrackActivityRequest
{
    public int UserId { get; set; }
    public int ArticleId { get; set; }
    public int TimeSpentSeconds { get; set; }
    public int? Rating { get; set; }
    public bool IsRecommendation { get; set; }
    public int? RecommendationFeedback { get; set; }
}

public class UserActivityDto
{
    public int Id { get; set; }
    public int ArticleId { get; set; }
    public string ArticleTitle { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int TimeSpentSeconds { get; set; }
    public int? Rating { get; set; }
    public bool IsRecommendation { get; set; }
    public int? RecommendationFeedback { get; set; }
    public DateTime ViewedAt { get; set; }
}

public class UserStatsDto
{
    public int TotalArticlesRead { get; set; }
    public int TotalReadTimeSeconds { get; set; }
    public double AverageRating { get; set; }
    public List<CategoryStatDto> TopCategories { get; set; } = new();
}

public class CategoryStatDto
{
    public string Category { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class UserProfileDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public UserStatsDto Stats { get; set; } = new();
}
