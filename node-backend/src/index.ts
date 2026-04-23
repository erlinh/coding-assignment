import Fastify from "fastify";
import multipart from "@fastify/multipart";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { loadConfig } from "./config/index.js";
import { createServiceFactory } from "./services/factories.js";
import { registerOrderRoutes } from "./routes/orders.js";
import { registerStatusRoutes } from "./routes/status.js";
import { BlobPollingWorker } from "./worker/BlobPollingWorker.js";
import type { TransformationResult } from "./types/models.js";

const config = loadConfig();

const fastify = Fastify({
  logger: true,
});

await fastify.register(swagger, {
  openapi: {
    info: {
      title: "Order Transformer API",
      description: "Azure Blob Storage XML to JSON transformer API",
      version: "1.0.0",
    },
    servers: [
      { url: "http://localhost:5000", description: "Local development" },
    ],
    tags: [
      { name: "orders", description: "Order management endpoints" },
      { name: "status", description: "File processing status endpoints" },
    ],
  },
});

await fastify.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: true,
  },
});

await fastify.register(multipart);

const serviceFactory = createServiceFactory(config.blobStorage);
const blobService = serviceFactory.createBlobStorageService();
const xmlParserService = serviceFactory.createXmlParserService();
const validatorService = serviceFactory.createOrderValidatorService();
const fieldMapperService = serviceFactory.createFieldMappingService();
const jsonTransformerService = serviceFactory.createJsonTransformerService();

const processBlob = async (xmlContent: string, _blobName: string): Promise<TransformationResult> => {
  try {
    const batch = xmlParserService.parse(xmlContent);
    const validationErrors = validatorService.validate(batch);
    const mappedBatch = fieldMapperService.mapFields(batch);
    const json = jsonTransformerService.transform(mappedBatch, validationErrors);

    return {
      success: true,
      json,
      validationErrors,
      sourceBlobName: _blobName,
    };
  } catch (err) {
    return {
      success: false,
      json: "",
      validationErrors: [],
      sourceBlobName: _blobName,
      errorMessage: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

const worker = new BlobPollingWorker({
  blobService,
  processBlob,
  inputPrefix: config.blobStorage.inputPrefix,
  outputPrefix: config.blobStorage.outputPrefix,
  processedPrefix: config.blobStorage.processedPrefix,
  failedPrefix: config.blobStorage.failedPrefix,
  pollingIntervalMs: config.blobStorage.pollingIntervalMs,
});

await fastify.register(async (instance) => {
  await registerOrderRoutes(instance, {
    blobService,
    inputPrefix: config.blobStorage.inputPrefix,
    outputPrefix: config.blobStorage.outputPrefix,
  });

  await registerStatusRoutes(instance, {
    blobService,
    inputPrefix: config.blobStorage.inputPrefix,
    outputPrefix: config.blobStorage.outputPrefix,
    failedPrefix: config.blobStorage.failedPrefix,
  });
});

fastify.get("/health", async () => {
  return { status: "ok" };
});

fastify.listen({ port: config.server.port, host: config.server.host }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
  worker.start();
});

process.on("SIGINT", () => {
  worker.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  worker.stop();
  process.exit(0);
});
