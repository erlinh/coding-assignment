# Order Transformer - Coding Assessment

## Project Overview
This is a Node.js/Fastify application that monitors Azure Blob Storage (Azurite emulator) for incoming XML order files, transforms them to JSON, and writes output back to blob storage. It includes a React UI for viewing processed orders and uploading new files.

## Architecture
- **Pipeline pattern**: `Parse XML → Validate → Map Fields → Transform to JSON → Store`
- **Factory-based DI**: All services created via factory functions
- **Background worker**: `BlobPollingWorker` polls blob storage on a timer using setInterval
- **Fastify routes**: REST endpoints for listing, viewing, and uploading orders
- **React UI**: Single-page app served from Vite dev server or static build

## Key Files
- `node-backend/src/index.ts` - Fastify server setup and start
- `node-backend/src/worker/TransformationPipeline.ts` - Orchestrates the processing pipeline
- `node-backend/src/worker/BlobPollingWorker.ts` - Polls blob storage for new files
- `node-backend/src/types/models.ts` - Domain models (TypeScript interfaces)
- `node-backend/src/services/` - All service implementations
- `node-backend/src/routes/orders.ts` - REST API endpoints
- `node-backend/src/routes/status.ts` - Status tracking endpoint
- `ui/` - React frontend application

## Candidate Extension Points (STUBS to implement)

### Frontend (React/TypeScript) — Spec 004
The main interview task is implementing upload processing status tracking:

1. **`ui/src/api/client.ts`** — Implement `getStatus(fileName)` function (see TODO comment)
2. **`ui/src/hooks/useProcessingStatus.ts`** — Polling hook that polls every 2 seconds, stops on terminal state
3. **`ui/src/components/ProcessingStatus.tsx`** — Status display (pending/completed/failed/not_found)
4. **`ui/src/pages/UploadPage.tsx`** — Wire ProcessingStatus after successful upload

### Backend (Already Implemented)
- Status endpoint: `GET /api/orders/status/{fileName}` ✅
- Validation service: `OrderValidatorService.ts` ✅
- Field mapping service: `FieldMappingService.ts` ✅

## Commands
```bash
# Backend
cd node-backend && npm install         # Install dependencies
cd node-backend && npm run build       # Build TypeScript
cd node-backend && npm test            # Run tests
npm run dev                           # Run both backend + frontend (from root)

# UI
cd ui && pnpm install                 # Install UI dependencies
cd ui && pnpm dev                     # Vite dev server (port 5173)
cd ui && pnpm build                   # Build to static files

# Docker
docker compose up -d                  # Start Azurite
npm run dev                           # Run app with nx (both services)
```

## Conventions

### TypeScript (Node.js/Fastify)
- Use TypeScript strict mode (no `any`)
- Use `interface` for object shapes and `type` for unions/primitives
- Follow existing factory pattern for service instantiation
- Use Vitest with `describe`/`it`/`expect` for tests
- Use `fast-xml-parser` for XML parsing
- Use `@azure/storage-blob` for blob operations
- Namespace folders by concern: `routes/`, `services/`, `worker/`, `types/`, `config/`

### TypeScript (React)
- Use TypeScript strict mode (no `any`)
- Define interfaces for all API response shapes in `types/api.ts`
- Use functional components with hooks
- Use TailwindCSS for styling (no CSS modules)
- Use React Router v7 for navigation
- API calls go through `api/client.ts`
