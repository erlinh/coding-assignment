import type { FastifyInstance } from "fastify";
import type { BlobStorageService } from "../services/BlobStorageService.js";

interface StatusRoutesOptions {
  blobService: BlobStorageService;
  inputPrefix: string;
  outputPrefix: string;
  failedPrefix: string;
}

export async function registerStatusRoutes(
  fastify: FastifyInstance,
  options: StatusRoutesOptions
): Promise<void> {
  const { blobService, inputPrefix, outputPrefix, failedPrefix } = options;

  fastify.get("/api/orders/status/{fileName}", async (request, reply) => {
    const { fileName } = request.params as { fileName: string };

    const inputBlobName = `${inputPrefix}${fileName}`;
    const outputBlobName = `${outputPrefix}${fileName}`;
    const failedBlobName = `${failedPrefix}${fileName}`;

    const allBlobs = await blobService.listBlobs("");

    const inputExists = allBlobs.some((b) => b.name === inputBlobName);
    const outputExists = allBlobs.some((b) => b.name === outputBlobName);
    const failedExists = allBlobs.some((b) => b.name === failedBlobName);

    if (outputExists) {
      return { status: "completed", fileName };
    }
    if (failedExists) {
      return { status: "failed", fileName };
    }
    if (inputExists) {
      return { status: "pending", fileName };
    }

    return reply.status(404).send({ status: "not_found", fileName });
  });
}
