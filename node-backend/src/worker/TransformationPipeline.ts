import type { OrderBatch, ValidationError, TransformationResult, PipelineStage } from '../types/models.js';
import type { IXmlParserService, IOrderValidatorService, IFieldMappingService, IJsonTransformerService } from '../types/services.js';

export interface PipelineLogger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

export interface TransformationPipelineDeps {
  parser: IXmlParserService;
  validator: IOrderValidatorService;
  mapper: IFieldMappingService;
  transformer: IJsonTransformerService;
  logger: PipelineLogger;
}

export async function* createTransformationPipeline(
  deps: TransformationPipelineDeps,
  xmlContent: string,
  sourceBlobName: string
): AsyncGenerator<PipelineStage, TransformationResult, undefined> {
  let batch: OrderBatch | undefined;
  let errors: ValidationError[] = [];

  try {
    deps.logger.info('Processing blob', { blobName: sourceBlobName });

    yield { stage: 'parse' };

    batch = deps.parser.parse(xmlContent);

    deps.logger.info('Parsed orders', { orderCount: batch.orders.length, blobName: sourceBlobName });
    yield { stage: 'parse', batch };

    yield { stage: 'validate', batch: batch! };

    errors = deps.validator.validate(batch!);

    if (errors.length > 0) {
      deps.logger.warn('Validation found errors', { errorCount: errors.length, blobName: sourceBlobName });
    }

    yield { stage: 'validate', batch: batch!, errors };

    yield { stage: 'map', batch: batch!, errors };

    const mappedBatch = deps.mapper.mapFields(batch!);

    yield { stage: 'map', batch: mappedBatch, errors };

    yield { stage: 'transform', errors };

    const json = deps.transformer.transform(mappedBatch, errors);

    deps.logger.info('Successfully processed blob', { blobName: sourceBlobName });

    return {
      success: true,
      json,
      validationErrors: errors,
      sourceBlobName,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    deps.logger.error('Failed to process blob', { blobName: sourceBlobName, error });

    return {
      success: false,
      json: '',
      validationErrors: errors,
      sourceBlobName,
      errorMessage: error,
    };
  }
}
