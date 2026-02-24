import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router'
import type { OrderBatchDetail } from '../types/api'
import { getBatch } from '../api/client'
import OrderTable from '../components/OrderTable'
import ErrorList from '../components/ErrorList'
import LoadingSpinner from '../components/LoadingSpinner'

export default function OrderDetailPage() {
  const location = useLocation()
  // The blob name is everything after /orders/
  const blobName = location.pathname.replace(/^\/orders\//, '')

  const [batch, setBatch] = useState<OrderBatchDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getBatch(blobName)
        setBatch(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order batch')
      } finally {
        setLoading(false)
      }
    }
    if (blobName) load()
  }, [blobName])

  if (loading) return <LoadingSpinner />

  if (error || !batch) {
    return (
      <div className="space-y-4">
        <Link to="/" className="text-sm text-indigo-600 hover:underline">&larr; Back to dashboard</Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error ?? 'Batch not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm text-indigo-600 hover:underline">&larr; Back to dashboard</Link>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">{blobName}</h2>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Tenant: <span className="font-medium">{batch.tenantId}</span></span>
          <span>Processed: <span className="font-medium">{new Date(batch.processedAt).toLocaleString()}</span></span>
          <span>Orders: <span className="font-medium">{batch.orderCount}</span></span>
          {batch.validationErrorCount > 0 && (
            <span className="text-red-600">Errors: <span className="font-medium">{batch.validationErrorCount}</span></span>
          )}
        </div>
      </div>

      {batch.validationErrors && batch.validationErrors.length > 0 && (
        <ErrorList errors={batch.validationErrors} />
      )}

      {batch.orders.map((order) => (
        <div key={order.header.orderId} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{order.header.orderId}</h3>
              <p className="text-sm text-gray-500">
                {order.header.orderDate} &middot; {order.header.status}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {order.totals.total.toFixed(2)} {order.totals.currency}
              </p>
              <p className="text-xs text-gray-500">
                Subtotal: {order.totals.subtotal.toFixed(2)} + Tax: {order.totals.taxAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mb-4 rounded-md bg-gray-50 p-3">
            <p className="text-sm font-medium text-gray-700">{order.customer.name}</p>
            <p className="text-xs text-gray-500">{order.customer.email}</p>
            <p className="text-xs text-gray-500">
              {order.customer.address.street}, {order.customer.address.city}{' '}
              {order.customer.address.postalCode}, {order.customer.address.country}
            </p>
          </div>

          <OrderTable items={order.items} />
        </div>
      ))}
    </div>
  )
}
