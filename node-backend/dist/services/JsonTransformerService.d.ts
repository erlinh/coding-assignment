import type { OrderBatch, ValidationError } from '../types/models.js';
import type { IJsonTransformerService } from '../types/services.js';
export declare class JsonTransformerService implements IJsonTransformerService {
    transform(batch: OrderBatch, validationErrors: ValidationError[]): string;
}
//# sourceMappingURL=JsonTransformerService.d.ts.map