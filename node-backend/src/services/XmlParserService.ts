import { XMLParser } from "fast-xml-parser";
import { OrderBatch, Order, OrderHeader, Customer, Address, OrderItem, OrderTotals } from "../types/OrderModels.js";

const NS = "http://example.com/schemas/order/v1";
const NS_PREFIX = "ns";

export interface IXmlParserService {
  parse(xml: string): OrderBatch;
}

export class XmlParserService implements IXmlParserService {
  private readonly logger: (message: string) => void;
  private readonly parser: XMLParser;

  constructor(logger: (message: string) => void = console.log) {
    this.logger = logger;
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: `${NS_PREFIX}@_`,
      removeNSPrefix: true,
      parseAttributeValue: true,
      trimValues: true,
    });
  }

  parse(xml: string): OrderBatch {
    const parsed = this.parser.parse(xml);
    const root = parsed.orders;

    if (!root) {
      throw new Error("XML document has no root element");
    }

    const tenantId = root.tenantId || "";
    const orders = (root.order || []).map((orderElement: Record<string, unknown>) =>
      this.parseOrder(orderElement)
    );

    this.logger(`Parsed ${orders.length} orders for tenant ${tenantId}`);

    return {
      tenantId,
      orders,
    };
  }

  private parseOrder(orderElement: Record<string, unknown>): Order {
    const header = this.parseHeader((orderElement.header || {}) as Record<string, unknown>);
    const customer = this.parseCustomer((orderElement.customer || {}) as Record<string, unknown>);
    const itemsElement = (orderElement.items as Record<string, unknown>)?.item;
    const itemsRaw = Array.isArray(itemsElement) ? itemsElement : itemsElement ? [itemsElement] : [];
    const items = itemsRaw.map((item) => this.parseItem(item as Record<string, unknown>));
    const totals = this.parseTotals((orderElement.totals || {}) as Record<string, unknown>);

    return {
      header,
      customer,
      items,
      totals,
    };
  }

  private parseHeader(element: Record<string, unknown>): OrderHeader {
    return {
      orderId: (element.orderId as string) || "",
      orderDate: (element.orderDate as string) || "",
      status: (element.status as string) || "",
    };
  }

  private parseCustomer(element: Record<string, unknown>): Customer {
    return {
      customerId: (element.customerId as string) || "",
      name: (element.name as string) || "",
      email: (element.email as string) || "",
      address: this.parseAddress((element.address || {}) as Record<string, unknown>),
    };
  }

  private parseAddress(element: Record<string, unknown>): Address {
    return {
      street: (element.street as string) || "",
      city: (element.city as string) || "",
      postalCode: (element.postalCode as string) || "",
      country: (element.country as string) || "",
    };
  }

  private parseItem(element: Record<string, unknown>): OrderItem {
    return {
      lineNumber: parseInt((element.lineNumber as string) || "0", 10),
      productCode: (element.productCode as string) || "",
      description: (element.description as string) || "",
      quantity: parseInt((element.quantity as string) || "0", 10),
      unitPrice: parseFloat((element.unitPrice as string) || "0"),
      currency: (element.currency as string) || "",
    };
  }

  private parseTotals(element: Record<string, unknown>): OrderTotals {
    return {
      subtotal: parseFloat((element.subtotal as string) || "0"),
      taxRate: parseFloat((element.taxRate as string) || "0"),
      taxAmount: parseFloat((element.taxAmount as string) || "0"),
      total: parseFloat((element.total as string) || "0"),
      currency: (element.currency as string) || "",
    };
  }
}