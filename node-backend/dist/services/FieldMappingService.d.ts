import type { OrderBatch } from '../types/models.js';
import type { IFieldMappingService } from '../types/services.js';
export declare class FieldMappingService implements IFieldMappingService {
    mapFields(batch: OrderBatch): OrderBatch;
    private mapOrder;
    private mapItem;
}
//# sourceMappingURL=FieldMappingService.d.ts.map