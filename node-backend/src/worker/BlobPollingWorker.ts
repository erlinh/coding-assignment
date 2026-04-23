import type { BlobStorageService } from "../services/BlobStorageService.js";
import type { TransformationResult } from "../types/models.js";

export interface BlobPollingWorkerOptions {
  blobService: BlobStorageService;
  processBlob: (xmlContent: string, blobName: string) => Promise<TransformationResult>;
  inputPrefix: string;
  outputPrefix: string;
  processedPrefix: string;
  failedPrefix: string;
  pollingIntervalMs: number;
}

interface InProgressItem {
  blobName: string;
  startTime: number;
}

export class BlobPollingWorker {
  private readonly options: BlobPollingWorkerOptions;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private inProgress: Map<string, InProgressItem> = new Map();

  constructor(options: BlobPollingWorkerOptions) {
    this.options = options;
  }

  start(): void {
    if (this.intervalId) {
      return;
    }

    console.log(
      `Starting BlobPollingWorker with interval ${this.options.pollingIntervalMs}ms`
    );

    this.poll().catch((err) =>
      console.error("Initial poll failed:", err)
    );

    this.intervalId = setInterval(() => {
      this.poll().catch((err) =>
        console.error("Poll failed:", err)
      );
    }, this.options.pollingIntervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("BlobPollingWorker stopped");
    }
  }

  private async poll(): Promise<void> {
    const { blobService, inputPrefix } = this.options;

    try {
      const blobs = await blobService.listBlobs(inputPrefix);

      for (const blob of blobs) {
        if (this.isInProgress(blob.name)) {
          continue;
        }

        await this.processBlobItem(blob.name);
      }

      this.cleanupStaleInProgress();
    } catch (err) {
      console.error("Error polling blob storage:", err);
    }
  }

  private async processBlobItem(blobName: string): Promise<void> {
    this.markInProgress(blobName);

    const { blobService, processBlob, inputPrefix, outputPrefix, processedPrefix, failedPrefix } =
      this.options;

    try {
      console.log(`Processing blob: ${blobName}`);

      const xmlContent = await blobService.downloadBlob(blobName);
      const result = await processBlob(xmlContent, blobName);

      if (result.success) {
        const outputBlobName = `${outputPrefix}${blobName.replace(inputPrefix, "")}.json`;
        await blobService.uploadBlob(outputBlobName, result.json);

        const processedBlobName = `${processedPrefix}${blobName.replace(inputPrefix, "")}`;
        await blobService.moveBlob(blobName, processedBlobName);

        console.log(`Successfully processed: ${blobName} -> ${outputBlobName}`);
      } else {
        const failedBlobName = `${failedPrefix}${blobName.replace(inputPrefix, "")}`;
        await blobService.moveBlob(blobName, failedBlobName);
        console.error(`Failed to process: ${blobName} - ${result.errorMessage}`);
      }
    } catch (err) {
      console.error(`Error processing blob ${blobName}:`, err);

      const failedBlobName = `${failedPrefix}${blobName.replace(inputPrefix, "")}`;
      try {
        await blobService.moveBlob(blobName, failedBlobName);
      } catch (moveErr) {
        console.error(`Failed to move ${blobName} to failed/:`, moveErr);
      }
    } finally {
      this.unmarkInProgress(blobName);
    }
  }

  private isInProgress(blobName: string): boolean {
    return this.inProgress.has(blobName);
  }

  private markInProgress(blobName: string): void {
    this.inProgress.set(blobName, { blobName, startTime: Date.now() });
  }

  private unmarkInProgress(blobName: string): void {
    this.inProgress.delete(blobName);
  }

  private cleanupStaleInProgress(): void {
    const staleThreshold = 5 * 60 * 1000;
    const now = Date.now();

    for (const [blobName, item] of this.inProgress) {
      if (now - item.startTime > staleThreshold) {
        console.warn(`Removing stale in-progress marker for: ${blobName}`);
        this.inProgress.delete(blobName);
      }
    }
  }
}
