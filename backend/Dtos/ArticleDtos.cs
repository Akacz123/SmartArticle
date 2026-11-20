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

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalItems { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => PageSize > 0 ? (int)Math.Ceiling((double)TotalItems / PageSize) : 0;
}
