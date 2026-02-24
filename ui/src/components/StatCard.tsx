interface StatCardProps {
  label: string
  value: number
  color?: 'indigo' | 'green' | 'red' | 'amber'
}

const colorMap = {
  indigo: 'bg-indigo-50 text-indigo-700',
  green: 'bg-green-50 text-green-700',
  red: 'bg-red-50 text-red-700',
  amber: 'bg-amber-50 text-amber-700',
}

export default function StatCard({ label, value, color = 'indigo' }: StatCardProps) {
  return (
    <div className={`rounded-lg p-4 ${colorMap[color]}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </div>
  )
}
