import type { IXmlParserService, IOrderValidatorService, IFieldMappingService, IJsonTransformerService } from '../types/services.js';
export interface ServiceFactory {
    createXmlParserService(): IXmlParserService;
    createOrderValidatorService(): IOrderValidatorService;
    createFieldMappingService(): IFieldMappingService;
    createJsonTransformerService(): IJsonTransformerService;
}
export declare function createServiceFactory(): ServiceFactory;
//# sourceMappingURL=factories.d.ts.map