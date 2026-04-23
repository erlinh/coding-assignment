export interface Address {
    street: string;
    city: string;
    postalCode: string;
    country: string;
}
export interface Customer {
    customerId: string;
    name: string;
    email: string;
    address: Address;
}
export interface OrderItem {
    lineNumber: number;
    productCode: string;
    description: string;
    quantity: number;
    unitPrice: number;
    currency: string;
}
export interface OrderTotals {
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    currency: string;
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
export interface TransformationResult {
    success: boolean;
    json: string;
    validationErrors: ValidationError[];
    sourceBlobName: string;
    errorMessage?: string;
}
export type PipelineStage = {
    stage: 'parse';
    batch?: OrderBatch;
    error?: string;
} | {
    stage: 'validate';
    batch?: OrderBatch;
    errors?: ValidationError[];
} | {
    stage: 'map';
    batch?: OrderBatch;
    errors?: ValidationError[];
} | {
    stage: 'transform';
    json?: string;
    errors?: ValidationError[];
};
//# sourceMappingURL=models.d.ts.map