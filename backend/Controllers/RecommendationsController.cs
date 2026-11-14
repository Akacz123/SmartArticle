using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartArticle.Api.Data;
using SmartArticle.Api.Dtos;
using SmartArticle.Api.Models;
using SmartArticle.Api.Services;

namespace SmartArticle.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecommendationsController : ControllerBase
{
    private readonly IRecommendationService _recommendationService;
    private readonly AppDbContext _db;

    public RecommendationsController(IRecommendationService recommendationService, AppDbContext db)
    {
        _recommendationService = recommendationService;
        _db = db;
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<List<RecommendationItemDto>>> GetRecommendations(int userId, [FromQuery] int limit = 6)
    {
        var recommendations = await _recommendationService.GetRecommendationsAsync(userId, limit);
        return Ok(recommendations);
    }

    [HttpPost("feedback")]
    public async Task<IActionResult> SaveFeedback([FromBody] RecommendationFeedbackRequest req)
    {
        var existing = await _db.UserActivities
            .FirstOrDefaultAsync(ua => ua.UserId == req.UserId && ua.ArticleId == req.ArticleId);

        if (existing != null)
        {
            existing.RecommendationFeedback = req.Feedback;
            existing.IsRecommendation = true;
            existing.ViewedAt = DateTime.UtcNow;
        }
        else
        {
            var activity = new UserActivity
            {
                UserId = req.UserId,
                ArticleId = req.ArticleId,
                TimeSpentSeconds = 0,
                IsRecommendation = true,
                RecommendationFeedback = req.Feedback,
                ViewedAt = DateTime.UtcNow
            };
            _db.UserActivities.Add(activity);
        }

        await _db.SaveChangesAsync();
        return Ok(new { success = true });
    }
}
