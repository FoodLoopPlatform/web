import type { DocumentUploadInput } from "../lib/schemas";

const SIMULATED_LATENCY_MS = 600;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitDocumentUpload(data: DocumentUploadInput) {
  await delay(SIMULATED_LATENCY_MS);
  return { success: true as const, documentCount: Object.keys(data).length };
}
