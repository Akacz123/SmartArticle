using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartArticle.Api.Data;
using SmartArticle.Api.Dtos;
using SmartArticle.Api.Models;

namespace SmartArticle.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActivityController : ControllerBase
{
    private readonly AppDbContext _db;

    public ActivityController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> TrackActivity([FromBody] TrackActivityRequest req)
    {
        var existing = await _db.UserActivities
            .FirstOrDefaultAsync(ua => ua.UserId == req.UserId && ua.ArticleId == req.ArticleId);

        if (existing != null)
        {
            if (req.TimeSpentSeconds > 0)
            {
                existing.TimeSpentSeconds += req.TimeSpentSeconds;
            }

            if (req.Rating.HasValue)
            {
                existing.Rating = req.Rating.Value;
            }

            if (req.RecommendationFeedback.HasValue)
            {
                existing.RecommendationFeedback = req.RecommendationFeedback.Value;
            }

            existing.IsRecommendation = req.IsRecommendation || existing.IsRecommendation;
            existing.ViewedAt = DateTime.UtcNow;
        }
        else
        {
            var activity = new UserActivity
            {
                UserId = req.UserId,
                ArticleId = req.ArticleId,
                TimeSpentSeconds = req.TimeSpentSeconds,
                Rating = req.Rating,
                IsRecommendation = req.IsRecommendation,
                RecommendationFeedback = req.RecommendationFeedback,
                ViewedAt = DateTime.UtcNow
            };
            _db.UserActivities.Add(activity);
        }

        await _db.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<UserActivityDto>>> GetUserActivities(int userId)
    {
        var activities = await _db.UserActivities
            .Include(ua => ua.Article)
            .Where(ua => ua.UserId == userId)
            .OrderByDescending(ua => ua.ViewedAt)
            .Select(ua => new UserActivityDto
            {
                Id = ua.Id,
                ArticleId = ua.ArticleId,
                ArticleTitle = ua.Article.Title,
                Category = ua.Article.Category,
                TimeSpentSeconds = ua.TimeSpentSeconds,
                Rating = ua.Rating,
                IsRecommendation = ua.IsRecommendation,
                RecommendationFeedback = ua.RecommendationFeedback,
                ViewedAt = ua.ViewedAt
            })
            .ToListAsync();

        return Ok(activities);
    }

    [HttpGet("stats/{userId}")]
    public async Task<ActionResult<UserStatsDto>> GetUserStats(int userId)
    {
        var activities = await _db.UserActivities
            .Include(ua => ua.Article)
            .Where(ua => ua.UserId == userId)
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

        return Ok(new UserStatsDto
        {
            TotalArticlesRead = totalArticles,
            TotalReadTimeSeconds = totalTime,
            AverageRating = Math.Round(avgRating, 1),
            TopCategories = topCategories
        });
    }
}
