import type { ValidationError } from '../types/api'

interface ErrorListProps {
  errors: ValidationError[]
}

export default function ErrorList({ errors }: ErrorListProps) {
  if (errors.length === 0) return null

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <h3 className="text-sm font-medium text-red-800">
        Validation Errors ({errors.length})
      </h3>
      <ul className="mt-2 space-y-1">
        {errors.map((error, i) => (
          <li key={i} className="text-sm text-red-700">
            <span className="font-mono text-xs">[{error.errorCode}]</span>{' '}
            <span className="font-medium">{error.orderId}</span> &mdash;{' '}
            {error.field}: {error.message}
          </li>
        ))}
      </ul>
    </div>
  )
}
