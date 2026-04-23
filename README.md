# Order Transformer — Coding Assessment

A Node.js/Fastify application that monitors Azure Blob Storage (Azurite) for incoming XML order files, transforms them to JSON, and stores the output back to blob storage. Includes a React UI for viewing processed orders and uploading new files.

## Architecture

- **Backend**: Node.js/Fastify (TypeScript)
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Storage**: Azure Blob Storage (Azurite emulator)
- **Pipeline**: Parse XML → Validate → Map Fields → Transform to JSON → Store

## Quick Start

### Start Azurite

```bash
docker compose up -d
docker compose logs azurite-init
```

### Start Backend

```bash
cd node-backend && npm install
npm run dev
```

### Start Frontend

```bash
cd ui && pnpm install && pnpm dev
```

Or run both together from root:

```bash
npm run dev
```

## Services

- API Server: http://localhost:5000
- Swagger Docs: http://localhost:5000/docs
- React UI: http://localhost:5173
- Azurite Blob: http://localhost:10000

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/orders/stats` | Aggregate statistics |
| POST | `/api/orders/upload` | Upload XML file |
| GET | `/api/orders` | List processed batches |
| GET | `/api/orders?id={blobName}` | Get batch details |
| GET | `/api/orders/status/{fileName}` | Check processing status |
| GET | `/health` | Health check |

## Running Tests

```bash
cd node-backend && npm test
```

## Project Structure

```
├── node-backend/              # Node.js/Fastify backend
│   ├── src/
│   │   ├── routes/          # REST endpoints
│   │   ├── services/         # Business logic
│   │   ├── worker/           # Background processing
│   │   ├── types/            # TypeScript types
│   │   └── config/           # Configuration
│   └── tests/                # Unit tests (Vitest)
├── ui/                       # React frontend
└── specs/                    # Feature specs and designs
```

## Clean Up

```bash
docker compose down -v
```
