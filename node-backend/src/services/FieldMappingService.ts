import type { OrderBatch, Order, OrderItem } from '../types/models.js';
import type { IFieldMappingService } from '../types/services.js';

const COUNTRY_MAP: Record<string, string> = {
  FI: 'Finland',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  US: 'United States',
  GB: 'United Kingdom',
  DE: 'Germany',
};

const PRODUCT_CATEGORY_MAP: Record<string, string> = {
  'PROD-001': 'Widgets',
  'PROD-002': 'Gadgets',
  'PROD-003': 'Premium Widgets',
};

const STATUS_MAP: Record<string, string> = {
  draft: 'Draft',
  confirmed: 'Order Confirmed',
  processing: 'In Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export class FieldMappingService implements IFieldMappingService {
  mapFields(batch: OrderBatch): OrderBatch {
    const mappedOrders = batch.orders.map((order) => this.mapOrder(order));
    return { ...batch, orders: mappedOrders };
  }

  private mapOrder(order: Order): Order {
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

  private mapItem(item: OrderItem): OrderItem {
    const category = PRODUCT_CATEGORY_MAP[item.productCode];
    if (category) {
      return { ...item, description: category };
    }
    return item;
  }
}
