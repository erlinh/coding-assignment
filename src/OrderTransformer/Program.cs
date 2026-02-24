using OrderTransformer.Api;
using OrderTransformer.Services;
using OrderTransformer.Worker;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS for Vite dev server
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Register services
builder.Services.AddSingleton<IBlobStorageService, BlobStorageService>();
builder.Services.AddSingleton<IXmlParserService, XmlParserService>();
builder.Services.AddSingleton<IJsonTransformerService, JsonTransformerService>();
builder.Services.AddSingleton<IOrderValidatorService, OrderValidatorService>();
builder.Services.AddSingleton<IFieldMappingService, FieldMappingService>();
builder.Services.AddSingleton<TransformationPipeline>();

// Register background worker
builder.Services.AddHostedService<BlobPollingWorker>();

var app = builder.Build();

app.UseCors();
app.UseStaticFiles();

// Map API endpoints
app.MapOrderEndpoints();
app.MapStatusEndpoints();

app.MapFallbackToFile("index.html");

app.Run();
