export interface OrderBatchSummary {
  blobName: string
  tenantId: string | null
  processedAt: string | null
  orderCount: number
  validationErrorCount: number
}

export interface OrderBatchDetail {
  tenantId: string
  processedAt: string
  orderCount: number
  validationErrorCount: number
  validationErrors?: ValidationError[]
  orders: Order[]
}

export interface Order {
  header: OrderHeader
  customer: Customer
  items: OrderItem[]
  totals: OrderTotals
}

export interface OrderHeader {
  orderId: string
  orderDate: string
  status: string
}

export interface Customer {
  customerId: string
  name: string
  email: string
  address: Address
}

export interface Address {
  street: string
  city: string
  postalCode: string
  country: string
}

export interface OrderItem {
  lineNumber: number
  productCode: string
  description: string
  quantity: number
  unitPrice: number
  currency: string
}

export interface OrderTotals {
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  currency: string
}

export interface ValidationError {
  orderId: string
  field: string
  message: string
  errorCode: string
}

export interface Stats {
  totalBatches: number
  totalOrders: number
  totalValidationErrors: number
  pendingFiles: number
  failedFiles: number
}

export interface UploadResponse {
  message: string
  blobName: string
  fileName: string
}

export interface ProcessingStatus {
  fileName: string
  status: 'pending' | 'completed' | 'failed' | 'not_found'
  outputBlobName?: string
}
