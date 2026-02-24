namespace OrderTransformer.Api;

public static class StatusEndpoints
{
    public static void MapStatusEndpoints(this WebApplication app)
    {
        app.MapGet("/api/orders/status/{fileName}", GetStatus);
    }

    /// <summary>
    /// Returns the processing status for a given uploaded file.
    ///
    /// TODO: Implement status checking logic.
    ///
    /// The status should be determined by checking which blob storage prefix contains the file:
    ///
    /// 1. Check if a matching output blob exists in "output/" prefix:
    ///    - The output blob name will be "output/{fileNameWithoutExtension}.json"
    ///    - If found → return status "completed" with the outputBlobName
    ///
    /// 2. Check if the file exists in the "failed/" prefix:
    ///    - The failed blob name will be "failed/{fileName}"
    ///    - If found → return status "failed"
    ///
    /// 3. Check if the file still exists in the "input/" prefix:
    ///    - The input blob name will be "input/{fileName}"
    ///    - If found → return status "pending"
    ///
    /// 4. If not found in any prefix → return status "not_found"
    ///
    /// You will need:
    /// - IBlobStorageService (injected via parameter) to check blob existence
    /// - IConfiguration (injected via parameter) to read prefix settings
    /// - Use ListBlobsAsync(prefix) or try ReadBlobAsync and catch exceptions
    ///
    /// Response shape:
    ///   { "fileName": "...", "status": "pending|completed|failed|not_found", "outputBlobName": "..." }
    ///
    /// The outputBlobName field should only be included when status is "completed".
    /// </summary>
    private static IResult GetStatus(string fileName)
    {
        // STUB: Currently returns "not_found" for all files.
        // Implement the logic described in the TODO above.
        return Results.Json(new
        {
            fileName,
            status = "not_found"
        });
    }
}
