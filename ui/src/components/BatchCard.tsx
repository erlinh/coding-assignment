import { Link } from 'react-router'
import type { OrderBatchSummary } from '../types/api'

interface BatchCardProps {
  batch: OrderBatchSummary
}

export default function BatchCard({ batch }: BatchCardProps) {
  const processedDate = batch.processedAt
    ? new Date(batch.processedAt).toLocaleString()
    : 'Unknown'

  return (
    <Link
      to={`/orders/${batch.blobName}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">{batch.blobName}</p>
          <p className="mt-1 text-xs text-gray-500">Tenant: {batch.tenantId ?? 'Unknown'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-indigo-600">{batch.orderCount} orders</p>
          {batch.validationErrorCount > 0 && (
            <p className="text-xs text-red-600">{batch.validationErrorCount} errors</p>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-400">{processedDate}</p>
    </Link>
  )
}
