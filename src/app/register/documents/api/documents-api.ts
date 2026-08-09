import { createOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { withAuth } from "@/utils/api-client";

/** Uploads a single store verification document (POST /stores/me/documents). */
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

/** Uploads a single charity verification document (POST /charities/me/documents). */
export function uploadCharityDocument(type: string, file: File, email: string) {
  const formData = new FormData();
  formData.append("Email", email);
  formData.append("Type", type);
  formData.append("File", file);

  return withAuth((token) =>
    createOne<null, FormData>(Endpoints.charities.documents, formData, {
      token,
    }),
  );
}
