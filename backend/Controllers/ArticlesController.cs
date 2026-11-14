using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartArticle.Api.Data;
using SmartArticle.Api.Dtos;
using SmartArticle.Api.Models;

namespace SmartArticle.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IHttpClientFactory _httpClientFactory;

    public ArticlesController(AppDbContext db, IHttpClientFactory httpClientFactory)
    {
        _db = db;
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet]
    public async Task<ActionResult<List<ArticleDto>>> GetArticles([FromQuery] string? category, [FromQuery] string? search)
    {
        var query = _db.Articles.AsQueryable();

        if (!string.IsNullOrWhiteSpace(category) && category != "Wszystkie")
        {
            query = query.Where(a => a.Category == category);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(a => a.Title.ToLower().Contains(s) || a.Summary.ToLower().Contains(s));
        }

        var articles = await query
            .OrderByDescending(a => a.PublishedAt)
            .Select(a => new ArticleDto
            {
                Id = a.Id,
                Title = a.Title,
                Summary = a.Summary,
                Category = a.Category,
                ReadTimeMinutes = a.ReadTimeMinutes,
                ImageUrl = a.ImageUrl,
                PublishedAt = a.PublishedAt
            })
            .ToListAsync();

        return Ok(articles);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ArticleDetailDto>> GetArticle(int id)
    {
        var article = await _db.Articles.FindAsync(id);
        if (article == null)
        {
            return NotFound(new { message = "Artykuł nie został znaleziony" });
        }

        return Ok(new ArticleDetailDto
        {
            Id = article.Id,
            Title = article.Title,
            Summary = article.Summary,
            Content = article.Content,
            Category = article.Category,
            ReadTimeMinutes = article.ReadTimeMinutes,
            ImageUrl = article.ImageUrl,
            PublishedAt = article.PublishedAt
        });
    }

    [HttpGet("categories")]
    public async Task<ActionResult<List<string>>> GetCategories()
    {
        var categories = await _db.Articles
            .Select(a => a.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost("sync-external")]
    public async Task<IActionResult> SyncExternalArticles()
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Add("User-Agent", "SmartArticleApp/1.0");

            var response = await client.GetAsync("https://dev.to/api/articles?per_page=30");
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, new { message = "Błąd pobierania artykułów z zewnętrznego API" });
            }

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            var existingTitles = await _db.Articles.Select(a => a.Title.ToLower()).ToListAsync();
            var existingSet = new HashSet<string>(existingTitles);

            var addedCount = 0;
            var defaultImages = new[]
            {
                "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
            };

            var random = new Random();

            foreach (var item in doc.RootElement.EnumerateArray())
            {
                var title = item.TryGetProperty("title", out var tProp) ? tProp.GetString() : null;
                if (string.IsNullOrWhiteSpace(title) || existingSet.Contains(title.ToLower()))
                {
                    continue;
                }

                var description = item.TryGetProperty("description", out var dProp) ? dProp.GetString() : "";
                var readingTime = item.TryGetProperty("reading_time_minutes", out var rtProp) ? rtProp.GetInt32() : 4;
                var coverImage = item.TryGetProperty("cover_image", out var ciProp) ? ciProp.GetString() : null;

                if (string.IsNullOrWhiteSpace(coverImage))
                {
                    coverImage = defaultImages[random.Next(defaultImages.Length)];
                }

                var category = "Technologia";
                if (item.TryGetProperty("tag_list", out var tags) && tags.ValueKind == JsonValueKind.Array)
                {
                    var tagSet = tags.EnumerateArray().Select(x => x.GetString()?.ToLower() ?? "").ToList();
                    if (tagSet.Any(t => t.Contains("ai") || t.Contains("machinelearning") || t.Contains("ml")))
                    {
                        category = "Sztuczna Inteligencja";
                    }
                    else if (tagSet.Any(t => t.Contains("security") || t.Contains("cyber")))
                    {
                        category = "Cyberbezpieczeństwo";
                    }
                    else if (tagSet.Any(t => t.Contains("devops") || t.Contains("cloud") || t.Contains("docker") || t.Contains("kubernetes")))
                    {
                        category = "Chmura i DevOps";
                    }
                    else if (tagSet.Any(t => t.Contains("react") || t.Contains("javascript") || t.Contains("python") || t.Contains("csharp") || t.Contains("programming")))
                    {
                        category = "Programowanie";
                    }
                    else if (tagSet.Any(t => t.Contains("career") || t.Contains("productivity") || t.Contains("startup") || t.Contains("management")))
                    {
                        category = "Biznes";
                    }
                }

                var fullContent = !string.IsNullOrWhiteSpace(description)
                    ? $"{description}\n\nWięcej informacji oraz szczegółowa analiza techniczna zagadnienia w pełnym artykule na platformie branżowej."
                    : title;

                var article = new Article
                {
                    Title = title,
                    Summary = description ?? title,
                    Content = fullContent,
                    Category = category,
                    ReadTimeMinutes = Math.Max(2, readingTime),
                    ImageUrl = coverImage,
                    PublishedAt = DateTime.UtcNow
                };

                _db.Articles.Add(article);
                existingSet.Add(title.ToLower());
                addedCount++;
            }

            if (addedCount > 0)
            {
                await _db.SaveChangesAsync();
            }

            return Ok(new { success = true, added = addedCount, total = await _db.Articles.CountAsync() });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Błąd synchronizacji", error = ex.Message });
        }
    }
}
