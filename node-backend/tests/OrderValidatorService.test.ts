import { describe, it, expect } from 'vitest';
import { OrderValidatorService } from '../src/services/OrderValidatorService';
import type { OrderBatch } from '../src/types/models';

function createValidBatch(): OrderBatch {
  return {
    tenantId: 'test-tenant',
    orders: [
      {
        header: {
          orderId: 'ORD-2024-001234',
          orderDate: '2024-01-15T10:30:00Z',
          status: 'confirmed'
        },
        customer: {
          customerId: 'CUST-5678',
          name: 'Test Corp',
          email: 'test@example.com',
          address: {
            street: '123 Test St',
            city: 'Helsinki',
            postalCode: '00100',
            country: 'FI'
          }
        },
        items: [
          {
            lineNumber: 1,
            productCode: 'PROD-001',
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

describe('OrderValidatorService', () => {
  const sut = new OrderValidatorService();

  describe('validate', () => {
    it('valid order batch returns no errors', () => {
      const batch = createValidBatch();

      const errors = sut.validate(batch);

      expect(errors.length).toBe(0);
    });

    it('missing order id returns required error', () => {
      const batch = createValidBatch();
      batch.orders[0].header.orderId = '';

      const errors = sut.validate(batch);

      expect(errors.some(e => e.field === 'Header.OrderId' && e.errorCode === 'REQUIRED')).toBe(true);
    });

    it('missing order date returns required error', () => {
      const batch = createValidBatch();
      batch.orders[0].header.orderDate = '';

      const errors = sut.validate(batch);

      expect(errors.some(e => e.field === 'Header.OrderDate' && e.errorCode === 'REQUIRED')).toBe(true);
    });

    it('missing customer id returns required error', () => {
      const batch = createValidBatch();
      batch.orders[0].customer.customerId = '';

      const errors = sut.validate(batch);

      expect(errors.some(e => e.field === 'Customer.CustomerId' && e.errorCode === 'REQUIRED')).toBe(true);
    });

    it('missing customer name returns required error', () => {
      const batch = createValidBatch();
      batch.orders[0].customer.name = '';

      const errors = sut.validate(batch);

      expect(errors.some(e => e.field === 'Customer.Name' && e.errorCode === 'REQUIRED')).toBe(true);
    });

    it('missing customer email returns required error', () => {
      const batch = createValidBatch();
      batch.orders[0].customer.email = '';

      const errors = sut.validate(batch);

      expect(errors.some(e => e.field === 'Customer.Email' && e.errorCode === 'REQUIRED')).toBe(true);
    });

    it('missing order id uses unknown as order id', () => {
      const batch = createValidBatch();
      batch.orders[0].header.orderId = '';

      const errors = sut.validate(batch);

      expect(errors.some(e => e.orderId === 'unknown' && e.field === 'Header.OrderId')).toBe(true);
    });

    it('invalid order id format returns format error', () => {
      const batch = createValidBatch();
      const invalidIds = ['INVALID-ID', 'ORD-24-001234', 'ORD-2024-12345', 'ord-2024-001234', 'ORD-2024-0012345'];

      for (const orderId of invalidIds) {
        batch.orders[0].header.orderId = orderId;
        const errors = sut.validate(batch);
        expect(errors.some(e => e.field === 'Header.OrderId' && e.errorCode === 'FORMAT')).toBe(true);
      }
    });

    it('invalid email returns format error', () => {
      const batch = createValidBatch();
      const invalidEmails = ['not-an-email', '@missing.com', 'missing@', 'missing@domain'];

      for (const email of invalidEmails) {
        batch.orders[0].customer.email = email;
        const errors = sut.validate(batch);
        expect(errors.some(e => e.field === 'Customer.Email' && e.errorCode === 'FORMAT')).toBe(true);
      }
    });

    it('invalid country code returns format error', () => {
      const batch = createValidBatch();
      const invalidCountries = ['finland', 'FIN', 'f', 'fi'];

      for (const country of invalidCountries) {
        batch.orders[0].customer.address.country = country;
        const errors = sut.validate(batch);
        expect(errors.some(e => e.field === 'Customer.Address.Country' && e.errorCode === 'FORMAT')).toBe(true);
      }
    });

    it('invalid currency code returns format error', () => {
      const batch = createValidBatch();
      const invalidCurrencies = ['euro', 'EU', 'euros', 'eur'];

      for (const currency of invalidCurrencies) {
        batch.orders[0].items[0].currency = currency;
        const errors = sut.validate(batch);
        expect(errors.some(e => e.field === 'Items[0].Currency' && e.errorCode === 'FORMAT')).toBe(true);
      }
    });

    it('zero or negative quantity returns range error', () => {
      const batch = createValidBatch();
      const invalidQuantities = [0, -1, -100];

      for (const quantity of invalidQuantities) {
        batch.orders[0].items[0].quantity = quantity;
        const errors = sut.validate(batch);
        expect(errors.some(e => e.field === 'Items[0].Quantity' && e.errorCode === 'RANGE')).toBe(true);
      }
    });

    it('negative unit price returns range error', () => {
      const batch = createValidBatch();
      batch.orders[0].items[0].unitPrice = -1.00;

      const errors = sut.validate(batch);

      expect(errors.some(e => e.field === 'Items[0].UnitPrice' && e.errorCode === 'RANGE')).toBe(true);
    });

    it('zero unit price returns no range error', () => {
      const batch = createValidBatch();
      batch.orders[0].items[0].unitPrice = 0;

      const errors = sut.validate(batch);

      expect(errors.some(e => e.field === 'Items[0].UnitPrice' && e.errorCode === 'RANGE')).toBe(false);
    });

    it('negative subtotal returns range error', () => {
      const batch = createValidBatch();
      batch.orders[0].totals.subtotal = -1;

      const errors = sut.validate(batch);

      expect(errors.some(e => e.field === 'Totals.Subtotal' && e.errorCode === 'RANGE')).toBe(true);
    });

    it('negative tax amount returns range error', () => {
      const batch = createValidBatch();
      batch.orders[0].totals.taxAmount = -1;

      const errors = sut.validate(batch);

      expect(errors.some(e => e.field === 'Totals.TaxAmount' && e.errorCode === 'RANGE')).toBe(true);
    });

    it('negative total returns range error', () => {
      const batch = createValidBatch();
      batch.orders[0].totals.total = -1;

      const errors = sut.validate(batch);

      expect(errors.some(e => e.field === 'Totals.Total' && e.errorCode === 'RANGE')).toBe(true);
    });
  });
});