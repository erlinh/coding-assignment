// TODO: Implement the useProcessingStatus hook
//
// This hook should poll the backend for the processing status of an uploaded file.
//
// Parameters:
//   fileName: string | null — the name of the uploaded file to track (null = don't poll)
//
// Returns:
//   { status: ProcessingStatus | null, error: string | null }
//
// Implementation steps:
//
// 1. Use useState to track the current ProcessingStatus and any error
//
// 2. Use useEffect that runs when fileName changes:
//    - If fileName is null, do nothing (clear status)
//    - Call getStatus(fileName) from '../api/client' immediately
//    - Set up an interval that polls every 2 seconds
//    - On each poll, update the status state
//    - Stop polling when status reaches a terminal state ('completed' or 'failed')
//    - Clean up the interval on unmount or when fileName changes
//
// 3. Return { status, error }
//
// Type imports you'll need:
//   import { useState, useEffect } from 'react'
//   import type { ProcessingStatus } from '../types/api'
//   import { getStatus } from '../api/client'
//
// Remember to handle the cleanup function in useEffect to clear the interval.

import type { ProcessingStatus } from '../types/api'

export function useProcessingStatus(_fileName: string | null): {
  status: ProcessingStatus | null
  error: string | null
} {
  // STUB: Replace this with your implementation
  return { status: null, error: null }
}
