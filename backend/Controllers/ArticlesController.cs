using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartArticle.Api.Data;
using SmartArticle.Api.Dtos;

namespace SmartArticle.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly AppDbContext _db;

    public ArticlesController(AppDbContext db)
    {
        _db = db;
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
}
