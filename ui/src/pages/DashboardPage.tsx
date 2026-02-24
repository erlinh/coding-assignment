import { useEffect, useState } from 'react'
import type { OrderBatchSummary, Stats } from '../types/api'
import { listBatches, getStats } from '../api/client'
import StatCard from '../components/StatCard'
import BatchCard from '../components/BatchCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function DashboardPage() {
  const [batches, setBatches] = useState<OrderBatchSummary[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [batchData, statsData] = await Promise.all([listBatches(), getStats()])
        setBatches(batchData)
        setStats(statsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Batches" value={stats.totalBatches} color="indigo" />
          <StatCard label="Orders" value={stats.totalOrders} color="green" />
          <StatCard label="Errors" value={stats.totalValidationErrors} color="red" />
          <StatCard label="Pending" value={stats.pendingFiles} color="amber" />
        </div>
      )}

      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-800">Processed Batches</h3>
        {batches.length === 0 ? (
          <p className="text-sm text-gray-500">No processed batches yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {batches.map((batch) => (
              <BatchCard key={batch.blobName} batch={batch} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
