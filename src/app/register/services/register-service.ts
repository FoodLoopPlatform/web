import {
  uploadCharityDocument,
  uploadStoreDocument,
} from "../documents/api/documents-api";
import type { AccountType } from "../lib/register-flow-context";

/**
 * Uploads each provided document to POST /stores/me/documents or
 * POST /charities/me/documents (one request per file, keyed by the backend
 * `Type` value from `typeMap`).
 */
export async function submitDocumentUpload(
  documents: Record<string, File>,
  typeMap: Record<string, string>,
  email: string,
  accountType: AccountType,
) {
  const uploadDocument =
    accountType === "Charity" ? uploadCharityDocument : uploadStoreDocument;

  const results = await Promise.all(
    Object.entries(documents).map(([key, file]) =>
      uploadDocument(typeMap[key], file, email),
    ),
  );

  const failed = results.find(
    (res) =>
      res.status?.toString().startsWith("4") ||
      res.status?.toString().startsWith("5"),
  );

  if (failed) {
    return { success: false as const, error: failed.error! };
  }

  return { success: true as const };
}
