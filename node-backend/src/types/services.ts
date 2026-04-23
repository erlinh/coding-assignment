import type { OrderBatch, ValidationError } from './models.js';

export interface IXmlParserService {
  parse(xml: string): OrderBatch;
}

export interface IOrderValidatorService {
  validate(batch: OrderBatch): ValidationError[];
}

export interface IFieldMappingService {
  mapFields(batch: OrderBatch): OrderBatch;
}

export interface IJsonTransformerService {
  transform(batch: OrderBatch, validationErrors: ValidationError[]): string;
}
