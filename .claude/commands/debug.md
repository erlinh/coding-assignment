# Debug Agent

You are helping diagnose and fix issues in the OrderTransformer Node.js/Fastify project.

## Common Issues and Solutions

### Build Errors
```bash
cd node-backend && npm run build 2>&1
```

### Test Failures
```bash
cd node-backend && npm test 2>&1
```

### Runtime / Blob Storage Issues
```bash
# Check if Azurite is running
docker compose ps

# View Azurite logs
docker compose logs azurite

# Check init script completed
docker compose logs azurite-init

# List blobs in container (using az CLI)
docker compose exec azurite-init az storage blob list \
  --container-name orders \
  --connection-string "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://localhost:10000/devstoreaccount1;" \
  --output table
```

### XML Parsing Issues
- **Namespace mismatch**: XML uses namespace `http://example.com/schemas/order/v1`. The parser uses `fast-xml-parser` with namespace configuration
- **Missing elements**: Check if the XML structure matches the expected schema (`init-scripts/azurite/seed-data/order-batch-001.xml`)
- **Encoding**: XML files must be UTF-8 encoded

### Pipeline Issues
- Check `TransformationPipeline.ts` for the processing flow
- Validation errors should NOT stop the pipeline - they are collected and included in output
- Field mapping happens AFTER validation
- Output JSON goes to `output/` prefix, processed XML moves to `processed/` prefix

## Project Structure Quick Reference
```
node-backend/src/
  index.ts                              # Entry point, Fastify setup
  worker/BlobPollingWorker.ts         # Polls blob storage
  worker/TransformationPipeline.ts      # Orchestrates processing
  services/OrderValidatorService.ts    # STUB - candidate implements
  services/FieldMappingService.ts      # STUB - candidate implements
  types/models.ts                      # Domain models
```
