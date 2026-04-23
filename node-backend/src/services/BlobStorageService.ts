import {
  BlobServiceClient,
  ContainerClient,
  BlockBlobClient,
  BlobItem,
} from "@azure/storage-blob";
import type { BlobStorageConfig } from "../config/index.js";

export interface IBlobStorageService {
  listBlobs(prefix: string): Promise<BlobItem[]>;
  downloadBlob(name: string): Promise<string>;
  uploadBlob(name: string, content: string): Promise<void>;
  moveBlob(source: string, dest: string): Promise<void>;
}

export class BlobStorageService implements IBlobStorageService {
  private readonly containerClient: ContainerClient;
  private readonly logger: (message: string) => void;

  constructor(config: BlobStorageConfig, logger: (message: string) => void = console.log) {
    this.logger = logger;
    const connectionString = config.connectionString;
    const containerName = config.containerName;

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = blobServiceClient.getContainerClient(containerName);
  }

  async listBlobs(prefix: string): Promise<BlobItem[]> {
    const blobs: BlobItem[] = [];
    for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
      blobs.push(blob);
    }
    return blobs;
  }

  private async streamToString(stream: NodeJS.ReadableStream): Promise<string> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString("utf-8");
  }

  async downloadBlob(name: string): Promise<string> {
    const blobClient = this.containerClient.getBlobClient(name);
    const downloadResult = await blobClient.download();
    if (downloadResult.readableStreamBody) {
      return await this.streamToString(downloadResult.readableStreamBody);
    }
    throw new Error(`Failed to download blob: ${name}`);
  }

  async uploadBlob(name: string, content: string): Promise<void> {
    const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(name);
    const buffer = Buffer.from(content, "utf-8");
    await blockBlobClient.upload(buffer, buffer.length);
    this.logger(`Written blob: ${name}`);
  }

  async moveBlob(source: string, dest: string): Promise<void> {
    const sourceClient = this.containerClient.getBlobClient(source);
    const destClient = this.containerClient.getBlockBlobClient(dest);

    const poller = await destClient.beginCopyFromURL(sourceClient.url);
    await poller.pollUntilDone();
    await sourceClient.delete();
    this.logger(`Moved blob: ${source} -> ${dest}`);
  }
}
