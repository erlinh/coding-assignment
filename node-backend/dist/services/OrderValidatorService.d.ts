import type { OrderBatch, ValidationError } from '../types/models.js';
import type { IOrderValidatorService } from '../types/services.js';
export declare class OrderValidatorService implements IOrderValidatorService {
    validate(batch: OrderBatch): ValidationError[];
    private validateRequired;
}
//# sourceMappingURL=OrderValidatorService.d.ts.map