namespace SmartArticle.Api.Dtos;

public class RecommendationItemDto
{
    public int ArticleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int ReadTimeMinutes { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public double Score { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class RecommendationFeedbackRequest
{
    public int UserId { get; set; }
    public int ArticleId { get; set; }
    public int Feedback { get; set; }
}

public class PyRecommenderOutput
{
    public int ArticleId { get; set; }
    public double Score { get; set; }
    public string Reason { get; set; } = string.Empty;
}
