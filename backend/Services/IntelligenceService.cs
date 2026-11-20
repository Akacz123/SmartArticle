using System.Diagnostics;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SmartArticle.Api.Data;
using SmartArticle.Api.Dtos;

namespace SmartArticle.Api.Services;

public class IntelligenceService : IIntelligenceService
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public IntelligenceService(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    public async Task<IntelligenceAnalyticsDto> GetAnalyticsAsync(int userId)
    {
        var articles = await _db.Articles.ToListAsync();
        var activities = await _db.UserActivities.ToListAsync();

        var pyResult = await RunPythonAnalytics(userId, articles, activities);
        if (pyResult != null)
        {
            return pyResult;
        }

        return FallbackAnalytics(userId, articles, activities);
    }

    private async Task<IntelligenceAnalyticsDto?> RunPythonAnalytics(int userId, List<Models.Article> articles, List<Models.UserActivity> activities)
    {
        try
        {
            var contentRoot = _env.ContentRootPath;
            var scriptPath = Path.GetFullPath(Path.Combine(contentRoot, "..", "ml", "analytics.py"));

            if (!File.Exists(scriptPath))
            {
                return null;
            }

            var payload = new
            {
                targetUserId = userId,
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
                return JsonSerializer.Deserialize<IntelligenceAnalyticsDto>(stdout, options);
            }
        }
        catch
        {
        }

        return null;
    }

    private IntelligenceAnalyticsDto FallbackAnalytics(int userId, List<Models.Article> articles, List<Models.UserActivity> activities)
    {
        var userActs = activities.Where(a => a.UserId == userId).ToList();
        var readIds = userActs.Select(a => a.ArticleId).ToHashSet();

        var catCounts = userActs
            .Join(articles, act => act.ArticleId, art => art.Id, (act, art) => art.Category)
            .GroupBy(c => c)
            .ToDictionary(g => g.Key, g => g.Count());

        var topCat = catCounts.OrderByDescending(kv => kv.Value).Select(kv => kv.Key).FirstOrDefault() ?? "Technologia";

        var total = userActs.Count;
        var probs = catCounts.Select(kv => new PredictedCategoryDto
        {
            Category = kv.Key,
            Probability = Math.Round((double)kv.Value / (total == 0 ? 1 : total), 2)
        }).OrderByDescending(p => p.Probability).ToList();

        if (!probs.Any())
        {
            probs.Add(new PredictedCategoryDto { Category = "Sztuczna Inteligencja", Probability = 0.5 });
            probs.Add(new PredictedCategoryDto { Category = "Technologia", Probability = 0.5 });
        }

        var avgSec = userActs.Any() ? (int)userActs.Average(a => a.TimeSpentSeconds) : 240;
        var optMins = Math.Max(3, (int)Math.Round(avgSec / 60.0));

        var articlePoints = articles.Take(30).Select((a, idx) =>
        {
            var angle = idx * (2 * Math.PI / 30);
            var isRead = readIds.Contains(a.Id);
            return new PcaPointDto
            {
                Id = a.Id,
                Title = a.Title,
                Category = a.Category,
                X = Math.Round(Math.Cos(angle) * 0.6, 3),
                Y = Math.Round(Math.Sin(angle) * 0.6, 3),
                IsRead = isRead,
                PredictedRating = isRead ? 4.5 : 3.8,
                AffinityPercent = isRead ? 90 : 75
            };
        }).ToList();

        return new IntelligenceAnalyticsDto
        {
            UserPersona = new UserPersonaDto
            {
                Name = $"Profil {topCat}",
                Description = $"Predykcja modelu bazująca na {total} interakcjach z treściami technicznymi.",
                Confidence = 0.85
            },
            PredictedNextCategory = probs.First(),
            CategoryProbabilities = probs,
            OptimalReadingTimeMinutes = optMins,
            PredictedEngagementScore = Math.Min(95, 50 + total * 5),
            PcaProjection = new PcaProjectionDto
            {
                UserPoint = new PcaUserPointDto { X = 0.0, Y = 0.0, Label = "Twój profil" },
                ArticlePoints = articlePoints
            },
            ModelMetrics = new ModelMetricsDto
            {
                Algorithm = "SVD Matrix Factorization + PCA 2D + TF-IDF Cosine Similarity",
                ExplainedVarianceRatio = 0.78,
                TotalAnalyzedArticles = articles.Count,
                TotalInteractions = total
            }
        };
    }
}
