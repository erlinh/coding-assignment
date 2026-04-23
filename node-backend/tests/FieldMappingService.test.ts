import { describe, it, expect } from 'vitest';
import { FieldMappingService } from '../src/services/FieldMappingService';
import type { OrderBatch } from '../src/types/models';

function createTestBatch(
  country: string = 'FI',
  productCode: string = 'PROD-001',
  status: string = 'confirmed'
): OrderBatch {
  return {
    tenantId: 'test-tenant',
    orders: [
      {
        header: {
          orderId: 'ORD-2024-001234',
          orderDate: '2024-01-15T10:30:00Z',
          status
        },
        customer: {
          customerId: 'CUST-5678',
          name: 'Test Corp',
          email: 'test@example.com',
          address: {
            street: '123 Test St',
            city: 'Helsinki',
            postalCode: '00100',
            country
          }
        },
        items: [
          {
            lineNumber: 1,
            productCode,
            description: 'Widget',
            quantity: 10,
            unitPrice: 29.99,
            currency: 'EUR'
          }
        ],
        totals: {
          subtotal: 299.90,
          taxRate: 24,
          taxAmount: 71.98,
          total: 371.88,
          currency: 'EUR'
        }
      }
    ]
  };
}

describe('FieldMappingService', () => {
  const sut = new FieldMappingService();

  describe('mapFields', () => {
    it('valid batch returns batch with same order count', () => {
      const batch = createTestBatch();

      const result = sut.mapFields(batch);

      expect(result.orders.length).toBe(batch.orders.length);
    });

    it('country code FI maps to Finland', () => {
      const batch = createTestBatch('FI');

      const result = sut.mapFields(batch);

      expect(result.orders[0].customer.address.country).toBe('Finland');
    });

    it('country code SE maps to Sweden', () => {
      const batch = createTestBatch('SE');

      const result = sut.mapFields(batch);

      expect(result.orders[0].customer.address.country).toBe('Sweden');
    });

    it('country code NO maps to Norway', () => {
      const batch = createTestBatch('NO');

      const result = sut.mapFields(batch);

      expect(result.orders[0].customer.address.country).toBe('Norway');
    });

    it('country code DK maps to Denmark', () => {
      const batch = createTestBatch('DK');

      const result = sut.mapFields(batch);

      expect(result.orders[0].customer.address.country).toBe('Denmark');
    });

    it('country code US maps to United States', () => {
      const batch = createTestBatch('US');

      const result = sut.mapFields(batch);

      expect(result.orders[0].customer.address.country).toBe('United States');
    });

    it('country code GB maps to United Kingdom', () => {
      const batch = createTestBatch('GB');

      const result = sut.mapFields(batch);

      expect(result.orders[0].customer.address.country).toBe('United Kingdom');
    });

    it('country code DE maps to Germany', () => {
      const batch = createTestBatch('DE');

      const result = sut.mapFields(batch);

      expect(result.orders[0].customer.address.country).toBe('Germany');
    });

    it('unknown country code leaves unchanged', () => {
      const batch = createTestBatch('XX');

      const result = sut.mapFields(batch);

      expect(result.orders[0].customer.address.country).toBe('XX');
    });

    it('product code PROD-001 maps to Widgets', () => {
      const batch = createTestBatch('FI', 'PROD-001');

      const result = sut.mapFields(batch);

      expect(result.orders[0].items[0].description).toBe('Widgets');
    });

    it('product code PROD-002 maps to Gadgets', () => {
      const batch = createTestBatch('FI', 'PROD-002');

      const result = sut.mapFields(batch);

      expect(result.orders[0].items[0].description).toBe('Gadgets');
    });

    it('product code PROD-003 maps to Premium Widgets', () => {
      const batch = createTestBatch('FI', 'PROD-003');

      const result = sut.mapFields(batch);

      expect(result.orders[0].items[0].description).toBe('Premium Widgets');
    });

    it('unknown product code leaves description unchanged', () => {
      const batch = createTestBatch('FI', 'PROD-999');

      const result = sut.mapFields(batch);

      expect(result.orders[0].items[0].description).toBe('Widget');
    });

    it('status draft maps to Draft', () => {
      const batch = createTestBatch('FI', 'PROD-001', 'draft');

      const result = sut.mapFields(batch);

      expect(result.orders[0].header.status).toBe('Draft');
    });

    it('status confirmed maps to Order Confirmed', () => {
      const batch = createTestBatch('FI', 'PROD-001', 'confirmed');

      const result = sut.mapFields(batch);

      expect(result.orders[0].header.status).toBe('Order Confirmed');
    });

    it('status processing maps to In Processing', () => {
      const batch = createTestBatch('FI', 'PROD-001', 'processing');

      const result = sut.mapFields(batch);

      expect(result.orders[0].header.status).toBe('In Processing');
    });

    it('status shipped maps to Shipped', () => {
      const batch = createTestBatch('FI', 'PROD-001', 'shipped');

      const result = sut.mapFields(batch);

      expect(result.orders[0].header.status).toBe('Shipped');
    });

    it('status delivered maps to Delivered', () => {
      const batch = createTestBatch('FI', 'PROD-001', 'delivered');

      const result = sut.mapFields(batch);

      expect(result.orders[0].header.status).toBe('Delivered');
    });

    it('status cancelled maps to Cancelled', () => {
      const batch = createTestBatch('FI', 'PROD-001', 'cancelled');

      const result = sut.mapFields(batch);

      expect(result.orders[0].header.status).toBe('Cancelled');
    });

    it('unknown status leaves unchanged', () => {
      const batch = createTestBatch('FI', 'PROD-001', 'custom-status');

      const result = sut.mapFields(batch);

      expect(result.orders[0].header.status).toBe('custom-status');
    });

    it('multiple orders all are mapped', () => {
      const batch: OrderBatch = {
        tenantId: 'test-tenant',
        orders: [
          {
            header: { orderId: 'ORD-2024-000001', orderDate: '2024-01-15T10:30:00Z', status: 'confirmed' },
            customer: {
              customerId: 'CUST-001',
              name: 'Corp A',
              email: 'a@example.com',
              address: { street: '1 St', city: 'Helsinki', postalCode: '00100', country: 'FI' }
            },
            items: [{ lineNumber: 1, productCode: 'PROD-001', description: 'Widget', quantity: 1, unitPrice: 10, currency: 'EUR' }],
            totals: { subtotal: 10, taxRate: 24, taxAmount: 2.40, total: 12.40, currency: 'EUR' }
          },
          {
            header: { orderId: 'ORD-2024-000002', orderDate: '2024-01-16T10:30:00Z', status: 'shipped' },
            customer: {
              customerId: 'CUST-002',
              name: 'Corp B',
              email: 'b@example.com',
              address: { street: '2 St', city: 'Stockholm', postalCode: '10000', country: 'SE' }
            },
            items: [{ lineNumber: 1, productCode: 'PROD-002', description: 'Gadget', quantity: 5, unitPrice: 20, currency: 'USD' }],
            totals: { subtotal: 100, taxRate: 25, taxAmount: 25, total: 125, currency: 'USD' }
          }
        ]
      };

      const result = sut.mapFields(batch);

      expect(result.orders[0].customer.address.country).toBe('Finland');
      expect(result.orders[0].header.status).toBe('Order Confirmed');
      expect(result.orders[1].customer.address.country).toBe('Sweden');
      expect(result.orders[1].header.status).toBe('Shipped');
    });
  });
});