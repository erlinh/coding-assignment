# New Feature: Upload Processing Status Tracking

## Background

The Order Transformer has a React UI where users can upload XML order files and view processed results. Currently, after uploading a file, the user sees a success message but has no way to know when processing finishes. The background worker picks up files from `input/`, processes them, and moves them to `output/` (success) or `failed/` (error) — but the UI doesn't reflect this.

## Requirements

### 1. Status Endpoint (Backend)

Implement a REST endpoint that returns the processing status of a file:

**`GET /api/orders/status/{fileName}`**

The status is determined by checking where the file exists in blob storage:

| Check | Blob Path | Status |
|-------|-----------|--------|
| Output exists? | `output/{fileNameWithoutExtension}.json` | `completed` |
| Failed exists? | `failed/{fileName}` | `failed` |
| Input exists? | `input/{fileName}` | `pending` |
| None found | — | `not_found` |

**Response shape:**
```json
{
  "fileName": "order-batch-001.xml",
  "status": "completed",
  "outputBlobName": "output/order-batch-001.json"
}
```

The `outputBlobName` field should only be present when status is `completed`.

### 2. Polling Hook (Frontend)

Implement a React hook that polls the status endpoint:

```typescript
function useProcessingStatus(fileName: string | null): {
  status: ProcessingStatus | null
  error: string | null
}
```

**Behavior:**
- When `fileName` is null, do nothing
- When `fileName` is set, immediately fetch status, then poll every 2 seconds
- Stop polling when status reaches a terminal state (`completed` or `failed`)
- Clean up the interval when the component unmounts or `fileName` changes

### 3. Status Component (Frontend)

Implement a React component that displays the processing status:

**States to render:**
- **Pending**: Amber/yellow indicator with pulsing animation — "Processing your file..."
- **Completed**: Green success indicator with a link to view results at `/orders/{outputBlobName}`
- **Failed**: Red error indicator — "Processing failed"
- **Not found**: Gray message — "File not found in processing queue"

### 4. API Client Function (Frontend)

Add a `getStatus(fileName)` function to the API client (`ui/src/api/client.ts`).

### 5. Integration

Wire the status tracking into the upload page:
- After a successful upload, show the `ProcessingStatus` component
- The component should automatically poll and update
- When completed, the user can click through to view results

## Where to Implement

| File | What to Implement |
|------|-------------------|
| `node-backend/src/routes/status.ts` | Status checking logic (check prefixes in blob storage) |
| `ui/src/api/client.ts` | `getStatus(fileName)` function |
| `ui/src/hooks/useProcessingStatus.ts` | Polling hook with useEffect and setInterval |
| `ui/src/components/ProcessingStatus.tsx` | Status display component with all states |
| `ui/src/pages/UploadPage.tsx` | Integration (add state + render ProcessingStatus) |

Each file has TODO comments explaining what to implement.

## Design Phase — What to Draw

Before coding, consider:

### Data Flow
```
Upload Page
    │
    ├── POST /api/orders/upload  →  input/{fileName}
    │
    └── useProcessingStatus(fileName)
            │
            ├── GET /api/orders/status/{fileName}
            │       │
            │       └── Check: output/ → failed/ → input/ → not_found
            │
            ├── Poll every 2s until terminal state
            │
            └── Render: pending → completed (with link) / failed
```

### useEffect Lifecycle
- What triggers the effect? (`fileName` dependency)
- How to store the interval ID for cleanup?
- When to stop polling?
- What happens on unmount?

### Edge Cases
- What if the file is processed before the first poll?
- What if the network request fails during polling?
- What if the user uploads another file before the first one finishes?

## Acceptance Criteria

- [ ] Status endpoint returns correct status for files in each prefix
- [ ] `outputBlobName` included only for completed status
- [ ] Polling hook starts on upload, stops on terminal state
- [ ] Interval cleaned up on unmount (no memory leaks)
- [ ] All four status states rendered with appropriate styling
- [ ] Completed status links to the order detail page
- [ ] Upload → poll → status → view results works end-to-end
- [ ] TypeScript types used correctly (no `any`)
