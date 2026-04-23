import { describe, it, expect } from 'vitest';
import { XmlParserService } from '../src/services/XmlParserService';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadTestXml(filename: string): string {
  return readFileSync(join(__dirname, 'TestData', filename), 'utf-8');
}

describe('XmlParserService', () => {
  const sut = new XmlParserService();

  describe('parse', () => {
    it('valid xml returns batch with correct tenant id', () => {
      const xml = loadTestXml('valid-order.xml');

      const result = sut.parse(xml);

      expect(result.tenantId).toBe('test-tenant');
    });

    it('valid xml parses order header', () => {
      const xml = loadTestXml('valid-order.xml');

      const result = sut.parse(xml);
      const order = result.orders[0];

      expect(order.header.orderId).toBe('ORD-2024-001234');
      expect(order.header.orderDate).toBe('2024-01-15T10:30:00Z');
      expect(order.header.status).toBe('confirmed');
    });

    it('valid xml parses customer details', () => {
      const xml = loadTestXml('valid-order.xml');

      const result = sut.parse(xml);
      const customer = result.orders[0].customer;

      expect(customer.customerId).toBe('CUST-5678');
      expect(customer.name).toBe('Acme Corporation');
      expect(customer.email).toBe('orders@acme.example.com');
      expect(customer.address.country).toBe('FI');
      expect(customer.address.city).toBe('Helsinki');
    });

    it('valid xml parses items correctly', () => {
      const xml = loadTestXml('valid-order.xml');

      const result = sut.parse(xml);
      const items = result.orders[0].items;

      expect(items.length).toBe(2);
      expect(items[0].productCode).toBe('PROD-001');
      expect(items[0].quantity).toBe(10);
      expect(items[0].unitPrice).toBe(29.99);
      expect(items[0].currency).toBe('EUR');
    });

    it('valid xml parses totals', () => {
      const xml = loadTestXml('valid-order.xml');

      const result = sut.parse(xml);
      const totals = result.orders[0].totals;

      expect(totals.subtotal).toBe(549.85);
      expect(totals.taxRate).toBe(24);
      expect(totals.taxAmount).toBe(131.96);
      expect(totals.total).toBe(681.81);
    });

    it('invalid xml throws exception', () => {
      const invalidXml = 'this is not xml';

      expect(() => sut.parse(invalidXml)).toThrow();
    });
  });
});