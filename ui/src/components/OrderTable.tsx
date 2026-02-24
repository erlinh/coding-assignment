import type { OrderItem } from '../types/api'

interface OrderTableProps {
  items: OrderItem[]
}

export default function OrderTable({ items }: OrderTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">#</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Product</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Description</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Qty</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Unit Price</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Currency</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr key={item.lineNumber}>
              <td className="px-4 py-2 text-sm text-gray-700">{item.lineNumber}</td>
              <td className="px-4 py-2 text-sm font-mono text-gray-700">{item.productCode}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{item.description}</td>
              <td className="px-4 py-2 text-right text-sm text-gray-700">{item.quantity}</td>
              <td className="px-4 py-2 text-right text-sm text-gray-700">{item.unitPrice.toFixed(2)}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{item.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
