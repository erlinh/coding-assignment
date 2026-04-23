import type { OrderBatch, ValidationError } from '../types/models.js';
import type { IJsonTransformerService } from '../types/services.js';

export class JsonTransformerService implements IJsonTransformerService {
  transform(batch: OrderBatch, validationErrors: ValidationError[]): string {
    const output = {
      tenantId: batch.tenantId,
      processedAt: new Date().toISOString(),
      orderCount: batch.orders.length,
      validationErrorCount: validationErrors.length,
      validationErrors: validationErrors.length > 0 ? validationErrors : null,
      orders: batch.orders,
    };

    return JSON.stringify(output, null, 2);
  }
}
