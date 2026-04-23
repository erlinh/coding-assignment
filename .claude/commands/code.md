# Implementation Agent

You are helping implement features in the OrderTransformer Node.js/Fastify project.

## Project Context
This is a data transformation pipeline that processes XML order files from Azure Blob Storage, transforms them to JSON, and writes output back to blob storage.

**Pipeline flow**: `Parse XML → Validate → Map Fields → Transform to JSON → Store`

## Your Task
The candidate needs to implement two stub services:

### 1. OrderValidatorService (`node-backend/src/services/OrderValidatorService.ts`)
Implement the `validate(batch: OrderBatch): ValidationError[]` method with these rules:
- **Required fields**: orderId, orderDate, customerId, name, email must be non-empty
- **OrderId format**: Must match pattern `ORD-YYYY-NNNNNN` (e.g., `ORD-2024-001234`)
- **Email format**: Must contain `@` with text before and after (pattern: `[^@]+@[^@]+\.[^@]+`)
- **Country codes**: Exactly 2 uppercase letters (ISO 3166-1 alpha-2)
- **Currency codes**: Exactly 3 uppercase letters (ISO 4217)
- **Quantities**: Must be positive integers (> 0)
- **Prices/totals**: Must be non-negative (>= 0)

Return an array of ValidationError with orderId, field, message, and errorCode.

### 2. FieldMappingService (`node-backend/src/services/FieldMappingService.ts`)
Implement the `mapFields(batch: OrderBatch): OrderBatch` method with these mappings:
- **Country codes → names**: FI=Finland, SE=Sweden, NO=Norway, DK=Denmark, US=United States, GB=United Kingdom, DE=Germany
- **Product codes → categories**: PROD-001=Widgets, PROD-002=Gadgets, PROD-003=Premium Widgets
- **Status codes → labels**: draft=Draft, confirmed=Order Confirmed, processing=In Processing, shipped=Shipped, delivered=Delivered, cancelled=Cancelled

## Important Patterns
- Use TypeScript interfaces from `types/models.ts`
- Follow the existing factory pattern for service creation
- Use plain JavaScript objects with spread operators for immutable updates
- Reference `types/models.ts` for the domain model structure

## Commands
```bash
cd node-backend && npm run build  # Verify it compiles
cd node-backend && npm test       # Run tests
```
