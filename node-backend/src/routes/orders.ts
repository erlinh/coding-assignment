import type { FastifyInstance } from "fastify";
import type { BlobStorageService } from "../services/BlobStorageService.js";
import type { OrderBatchSummary } from "../types/index.js";

interface OrderRoutesOptions {
  blobService: BlobStorageService;
  inputPrefix: string;
  outputPrefix: string;
}

export async function registerOrderRoutes(
  fastify: FastifyInstance,
  options: OrderRoutesOptions
): Promise<void> {
  const { blobService, inputPrefix, outputPrefix } = options;

  fastify.get("/api/orders/stats", async () => {
    const allBlobs = await blobService.listBlobs("");
    const outputBlobs = allBlobs.filter((b) => b.name.startsWith(outputPrefix));
    const inputBlobs = allBlobs.filter((b) => b.name.startsWith(inputPrefix));
    const failedBlobs = allBlobs.filter((b) =>
      b.name.startsWith("failed/")
    );

    let totalOrders = 0;
    const summaries: OrderBatchSummary[] = [];

    for (const blob of outputBlobs) {
      if (!blob.name.endsWith(".json")) continue;
      const content = await blobService.downloadBlob(blob.name);
      const data = JSON.parse(content);
      totalOrders += data.orderCount || 0;
      summaries.push({
        blobName: blob.name.replace(outputPrefix, ""),
        tenantId: data.tenantId || "",
        orderCount: data.orderCount || 0,
        processedAt: data.processedAt || "",
        validationErrorCount: data.validationErrorCount || 0,
      });
    }

    return {
      totalBatches: outputBlobs.filter((b) =>
        b.name.endsWith(".json")
      ).length,
      totalOrders,
      errorCount: summaries.reduce(
        (sum, s) => sum + s.validationErrorCount,
        0
      ),
      pendingFiles: inputBlobs.length,
      failedFiles: failedBlobs.length,
    };
  });

  fastify.post("/api/orders/upload", async (request) => {
    const data = await request.file();
    if (!data) {
      throw new Error("No file uploaded");
    }

    const buffer = await data.toBuffer();
    const fileName = data.filename || `order-${Date.now()}.xml`;
    const blobName = `${inputPrefix}${fileName}`;

    await blobService.uploadBlob(blobName, buffer.toString("utf-8"));

    return {
      success: true,
      fileName,
      message: `File uploaded to ${blobName}`,
    };
  });

  fastify.get("/api/orders/", async () => {
    const allBlobs = await blobService.listBlobs("");
    const outputBlobs = allBlobs.filter(
      (b) => b.name.startsWith(outputPrefix) && b.name.endsWith(".json")
    );

    const summaries: OrderBatchSummary[] = [];

    for (const blob of outputBlobs) {
      const content = await blobService.downloadBlob(blob.name);
      const data = JSON.parse(content);
      summaries.push({
        blobName: blob.name.replace(outputPrefix, ""),
        tenantId: data.tenantId || "",
        orderCount: data.orderCount || 0,
        processedAt: data.processedAt || "",
        validationErrorCount: data.validationErrorCount || 0,
      });
    }

    return summaries;
  });

  fastify.get("/api/orders/{blobName}", async (request, reply) => {
    const { blobName } = request.params as { blobName: string };
    const fullBlobName = `${outputPrefix}${blobName}`;

    if (!fullBlobName.endsWith(".json")) {
      return reply.status(404).send({ error: "Not found" });
    }

    const content = await blobService.downloadBlob(fullBlobName);
    return JSON.parse(content);
  });
}
