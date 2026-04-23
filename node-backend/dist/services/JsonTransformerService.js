export class JsonTransformerService {
    transform(batch, validationErrors) {
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
//# sourceMappingURL=JsonTransformerService.js.map