export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderTotals {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
}

export interface OrderItem {
  lineNumber: number;
  productCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface Customer {
  customerId: string;
  name: string;
  email: string;
  address: Address;
}

export interface OrderHeader {
  orderId: string;
  orderDate: string;
  status: string;
}

export interface Order {
  header: OrderHeader;
  customer: Customer;
  items: OrderItem[];
  totals: OrderTotals;
}

export interface OrderBatch {
  tenantId: string;
  orders: Order[];
}

export interface ValidationError {
  orderId: string;
  field: string;
  message: string;
  errorCode: string;
}