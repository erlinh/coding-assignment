using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using OrderTransformer.Services;

namespace OrderTransformer.Api;

public static class OrderEndpoints
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public static void MapOrderEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/orders");

        // Register specific routes BEFORE the catch-all to avoid routing conflicts
        group.MapGet("/stats", GetStats);
        group.MapPost("/upload", UploadOrder);
        group.MapGet("/", ListOrders);
        group.MapGet("/{**blobName}", GetOrder);
    }

    private static async Task<IResult> ListOrders(IBlobStorageService blobService, IConfiguration configuration)
    {
        var outputPrefix = configuration["BlobStorage:OutputPrefix"] ?? "output/";

        var blobs = await blobService.ListBlobsAsync(outputPrefix);
        var summaries = new List<object>();

        foreach (var blobName in blobs)
        {
            try
            {
                var content = await blobService.ReadBlobAsync(blobName);
                using var doc = JsonDocument.Parse(content);
                var root = doc.RootElement;

                summaries.Add(new
                {
                    BlobName = blobName,
                    TenantId = root.TryGetProperty("tenantId", out var tid) ? tid.GetString() : null,
                    ProcessedAt = root.TryGetProperty("processedAt", out var pa) ? pa.GetString() : null,
                    OrderCount = root.TryGetProperty("orderCount", out var oc) ? oc.GetInt32() : 0,
                    ValidationErrorCount = root.TryGetProperty("validationErrorCount", out var vec) ? vec.GetInt32() : 0
                });
            }
            catch
            {
                summaries.Add(new
                {
                    BlobName = blobName,
                    TenantId = (string?)null,
                    ProcessedAt = (string?)null,
                    OrderCount = 0,
                    ValidationErrorCount = 0
                });
            }
        }

        return Results.Json(summaries, JsonOptions);
    }

    private static async Task<IResult> GetStats(IBlobStorageService blobService, IConfiguration configuration)
    {
        var outputPrefix = configuration["BlobStorage:OutputPrefix"] ?? "output/";
        var inputPrefix = configuration["BlobStorage:InputPrefix"] ?? "input/";
        var failedPrefix = configuration["BlobStorage:FailedPrefix"] ?? "failed/";

        var outputBlobs = await blobService.ListBlobsAsync(outputPrefix);
        var inputBlobs = await blobService.ListBlobsAsync(inputPrefix);
        var failedBlobs = await blobService.ListBlobsAsync(failedPrefix);

        var totalOrders = 0;
        var totalErrors = 0;

        foreach (var blobName in outputBlobs)
        {
            try
            {
                var content = await blobService.ReadBlobAsync(blobName);
                using var doc = JsonDocument.Parse(content);
                var root = doc.RootElement;

                if (root.TryGetProperty("orderCount", out var oc))
                    totalOrders += oc.GetInt32();
                if (root.TryGetProperty("validationErrorCount", out var vec))
                    totalErrors += vec.GetInt32();
            }
            catch
            {
                // Skip blobs that can't be parsed
            }
        }

        var stats = new
        {
            TotalBatches = outputBlobs.Count,
            TotalOrders = totalOrders,
            TotalValidationErrors = totalErrors,
            PendingFiles = inputBlobs.Count,
            FailedFiles = failedBlobs.Count
        };

        return Results.Json(stats, JsonOptions);
    }

    private static async Task<IResult> GetOrder(string blobName, IBlobStorageService blobService)
    {
        try
        {
            var content = await blobService.ReadBlobAsync(blobName);
            return Results.Content(content, "application/json");
        }
        catch
        {
            return Results.NotFound(new { error = "Blob not found", blobName });
        }
    }

    private static async Task<IResult> UploadOrder(
        [FromForm] IFormFile file,
        IBlobStorageService blobService,
        IConfiguration configuration)
    {
        if (file == null || file.Length == 0)
        {
            return Results.BadRequest(new { error = "No file provided" });
        }

        if (!file.FileName.EndsWith(".xml", StringComparison.OrdinalIgnoreCase))
        {
            return Results.BadRequest(new { error = "Only XML files are accepted" });
        }

        var inputPrefix = configuration["BlobStorage:InputPrefix"] ?? "input/";

        using var reader = new StreamReader(file.OpenReadStream());
        var content = await reader.ReadToEndAsync();

        // Basic XML validation
        try
        {
            System.Xml.Linq.XDocument.Parse(content);
        }
        catch
        {
            return Results.BadRequest(new { error = "Invalid XML content" });
        }

        var blobName = $"{inputPrefix}{file.FileName}";
        await blobService.WriteBlobAsync(blobName, content);

        return Results.Ok(new { message = "File uploaded successfully", blobName, fileName = file.FileName });
    }
}
