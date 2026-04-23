import type { TransformationResult, PipelineStage } from '../types/models.js';
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
export declare function createTransformationPipeline(deps: TransformationPipelineDeps, xmlContent: string, sourceBlobName: string): AsyncGenerator<PipelineStage, TransformationResult, undefined>;
//# sourceMappingURL=TransformationPipeline.d.ts.map