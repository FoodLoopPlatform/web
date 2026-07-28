import { createOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { withAuth } from "@/utils/api-client";

/** Uploads a single store/charity verification document (POST /stores/me/documents). */
export function uploadStoreDocument(type: string, file: File, email: string) {
  const formData = new FormData();
  formData.append("Email", email);
  formData.append("Type", type);
  formData.append("File", file);

  return withAuth((token) =>
    createOne<null, FormData>(Endpoints.stores.documents, formData, {
      token,
    }),
  );
}
