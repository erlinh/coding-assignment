# Order Transformer - Node.js/Fastify Port

## Overview

Port the existing .NET 9 backend to Node.js/Fastify with TypeScript. The React UI remains unchanged. All API contracts, data types, and runtime behavior must match the .NET implementation exactly.

## Architecture

```
src/
├── index.ts                  # Fastify server setup, plugin registration, start()
├── routes/
│   ├── orders.ts            # /api/orders/* endpoints
│   └── status.ts            # /api/orders/status/* endpoints
├── services/
│   ├── factories.ts          # Service factory functions (manual DI)
│   ├── XmlParserService.ts   # XML parsing with fast-xml-parser
│   ├── OrderValidatorService.ts
│   ├── FieldMappingService.ts
│   ├── JsonTransformerService.ts
│   └── BlobStorageService.ts # Azure SDK (@azure/storage-blob)
├── worker/
│   ├── BlobPollingWorker.ts      # Background polling via setInterval
│   └── TransformationPipeline.ts # Async iterator pipeline
├── types/
│   └── index.ts              # TypeScript interfaces matching React UI types
└── config/
    └── index.ts              # Configuration from environment variables
```

### Design Decisions

- **Runtime behavior**: Same inline polling as .NET BackgroundService (setInterval in main process)
- **Dependency injection**: Manual factory pattern (no IoC container)
- **Pipeline pattern**: Async iterator (Approach 1) matching .NET's Parse → Validate → Map → Transform flow
- **Error handling**: Collect all validation errors, return 200 with `validationErrors` array
- **Library choices**:
  - XML parsing: `fast-xml-parser`
  - Blob storage: `@azure/storage-blob`
  - Testing: Vitest + sinon

## API Endpoints

All routes under `/api/orders/`:

| Method | Route | Handler | Description |
|--------|-------|---------|-------------|
| GET | `/stats` | `getStats` | Aggregate counts: totalBatches, totalOrders, errorCount, pendingCount, failedCount |
| POST | `/upload` | `uploadOrder` | Accept multipart XML file, write to `input/` prefix |
| GET | `/` | `listOrders` | List all batches in `output/` prefix with summaries |
| GET | `/{blobName}` | `getOrder` | Get full batch JSON from `output/` prefix |
| GET | `/status/{fileName}` | `getStatus` | Check prefix: `input/`=pending, `output/`=completed, `failed/`=failed |

## Data Types

Types in `types/index.ts` mirror .NET records exactly:

```typescript
interface OrderBatchSummary {
  blobName: string;
  tenantId: string;
  orderCount: number;
  processedAt: string;
  validationErrorCount: number;
}

interface OrderBatchDetail {
  tenantId: string;
  processedAt: string;
  orderCount: number;
  validationErrorCount: number;
  validationErrors: ValidationError[] | null;
  orders: Order[];
}

interface ValidationError {
  orderId: string;
  field: string;
  message: string;
  errorCode: string;
}

interface Order {
  header: OrderHeader;
  customer: Customer;
  items: OrderItem[];
  totals: OrderTotals;
}
// ... OrderHeader, Customer, Address, OrderItem, OrderTotals matching .NET shapes
```

## Configuration

`config/index.ts` loads from environment variables with defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `BLOB_STORAGE_CONNECTION_STRING` | Dev Azurite default | Blob storage connection |
| `BLOB_STORAGE_CONTAINER` | `orders` | Container name |
| `INPUT_PREFIX` | `input/` | Input file prefix |
| `OUTPUT_PREFIX` | `output/` | Output file prefix |
| `PROCESSED_PREFIX` | `processed/` | Processed file prefix |
| `FAILED_PREFIX` | `failed/` | Failed file prefix |
| `POLLING_INTERVAL_MS` | `5000` | Polling interval |
| `PORT` | `5000` | Server port |
| `HOST` | `0.0.0.0` | Server host |

## Service Interfaces

### XmlParserService
- Input: XML string
- Output: `OrderBatch` (parsed domain object)
- Uses `fast-xml-parser` with namespace `http://example.com/schemas/order/v1`
- Throws on malformed XML

### OrderValidatorService
- Input: `OrderBatch`
- Output: `ValidationError[]`
- Validates: required fields, email format, country codes (2-letter ISO), quantity > 0, prices >= 0

### FieldMappingService
- Input: `OrderBatch`
- Output: `OrderBatch` (mapped)
- Maps: country codes (FI→Finland), product codes (PROD-001→Widgets), status (confirmed→Order Confirmed)

### JsonTransformerService
- Input: `OrderBatch`
- Output: JSON string
- Uses `JSON.stringify` with camelCase property names

### BlobStorageService
- Wraps `@azure/storage-blob`
- Methods: `listBlobs(prefix)`, `downloadBlob(name)`, `uploadBlob(name, data)`, `moveBlob(source, dest)`
- Uses `ContainerClient` from Azure SDK

## TransformationPipeline

Async generator implementing the pipeline:

```typescript
async function* TransformationPipeline(
  xmlContent: string,
  sourceBlobName: string
): AsyncGenerator<TransformStep> {
  // Step 1: Parse XML
  const batch = XmlParserService.parse(xmlContent);

  // Step 2: Validate (collect all errors)
  const errors = OrderValidatorService.validate(batch);

  // Step 3: Map fields (only if no errors, or map partial)
  const mappedBatch = FieldMappingService.mapFields(batch);

  // Step 4: Transform to JSON
  const json = JsonTransformerService.transform(mappedBatch);

  yield { step: 'complete', json, errors };
}
```

## BlobPollingWorker

- Starts on server initialization (not on first request)
- Uses `setInterval` at `POLLING_INTERVAL_MS`
- On new file in `input/`:
  1. Download XML content
  2. Run through `TransformationPipeline`
  3. On success: upload JSON to `output/`, move XML to `processed/`
  4. On failure: move XML to `failed/`, store errors alongside
- Uses blob metadata or separate error log for per-file error storage

## Blob Prefix Strategy

| Prefix | Contents | Created By |
|--------|----------|------------|
| `input/` | Raw XML uploads | `uploadOrder` endpoint |
| `output/` | Transformed JSON batches | `TransformationPipeline` |
| `processed/` | Successfully processed XML | `BlobPollingWorker` |
| `failed/` | Failed XML files | `BlobPollingWorker` |

## Testing

Test files alongside implementation (`*.test.ts`):

| Test File | Scope |
|-----------|-------|
| `XmlParserService.test.ts` | XML parsing, namespace handling, malformed XML |
| `OrderValidatorService.test.ts` | Required fields, email format, country codes, ranges |
| `FieldMappingService.test.ts` | Country codes, product codes, status mapping |
| `BlobStorageService.test.ts` | Upload, download, list, move operations |
| `TransformationPipeline.test.ts` | Full pipeline, error collection |
| `orders.test.ts` | HTTP endpoint tests |

Test utilities: Vitest (test runner), sinon (mocking), `@azure/storage-blob` mock.

## File Constraints

- All TypeScript strict mode (no `any`)
- No code comments unless explaining non-obvious logic
- Service interfaces defined in same file as implementation (no separate interface files in TypeScript)
