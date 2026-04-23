import type { OrderBatch } from '../types/models.js';
import type { IXmlParserService } from '../types/services.js';
export declare class XmlParserService implements IXmlParserService {
    private parser;
    constructor();
    parse(xml: string): OrderBatch;
    private parseOrder;
    private parseHeader;
    private parseCustomer;
    private parseAddress;
    private parseItem;
    private parseTotals;
}
//# sourceMappingURL=XmlParserService.d.ts.map