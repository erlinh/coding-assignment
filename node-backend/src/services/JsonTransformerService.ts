import { OrderBatch, ValidationError } from "../types/OrderModels.js";

export interface IJsonTransformerService {
  transform(batch: OrderBatch, validationErrors: ValidationError[]): string;
}

export class JsonTransformerService implements IJsonTransformerService {
  private readonly logger: (message: string) => void;

  constructor(logger: (message: string) => void = console.log) {
    this.logger = logger;
  }

  transform(batch: OrderBatch, validationErrors: ValidationError[]): string {
    const output = {
      tenantId: batch.tenantId,
      processedAt: new Date().toISOString(),
      orderCount: batch.orders.length,
      validationErrorCount: validationErrors.length,
      validationErrors: validationErrors.length > 0 ? validationErrors : null,
      orders: batch.orders,
    };

    const json = JSON.stringify(output, null, 2);
    this.logger(`Transformed batch to JSON (${json.length} bytes)`);
    return json;
  }
}