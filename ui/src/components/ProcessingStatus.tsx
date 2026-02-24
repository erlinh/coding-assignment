// TODO: Implement the ProcessingStatus component
//
// This component displays the real-time processing status of an uploaded file.
//
// Props:
//   fileName: string — the name of the file being tracked
//
// Implementation steps:
//
// 1. Use the useProcessingStatus hook to get the current status:
//    import { useProcessingStatus } from '../hooks/useProcessingStatus'
//    const { status, error } = useProcessingStatus(fileName)
//
// 2. Render different UI based on status.status:
//
//    - null / loading: Show a loading spinner or "Checking status..."
//
//    - 'pending': Show an amber/yellow indicator with a pulsing animation
//      to indicate the file is still being processed.
//      Example: "Processing... your file is being transformed."
//
//    - 'completed': Show a green success indicator with a link to view the results.
//      The link should navigate to /orders/{status.outputBlobName}
//      Example: "Processing complete!" with a "View Results" link
//
//    - 'failed': Show a red error indicator.
//      Example: "Processing failed. The file could not be transformed."
//
//    - 'not_found': Show a gray/neutral message.
//      Example: "File not found in processing queue."
//
// 3. If error is set, show an error message.
//
// You may use the StatusBadge component for consistent styling:
//   import StatusBadge from './StatusBadge'

interface ProcessingStatusProps {
  fileName: string
}

export default function ProcessingStatus({ fileName }: ProcessingStatusProps) {
  // STUB: Replace this with your implementation
  return (
    <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-500">
      Status tracking not yet implemented for: {fileName}
    </div>
  )
}
