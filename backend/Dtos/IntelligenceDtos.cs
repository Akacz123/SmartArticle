namespace SmartArticle.Api.Dtos;

public class UserPersonaDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Confidence { get; set; }
}

public class PredictedCategoryDto
{
    public string Category { get; set; } = string.Empty;
    public double Probability { get; set; }
}

public class PcaPointDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public double X { get; set; }
    public double Y { get; set; }
    public bool IsRead { get; set; }
    public double PredictedRating { get; set; }
    public int AffinityPercent { get; set; }
}

public class PcaUserPointDto
{
    public double X { get; set; }
    public double Y { get; set; }
    public string Label { get; set; } = string.Empty;
}

public class PcaProjectionDto
{
    public PcaUserPointDto UserPoint { get; set; } = new();
    public List<PcaPointDto> ArticlePoints { get; set; } = new();
}

public class ModelMetricsDto
{
    public string Algorithm { get; set; } = string.Empty;
    public double ExplainedVarianceRatio { get; set; }
    public int TotalAnalyzedArticles { get; set; }
    public int TotalInteractions { get; set; }
}

public class IntelligenceAnalyticsDto
{
    public UserPersonaDto UserPersona { get; set; } = new();
    public PredictedCategoryDto PredictedNextCategory { get; set; } = new();
    public List<PredictedCategoryDto> CategoryProbabilities { get; set; } = new();
    public int OptimalReadingTimeMinutes { get; set; }
    public int PredictedEngagementScore { get; set; }
    public PcaProjectionDto PcaProjection { get; set; } = new();
    public ModelMetricsDto ModelMetrics { get; set; } = new();
}
