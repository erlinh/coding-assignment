# Order Transformer — Coding Assessment

A .NET 9 and Node.js/Fastify application that monitors Azure Blob Storage (Azurite) for incoming XML order files, transforms them to JSON, and stores the output back to blob storage. Includes a React UI for viewing processed orders and uploading new files.

## Architecture

- **Backend**: .NET 9 Minimal API or Node.js/Fastify (TypeScript)
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Storage**: Azure Blob Storage (Azurite emulator)
- **Pipeline**: Parse XML → Validate → Map Fields → Transform to JSON → Store

## Quick Start

### Start Azurite

```bash
docker compose up -d
docker compose logs azurite-init
```

### Option 1: .NET Backend

```bash
dotnet run --project src/OrderTransformer
```

### Option 2: Node.js Backend

```bash
cd node-backend
npm install
npm run dev
```

### Frontend

```bash
cd ui && pnpm install && pnpm dev
```

## Services

- API Server: http://localhost:5000
- Swagger Docs (Node.js only): http://localhost:5000/docs
- React UI: http://localhost:5173
- Azurite Blob: http://localhost:10000

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/orders/stats` | Aggregate statistics |
| POST | `/api/orders/upload` | Upload XML file |
| GET | `/api/orders/` | List processed batches |
| GET | `/api/orders/{blobName}` | Get batch details |
| GET | `/api/orders/status/{fileName}` | Check processing status |
| GET | `/health` | Health check |

## Running Tests

### .NET Tests
```bash
dotnet test tests/OrderTransformer.Tests
```

### Node.js Tests
```bash
cd node-backend && npm test
```

## Project Structure

```
├── src/OrderTransformer/     # .NET backend
│   ├── Api/                  # REST endpoints
│   ├── Models/               # Domain models
│   ├── Services/             # Business logic
│   └── Worker/               # Background processing
├── node-backend/              # Node.js/Fastify backend
│   ├── src/
│   │   ├── routes/          # REST endpoints
│   │   ├── services/         # Business logic
│   │   ├── worker/           # Background processing
│   │   └── types/            # TypeScript types
│   └── tests/                # Unit tests
├── ui/                       # React frontend
└── docs/                    # Design specs
```

## Clean Up

```bash
docker compose --profile app down -v
```
