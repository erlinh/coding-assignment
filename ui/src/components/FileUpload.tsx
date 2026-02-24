import { useRef, useState, type ChangeEvent } from 'react'

interface FileUploadProps {
  onUpload: (file: File) => void
  isUploading: boolean
}

export default function FileUpload({ onUpload, isUploading }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  function handleSubmit() {
    if (selectedFile) {
      onUpload(selectedFile)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">XML Order File</label>
        <input
          ref={inputRef}
          type="file"
          accept=".xml"
          onChange={handleChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>
      {selectedFile && (
        <p className="text-sm text-gray-600">
          Selected: <span className="font-medium">{selectedFile.name}</span> ({(selectedFile.size / 1024).toFixed(1)} KB)
        </p>
      )}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || isUploading}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  )
}
