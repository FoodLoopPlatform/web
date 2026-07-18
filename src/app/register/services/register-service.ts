import type { BusinessSignupInput, DocumentUploadInput } from "../lib/schemas";

const SIMULATED_LATENCY_MS = 600;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitBusinessSignup(
  data: Omit<BusinessSignupInput, "password" | "confirmPassword">,
) {
  await delay(SIMULATED_LATENCY_MS);
  return { success: true as const, businessId: `biz_${Date.now()}`, ...data };
}

export async function submitDocumentUpload(data: DocumentUploadInput) {
  await delay(SIMULATED_LATENCY_MS);
  return { success: true as const, documentCount: Object.keys(data).length };
}
