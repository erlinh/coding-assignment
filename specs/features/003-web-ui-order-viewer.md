# Feature 003: Web UI Order Viewer

**Status:** Implemented

## Background

The Order Transformer system processes XML order files into JSON, but there is no way to view the results without directly accessing blob storage. A web UI would allow users to browse processed batches, view order details, and upload new files.

## Requirements

### Dashboard
- Display summary statistics: total batches, total orders, validation errors, pending files
- List all processed batches with key metadata (tenant, timestamp, counts)
- Each batch links to a detail view

### Order Detail View
- Show batch metadata (tenant ID, processed timestamp, order/error counts)
- Display validation errors if present
- For each order: header info, customer details, line items table, totals

### File Upload
- Accept XML files via file picker
- Validate file type before upload
- Show success/error feedback after upload
- File is written to the `input/` blob prefix for processing

### API Endpoints
- `GET /api/orders` — List output blobs with summary data
- `GET /api/orders/stats` — Aggregate statistics across all blobs
- `GET /api/orders/{blobName}` — Raw JSON content of a specific output blob
- `POST /api/orders/upload` — Upload an XML file to the input prefix

## Technical Decisions

- **Web Host**: Converted from Worker SDK to Web SDK; `WebApplication` supports both API endpoints and `AddHostedService` for the background worker
- **Minimal API**: Used `MapGroup` and endpoint methods rather than controllers for lightweight routing
- **CORS**: Configured for Vite dev server (localhost:5173) during development
- **Static Files**: Production builds served via `UseStaticFiles` + `MapFallbackToFile` for SPA routing
- **React + Vite**: TypeScript, TailwindCSS v3, React Router v7
- **Proxy**: Vite dev server proxies `/api` to the .NET backend on port 5000

## Acceptance Criteria

- [x] Dashboard shows stats and batch list
- [x] Clicking a batch shows order details with all fields
- [x] Validation errors displayed when present
- [x] File upload writes XML to input/ prefix
- [x] API endpoints return correct data
- [x] SPA routing works (browser refresh on any page)
- [x] Production build served by .NET in Docker
