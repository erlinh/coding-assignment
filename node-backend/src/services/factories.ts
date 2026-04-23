import type { IXmlParserService, IOrderValidatorService, IFieldMappingService, IJsonTransformerService } from '../types/services.js';
import { XmlParserService } from './XmlParserService.js';
import { OrderValidatorService } from './OrderValidatorService.js';
import { FieldMappingService } from './FieldMappingService.js';
import { JsonTransformerService } from './JsonTransformerService.js';
import { BlobStorageService } from './BlobStorageService.js';
import type { BlobStorageConfig } from '../config/index.js';

export interface ServiceFactory {
  createXmlParserService(): IXmlParserService;
  createOrderValidatorService(): IOrderValidatorService;
  createFieldMappingService(): IFieldMappingService;
  createJsonTransformerService(): IJsonTransformerService;
  createBlobStorageService(): BlobStorageService;
}

export function createServiceFactory(blobStorageConfig: BlobStorageConfig): ServiceFactory {
  return {
    createXmlParserService(): IXmlParserService {
      return new XmlParserService();
    },
    createOrderValidatorService(): IOrderValidatorService {
      return new OrderValidatorService();
    },
    createFieldMappingService(): IFieldMappingService {
      return new FieldMappingService();
    },
    createJsonTransformerService(): IJsonTransformerService {
      return new JsonTransformerService();
    },
    createBlobStorageService(): BlobStorageService {
      return new BlobStorageService(blobStorageConfig);
    },
  };
}
