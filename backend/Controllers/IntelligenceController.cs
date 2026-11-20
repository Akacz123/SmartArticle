using Microsoft.AspNetCore.Mvc;
using SmartArticle.Api.Dtos;
using SmartArticle.Api.Services;

namespace SmartArticle.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IntelligenceController : ControllerBase
{
    private readonly IIntelligenceService _intelligenceService;

    public IntelligenceController(IIntelligenceService intelligenceService)
    {
        _intelligenceService = intelligenceService;
    }

    [HttpGet("analytics/{userId}")]
    public async Task<ActionResult<IntelligenceAnalyticsDto>> GetAnalytics(int userId)
    {
        var result = await _intelligenceService.GetAnalyticsAsync(userId);
        return Ok(result);
    }
}
