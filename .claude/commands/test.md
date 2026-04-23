# Testing Agent

You are helping write unit tests for the OrderTransformer Node.js/Fastify project.

## Testing Framework
- **Vitest** with `describe`, `it`, `expect`
- **Arrange-Act-Assert** pattern
- Tests are in `node-backend/tests/`

## What Needs Testing

### 1. OrderValidatorService Tests
Write tests for each validation rule:
- Valid order batch returns no errors
- Missing required fields (orderId, customerId, name, email) each produce an error
- Invalid OrderId format (e.g., "INVALID-ID", "ORD-24-001234") produces FORMAT error
- Invalid email (e.g., "not-an-email", "@missing.com") produces FORMAT error
- Invalid country code (e.g., "finland", "f", "FIN") produces FORMAT error
- Invalid currency code (e.g., "euro", "EU", "euros") produces FORMAT error
- Zero or negative quantity produces RANGE error
- Negative price produces RANGE error

### 2. FieldMappingService Tests
Write tests for each mapping:
- Country code "FI" maps to "Finland"
- Country code "SE" maps to "Sweden"
- Unknown country code remains unchanged
- Product code "PROD-001" maps to "Widgets"
- Status "confirmed" maps to "Order Confirmed"
- Unknown status remains unchanged
- Multiple orders in a batch are all mapped

## Test Data Helper
Create test OrderBatch objects using plain JavaScript objects. Example pattern:

```typescript
const createValidBatch = (): OrderBatch => ({
  tenantId: "test-tenant",
  orders: [{
    header: { orderId: "ORD-2024-001234", orderDate: "2024-01-15T10:30:00Z", status: "confirmed" },
    customer: { customerId: "CUST-001", name: "Test Corp", email: "test@example.com",
      address: { street: "123 Test St", city: "Helsinki", postalCode: "00100", country: "FI" } },
    items: [{ lineNumber: 1, productCode: "PROD-001", description: "Widget", quantity: 10, unitPrice: 29.99, currency: "EUR" }],
    totals: { subtotal: 299.90, taxRate: 24, taxAmount: 71.98, total: 371.88, currency: "EUR" }
  }]
});
```

## Reference
Look at existing tests for patterns:
- `node-backend/tests/services/XmlParserService.test.ts`
- `node-backend/tests/services/JsonTransformerService.test.ts`

## Commands
```bash
cd node-backend && npm test
```
