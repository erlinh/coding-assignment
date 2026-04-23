const COUNTRY_MAP = {
    FI: 'Finland',
    SE: 'Sweden',
    NO: 'Norway',
    DK: 'Denmark',
    US: 'United States',
    GB: 'United Kingdom',
    DE: 'Germany',
};
const PRODUCT_CATEGORY_MAP = {
    'PROD-001': 'Widgets',
    'PROD-002': 'Gadgets',
    'PROD-003': 'Premium Widgets',
};
const STATUS_MAP = {
    draft: 'Draft',
    confirmed: 'Order Confirmed',
    processing: 'In Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};
export class FieldMappingService {
    mapFields(batch) {
        const mappedOrders = batch.orders.map((order) => this.mapOrder(order));
        return { ...batch, orders: mappedOrders };
    }
    mapOrder(order) {
        const mappedCountry = COUNTRY_MAP[order.customer.address.country] ?? order.customer.address.country;
        const mappedStatus = STATUS_MAP[order.header.status] ?? order.header.status;
        const mappedItems = order.items.map((item) => this.mapItem(item));
        return {
            ...order,
            header: { ...order.header, status: mappedStatus },
            customer: {
                ...order.customer,
                address: { ...order.customer.address, country: mappedCountry },
            },
            items: mappedItems,
        };
    }
    mapItem(item) {
        const category = PRODUCT_CATEGORY_MAP[item.productCode];
        if (category) {
            return { ...item, description: category };
        }
        return item;
    }
}
//# sourceMappingURL=FieldMappingService.js.map