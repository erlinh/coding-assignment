import type { OrderBatchSummary, OrderBatchDetail, Stats, UploadResponse, ProcessingStatus } from '../types/api'

const BASE_URL = '/api/orders'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

export async function listBatches(): Promise<OrderBatchSummary[]> {
  return fetchJson<OrderBatchSummary[]>(BASE_URL)
}

export async function getBatch(blobName: string): Promise<OrderBatchDetail> {
  return fetchJson<OrderBatchDetail>(`${BASE_URL}?id=${encodeURIComponent(blobName)}`)
}

export async function getStats(): Promise<Stats> {
  return fetchJson<Stats>(`${BASE_URL}/stats`)
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }))
    throw new Error((error as { error: string }).error || 'Upload failed')
  }

  return response.json() as Promise<UploadResponse>
}

// TODO: Implement getStatus function
// This function should fetch the processing status for an uploaded file.
//
// Signature:
//   export async function getStatus(fileName: string): Promise<ProcessingStatus>
//
// It should call: GET /api/orders/status/{fileName}
// and return the ProcessingStatus response.
//
// Example:
//   const status = await getStatus('order-batch-001.xml')
//   // returns: { fileName: 'order-batch-001.xml', status: 'completed' }
