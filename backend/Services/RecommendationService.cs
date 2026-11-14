using System.Diagnostics;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SmartArticle.Api.Data;
using SmartArticle.Api.Dtos;

namespace SmartArticle.Api.Services;

public class RecommendationService : IRecommendationService
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public RecommendationService(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    public async Task<List<RecommendationItemDto>> GetRecommendationsAsync(int userId, int limit = 6)
    {
        var articles = await _db.Articles.ToListAsync();
        if (!articles.Any())
        {
            return new List<RecommendationItemDto>();
        }

        var activities = await _db.UserActivities.ToListAsync();

        var pyResult = await RunPythonRecommender(userId, articles, activities, limit);
        if (pyResult != null && pyResult.Any())
        {
            var articleMap = articles.ToDictionary(a => a.Id);
            var items = new List<RecommendationItemDto>();

            foreach (var r in pyResult)
            {
                if (articleMap.TryGetValue(r.ArticleId, out var art))
                {
                    items.Add(new RecommendationItemDto
                    {
                        ArticleId = art.Id,
                        Title = art.Title,
                        Summary = art.Summary,
                        Category = art.Category,
                        ReadTimeMinutes = art.ReadTimeMinutes,
                        ImageUrl = art.ImageUrl,
                        Score = r.Score,
                        Reason = r.Reason
                    });
                }
            }

            if (items.Any())
            {
                return items;
            }
        }

        return FallbackRecommendations(userId, articles, activities, limit);
    }

    private async Task<List<PyRecommenderOutput>?> RunPythonRecommender(int userId, List<Models.Article> articles, List<Models.UserActivity> activities, int limit)
    {
        try
        {
            var contentRoot = _env.ContentRootPath;
            var scriptPath = Path.GetFullPath(Path.Combine(contentRoot, "..", "ml", "recommender.py"));

            if (!File.Exists(scriptPath))
            {
                return null;
            }

            var payload = new
            {
                targetUserId = userId,
                limit = limit,
                articles = articles.Select(a => new
                {
                    id = a.Id,
                    title = a.Title,
                    category = a.Category,
                    summary = a.Summary,
                    readTimeMinutes = a.ReadTimeMinutes
                }),
                activities = activities.Select(a => new
                {
                    userId = a.UserId,
                    articleId = a.ArticleId,
                    timeSpentSeconds = a.TimeSpentSeconds,
                    rating = a.Rating,
                    recommendationFeedback = a.RecommendationFeedback
                })
            };

            var jsonInput = JsonSerializer.Serialize(payload);

            var psi = new ProcessStartInfo
            {
                FileName = "python",
                Arguments = $"\"{scriptPath}\"",
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = new Process { StartInfo = psi };
            process.Start();

            await using (var sw = process.StandardInput)
            {
                await sw.WriteAsync(jsonInput);
            }

            var stdout = await process.StandardOutput.ReadToEndAsync();
            await process.WaitForExitAsync();

            if (process.ExitCode == 0 && !string.IsNullOrWhiteSpace(stdout))
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                return JsonSerializer.Deserialize<List<PyRecommenderOutput>>(stdout, options);
            }
        }
        catch
        {
        }

        return null;
    }

    private List<RecommendationItemDto> FallbackRecommendations(int userId, List<Models.Article> articles, List<Models.UserActivity> activities, int limit)
    {
        var userActs = activities.Where(a => a.UserId == userId).ToList();
        var consumedIds = userActs.Select(a => a.ArticleId).ToHashSet();

        var preferredCategories = userActs
            .Join(articles, act => act.ArticleId, art => art.Id, (act, art) => art.Category)
            .GroupBy(c => c)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .ToList();

        var candidates = articles.Where(a => !consumedIds.Contains(a.Id)).ToList();
        if (!candidates.Any())
        {
            candidates = articles;
        }

        var scored = candidates.Select(a =>
        {
            var isPref = preferredCategories.Contains(a.Category);
            var score = isPref ? 0.85 : 0.4;
            var reason = isPref
                ? $"Rekomendowane na podstawie Twojej aktywności w kategorii {a.Category}"
                : $"Polecane w kategorii {a.Category}";

            return new RecommendationItemDto
            {
                ArticleId = a.Id,
                Title = a.Title,
                Summary = a.Summary,
                Category = a.Category,
                ReadTimeMinutes = a.ReadTimeMinutes,
                ImageUrl = a.ImageUrl,
                Score = score,
                Reason = reason
            };
        })
        .OrderByDescending(x => x.Score)
        .Take(limit)
        .ToList();

        return scored;
    }
}
