using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartArticle.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateArticleAndActivityModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRecommendation",
                table: "UserActivities",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "RecommendationFeedback",
                table: "UserActivities",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Articles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ReadTimeMinutes",
                table: "Articles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Summary",
                table: "Articles",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRecommendation",
                table: "UserActivities");

            migrationBuilder.DropColumn(
                name: "RecommendationFeedback",
                table: "UserActivities");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "ReadTimeMinutes",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "Summary",
                table: "Articles");
        }
    }
}
