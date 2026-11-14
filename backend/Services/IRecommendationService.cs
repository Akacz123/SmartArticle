using SmartArticle.Api.Dtos;

namespace SmartArticle.Api.Services;

public interface IRecommendationService
{
    Task<List<RecommendationItemDto>> GetRecommendationsAsync(int userId, int limit = 6);
}
