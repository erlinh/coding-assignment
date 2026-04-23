import { XMLParser } from 'fast-xml-parser';
import type { OrderBatch, Order, OrderHeader, Customer, Address, OrderItem, OrderTotals } from '../types/models.js';
import type { IXmlParserService } from '../types/services.js';

const NS = 'http://example.com/schemas/order/v1';

interface XmlOrder {
  header: XmlHeader;
  customer: XmlCustomer;
  items: { item: XmlItem[] };
  totals: XmlTotals;
}

interface XmlHeader {
  orderId: string;
  orderDate: string;
  status: string;
}

interface XmlCustomer {
  customerId: string;
  name: string;
  email: string;
  address: XmlAddress;
}

interface XmlAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface XmlItem {
  lineNumber: string;
  productCode: string;
  description: string;
  quantity: string;
  unitPrice: string;
  currency: string;
}

interface XmlTotals {
  subtotal: string;
  taxRate: string;
  taxAmount: string;
  total: string;
  currency: string;
}

interface XmlRoot {
  tenantId: string;
  order: XmlOrder[];
}

export class XmlParserService implements IXmlParserService {
  private parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      removeNSPrefix: true,
      parseTagValue: true,
      trimValues: true,
    });
  }

  parse(xml: string): OrderBatch {
    if (!xml || xml.trim() === '') {
      throw new Error('XML document is empty');
    }

    if (!xml.includes('<orders')) {
      throw new Error('Invalid XML: missing orders element');
    }

    let parsed;
    try {
      parsed = this.parser.parse(xml);
    } catch (e) {
      throw new Error('Invalid XML: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }

    if (!parsed || typeof parsed !== 'object' || Object.keys(parsed).length === 0) {
      throw new Error('XML document has no root element');
    }

    const root = parsed.orders || parsed;
    const tenantId = root.tenantId ?? '';
    const orderData = root.order;
    const ordersArray = Array.isArray(orderData) ? orderData : orderData ? [orderData] : [];
    const orders = ordersArray.map((order: XmlOrder) => this.parseOrder(order));

    return {
      tenantId,
      orders,
    };
  }

  private parseOrder(orderElement: XmlOrder): Order {
    const itemsData = orderElement.items?.item;
    const itemsArray = Array.isArray(itemsData) ? itemsData : itemsData ? [itemsData] : [];
    return {
      header: this.parseHeader(orderElement.header),
      customer: this.parseCustomer(orderElement.customer),
      items: itemsArray.map((item) => this.parseItem(item)),
      totals: this.parseTotals(orderElement.totals),
    };
  }

  private parseHeader(element: XmlHeader): OrderHeader {
    return {
      orderId: element.orderId ?? '',
      orderDate: element.orderDate ?? '',
      status: element.status ?? '',
    };
  }

  private parseCustomer(element: XmlCustomer): Customer {
    return {
      customerId: element.customerId ?? '',
      name: element.name ?? '',
      email: element.email ?? '',
      address: this.parseAddress(element.address),
    };
  }

  private parseAddress(element: XmlAddress): Address {
    return {
      street: element.street ?? '',
      city: element.city ?? '',
      postalCode: element.postalCode ?? '',
      country: element.country ?? '',
    };
  }

  private parseItem(element: XmlItem): OrderItem {
    return {
      lineNumber: parseInt(element.lineNumber, 10) || 0,
      productCode: element.productCode ?? '',
      description: element.description ?? '',
      quantity: parseInt(element.quantity, 10) || 0,
      unitPrice: parseFloat(element.unitPrice) || 0,
      currency: element.currency ?? '',
    };
  }

  private parseTotals(element: XmlTotals): OrderTotals {
    return {
      subtotal: parseFloat(element.subtotal) || 0,
      taxRate: parseFloat(element.taxRate) || 0,
      taxAmount: parseFloat(element.taxAmount) || 0,
      total: parseFloat(element.total) || 0,
      currency: element.currency ?? '',
    };
  }
}
