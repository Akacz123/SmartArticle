namespace SmartArticle.Api.Dtos;

public class ArticleDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int ReadTimeMinutes { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime PublishedAt { get; set; }
}

public class ArticleDetailDto : ArticleDto
{
    public string Content { get; set; } = string.Empty;
}
