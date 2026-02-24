# Feature 004: Upload Processing Status Tracking

**Status:** Not Started (Candidate Extension Point)

## Background

When a user uploads an XML order file through the UI, they receive a success confirmation but have no way to track whether the file has been processed, failed, or is still pending. The background worker processes files asynchronously, so there's a gap between upload and seeing results.

## Requirements

### Status Endpoint (Backend)
- `GET /api/orders/status/{fileName}` returns the current processing status
- Status is determined by checking blob storage prefixes:
  - File found in `output/` (as `.json`) → `completed`
  - File found in `failed/` → `failed`
  - File found in `input/` → `pending`
  - Not found anywhere → `not_found`
- Response includes `fileName`, `status`, and optionally `outputBlobName` (when completed)

### Polling Hook (Frontend)
- Custom React hook `useProcessingStatus(fileName)`
- Polls the status endpoint every 2 seconds
- Stops polling when a terminal state is reached (`completed` or `failed`)
- Cleans up interval on unmount

### Status Component (Frontend)
- Displays current processing status with appropriate styling:
  - **Pending**: Amber/yellow with pulsing animation
  - **Completed**: Green with link to view results
  - **Failed**: Red error indicator
  - **Not found**: Gray neutral message
- Integrates into the upload page after successful upload

### API Client (Frontend)
- `getStatus(fileName)` function in the API client module

## Acceptance Criteria

- [ ] Status endpoint correctly identifies file status from blob prefixes
- [ ] Polling hook starts on upload, stops on terminal state
- [ ] Interval is cleaned up on component unmount
- [ ] All status states rendered with appropriate styling
- [ ] Completed status includes clickable link to results
- [ ] Upload page shows status after successful upload
- [ ] TypeScript types used correctly (no `any`)
- [ ] End-to-end flow works: upload → pending → completed → view results
