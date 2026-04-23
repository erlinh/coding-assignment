export interface BlobStorageConfig {
  connectionString: string;
  containerName: string;
  inputPrefix: string;
  outputPrefix: string;
  processedPrefix: string;
  failedPrefix: string;
  pollingIntervalMs: number;
}

export interface ServerConfig {
  port: number;
  host: string;
}

export interface Config {
  blobStorage: BlobStorageConfig;
  server: ServerConfig;
}

const devConnectionString =
  "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://localhost:10000/devstoreaccount1;";

export function loadConfig(): Config {
  return {
    blobStorage: {
      connectionString:
        process.env.BLOB_STORAGE_CONNECTION_STRING || devConnectionString,
      containerName: process.env.BLOB_STORAGE_CONTAINER || "orders",
      inputPrefix: process.env.INPUT_PREFIX || "input/",
      outputPrefix: process.env.OUTPUT_PREFIX || "output/",
      processedPrefix: process.env.PROCESSED_PREFIX || "processed/",
      failedPrefix: process.env.FAILED_PREFIX || "failed/",
      pollingIntervalMs: parseInt(
        process.env.POLLING_INTERVAL_MS || "5000",
        10
      ),
    },
    server: {
      port: parseInt(process.env.PORT || "5000", 10),
      host: process.env.HOST || "0.0.0.0",
    },
  };
}

export const config = loadConfig();
