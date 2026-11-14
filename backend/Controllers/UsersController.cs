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

    [HttpPut("{id}/profile")]
    public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileRequest req)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Użytkownik nie został znaleziony" });
        }

        var newUsername = req.Username.Trim();
        if (string.IsNullOrWhiteSpace(newUsername) || newUsername.Length < 3)
        {
            return BadRequest(new { message = "Nazwa użytkownika musi mieć co najmniej 3 znaki" });
        }

        var exists = await _db.Users.AnyAsync(u => u.Id != id && u.Username.ToLower() == newUsername.ToLower());
        if (exists)
        {
            return Conflict(new { message = "Wybrana nazwa użytkownika jest już zajęta" });
        }

        user.Username = newUsername;
        await _db.SaveChangesAsync();

        return Ok(new AuthResponse
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.Username
        });
    }

    [HttpPut("{id}/change-password")]
    public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordRequest req)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Użytkownik nie został znaleziony" });
        }

        if (!BCrypt.Net.BCrypt.Verify(req.CurrentPassword, user.PasswordHash))
        {
            return BadRequest(new { message = "Aktualne hasło jest nieprawidłowe" });
        }

        if (string.IsNullOrWhiteSpace(req.NewPassword) || req.NewPassword.Length < 6)
        {
            return BadRequest(new { message = "Nowe hasło musi zawierać co najmniej 6 znaków" });
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Hasło zostało pomyślnie zmienione" });
    }
}
