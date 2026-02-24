interface StatusBadgeProps {
  status: string
}

const statusStyles: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  failed: 'bg-red-100 text-red-800',
  not_found: 'bg-gray-100 text-gray-800',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] ?? 'bg-gray-100 text-gray-800'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
