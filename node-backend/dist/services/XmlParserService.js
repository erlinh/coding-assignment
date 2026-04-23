import { XMLParser } from 'fast-xml-parser';
const NS = 'http://example.com/schemas/order/v1';
export class XmlParserService {
    parser;
    constructor() {
        this.parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
            removeNSPrefix: true,
        });
    }
    parse(xml) {
        const doc = this.parser.parse(xml);
        if (!doc) {
            throw new Error('XML document has no root element');
        }
        const tenantId = doc.tenantId ?? '';
        const orders = (doc.order ?? []).map((order) => this.parseOrder(order));
        return {
            tenantId,
            orders,
        };
    }
    parseOrder(orderElement) {
        return {
            header: this.parseHeader(orderElement.header),
            customer: this.parseCustomer(orderElement.customer),
            items: (orderElement.items.item ?? []).map((item) => this.parseItem(item)),
            totals: this.parseTotals(orderElement.totals),
        };
    }
    parseHeader(element) {
        return {
            orderId: element.orderId ?? '',
            orderDate: element.orderDate ?? '',
            status: element.status ?? '',
        };
    }
    parseCustomer(element) {
        return {
            customerId: element.customerId ?? '',
            name: element.name ?? '',
            email: element.email ?? '',
            address: this.parseAddress(element.address),
        };
    }
    parseAddress(element) {
        return {
            street: element.street ?? '',
            city: element.city ?? '',
            postalCode: element.postalCode ?? '',
            country: element.country ?? '',
        };
    }
    parseItem(element) {
        return {
            lineNumber: parseInt(element.lineNumber, 10) || 0,
            productCode: element.productCode ?? '',
            description: element.description ?? '',
            quantity: parseInt(element.quantity, 10) || 0,
            unitPrice: parseFloat(element.unitPrice) || 0,
            currency: element.currency ?? '',
        };
    }
    parseTotals(element) {
        return {
            subtotal: parseFloat(element.subtotal) || 0,
            taxRate: parseFloat(element.taxRate) || 0,
            taxAmount: parseFloat(element.taxAmount) || 0,
            total: parseFloat(element.total) || 0,
            currency: element.currency ?? '',
        };
    }
}
//# sourceMappingURL=XmlParserService.js.map