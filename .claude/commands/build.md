# Build Agent

You are helping build, run, and verify the OrderTransformer Node.js/Fastify project.

## Build Commands

```bash
# Build the TypeScript
cd node-backend && npm run build

# Run tests
cd node-backend && npm test
```

## Run Commands

```bash
# Start infrastructure (Azurite blob storage)
docker compose up -d

# Wait for initialization to complete
docker compose logs azurite-init --follow

# Run both backend and frontend from root
npm run dev

# Or run backend only
cd node-backend && npm run dev

# Run frontend only
cd ui && pnpm dev
```

## Verify End-to-End

```bash
# 1. Start Azurite with seed data
docker compose up -d

# 2. Run the app (will process the seed XML file)
npm run dev

# 3. Check API is responding
curl http://localhost:5000/api/orders

# 4. Check stats
curl http://localhost:5000/api/orders/stats
```

## Clean Up

```bash
# Stop all containers
docker compose down

# Stop and remove volumes
docker compose down -v
```

## Common Build Issues

- **TypeScript errors**: Run `cd node-backend && npm run build` to see details
- **Azurite connection refused**: Ensure `docker compose up -d` has completed and Azurite is healthy
- **Port conflict**: Stop other processes on ports 5000, 5173, 10000
