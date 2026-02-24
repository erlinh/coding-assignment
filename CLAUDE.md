# Order Transformer - Coding Assessment

## Project Overview
This is a .NET 9 Web Application that monitors Azure Blob Storage (Azurite emulator) for incoming XML order files, transforms them to JSON, and writes output back to blob storage. It includes a React UI for viewing processed orders and uploading new files.

## Architecture
- **Pipeline pattern**: `Parse XML → Validate → Map Fields → Transform to JSON → Store`
- **DI-based services**: All services registered via interfaces in `Program.cs`
- **BackgroundService**: `BlobPollingWorker` polls blob storage on a timer
- **Minimal API**: REST endpoints for listing, viewing, and uploading orders
- **React UI**: Single-page app served from wwwroot (production) or Vite dev server

## Key Files
- `src/OrderTransformer/Worker/TransformationPipeline.cs` - Orchestrates the processing pipeline
- `src/OrderTransformer/Worker/BlobPollingWorker.cs` - Polls blob storage for new files
- `src/OrderTransformer/Models/OrderModels.cs` - Domain models (immutable records)
- `src/OrderTransformer/Services/` - All service interfaces and implementations
- `src/OrderTransformer/Api/OrderEndpoints.cs` - REST API endpoints
- `src/OrderTransformer/Api/StatusEndpoints.cs` - Status tracking endpoint (stub)
- `ui/` - React frontend application

## Candidate Extension Points (STUBS to implement)

### Backend (.NET)
- `Services/OrderValidatorService.cs` - Validate order fields (required fields, format patterns, ranges)
- `Services/FieldMappingService.cs` - Map field values (country codes→names, product codes→categories, status→labels)
- `Api/StatusEndpoints.cs` - Return processing status for uploaded files
- `Tests/Services/OrderValidatorServiceTests.cs` - Unit tests for validation
- `Tests/Services/FieldMappingServiceTests.cs` - Unit tests for mapping

### Frontend (React/TypeScript)
- `ui/src/hooks/useProcessingStatus.ts` - Polling hook for file processing status
- `ui/src/components/ProcessingStatus.tsx` - Status display component
- `ui/src/api/client.ts` - `getStatus()` function (TODO comment)

## Commands
```bash
# .NET
dotnet build src/OrderTransformer                    # Build the app
dotnet test tests/OrderTransformer.Tests             # Run tests
dotnet run --project src/OrderTransformer            # Run locally (port 5000)

# UI
cd ui && pnpm install                                # Install UI dependencies
cd ui && pnpm dev                                    # Vite dev server (port 5173)
cd ui && pnpm build                                  # Build to wwwroot

# Docker
docker compose up -d                                 # Start Azurite
docker compose --profile app up --build -d           # Run everything
```

## Conventions

### C# (.NET)
- Use C# records with `init` setters for immutable models
- Follow existing interface + implementation pattern for services
- Use xUnit with `[Fact]` and `[Theory]` for tests
- Use `System.Text.Json` for JSON serialization
- Use `System.Xml.Linq` for XML parsing
- Namespace: `OrderTransformer.Models`, `OrderTransformer.Services`, `OrderTransformer.Worker`, `OrderTransformer.Api`

### TypeScript (React)
- Use TypeScript strict mode (no `any`)
- Define interfaces for all API response shapes in `types/api.ts`
- Use functional components with hooks
- Use TailwindCSS for styling (no CSS modules)
- Use React Router v7 for navigation
- API calls go through `api/client.ts`
