import { useState } from 'react'
import { uploadFile } from '../api/client'
import FileUpload from '../components/FileUpload'

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // TODO: After a successful upload, use the ProcessingStatus component to show
  // real-time processing status for the uploaded file.
  // You will need:
  // 1. Track the uploaded fileName in state
  // 2. Render <ProcessingStatus fileName={uploadedFileName} /> after upload
  // 3. The component should show pending → completed/failed status

  async function handleUpload(file: File) {
    setIsUploading(true)
    setResult(null)
    try {
      const response = await uploadFile(file)
      setResult({ success: true, message: response.message })
    } catch (err) {
      setResult({
        success: false,
        message: err instanceof Error ? err.message : 'Upload failed',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Upload Order File</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <FileUpload onUpload={handleUpload} isUploading={isUploading} />

        {result && (
          <div
            className={`mt-4 rounded-md p-3 text-sm ${
              result.success
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {result.message}
          </div>
        )}
      </div>
    </div>
  )
}
