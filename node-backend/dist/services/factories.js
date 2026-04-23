import { XmlParserService } from './XmlParserService.js';
import { OrderValidatorService } from './OrderValidatorService.js';
import { FieldMappingService } from './FieldMappingService.js';
import { JsonTransformerService } from './JsonTransformerService.js';
export function createServiceFactory() {
    return {
        createXmlParserService() {
            return new XmlParserService();
        },
        createOrderValidatorService() {
            return new OrderValidatorService();
        },
        createFieldMappingService() {
            return new FieldMappingService();
        },
        createJsonTransformerService() {
            return new JsonTransformerService();
        },
    };
}
//# sourceMappingURL=factories.js.map