using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartArticle.Api.Data;
using SmartArticle.Api.Dtos;

namespace SmartArticle.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("{id}/profile")]
    public async Task<ActionResult<UserProfileDto>> GetProfile(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Użytkownik nie został znaleziony" });
        }

        var activities = await _db.UserActivities
            .Include(ua => ua.Article)
            .Where(ua => ua.UserId == id)
            .ToListAsync();

        var totalArticles = activities.Select(a => a.ArticleId).Distinct().Count();
        var totalTime = activities.Sum(a => a.TimeSpentSeconds);
        var ratedActivities = activities.Where(a => a.Rating.HasValue).ToList();
        var avgRating = ratedActivities.Any() ? ratedActivities.Average(a => a.Rating!.Value) : 0;

        var topCategories = activities
            .GroupBy(a => a.Article.Category)
            .Select(g => new CategoryStatDto
            {
                Category = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(c => c.Count)
            .ToList();

        var profile = new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.Username,
            CreatedAt = user.CreatedAt,
            Stats = new UserStatsDto
            {
                TotalArticlesRead = totalArticles,
                TotalReadTimeSeconds = totalTime,
                AverageRating = Math.Round(avgRating, 1),
                TopCategories = topCategories
            }
        };

        return Ok(profile);
    }
}
