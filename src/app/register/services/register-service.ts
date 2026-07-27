import { uploadStoreDocument } from "../documents/api/documents-api";

/**
 * Uploads each provided document to POST /stores/me/documents (one request
 * per file, keyed by the backend `Type` value from `typeMap`).
 */
export async function submitDocumentUpload(
  documents: Record<string, File>,
  typeMap: Record<string, string>,
) {
  const results = await Promise.all(
    Object.entries(documents).map(([key, file]) =>
      uploadStoreDocument(typeMap[key], file),
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
