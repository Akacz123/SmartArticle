using SmartArticle.Api.Dtos;

namespace SmartArticle.Api.Services;

public interface IIntelligenceService
{
    Task<IntelligenceAnalyticsDto> GetAnalyticsAsync(int userId);
}
