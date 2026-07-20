"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowForwardIcon } from "@/components/icons/arrow-forward-icon";
import { FileIcon } from "@/components/icons/file-icon";
import { ShieldCheckIcon } from "@/components/icons/shield-check-icon";
import { StoreIcon } from "@/components/icons/store-icon";
import { FileUploadZone } from "./file-upload-zone";
import { documentUploadSchema } from "../../lib/schemas";
import {
  useRegisterFlow,
  type DocumentsState,
} from "../../lib/register-flow-context";
import { submitDocumentUpload } from "../../services/register-service";

export function DocumentUploadForm() {
  const router = useRouter();
  const { documents, setDocuments } = useRegisterFlow();
  const [errors, setErrors] = useState<
    Partial<Record<keyof DocumentsState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  function updateDocument(key: keyof DocumentsState, file: File | null) {
    setDocuments({ ...documents, [key]: file });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = documentUploadSchema.safeParse(documents);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof DocumentsState, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof DocumentsState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    await submitDocumentUpload(result.data);
    router.push("/register/pending");
  }

  return (
    <Card.Root className="bg-light-green">
      <Card.Body className="items-center gap-stack-lg p-16 text-center">
        <div className="flex flex-col items-center gap-2">
          <Heading as="h1" level="lg" className="text-center text-primary">
            رفع المستندات
          </Heading>
          <Text
            variant="body-md"
            className="max-w-lg text-center text-on-surface-variant"
          >
            يرجى تقديم المستندات القانونية التالية للتحقق من صحة النشاط التجاري.
          </Text>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-stack-md"
          noValidate
        >
          <FileUploadZone
            icon={<FileIcon className="h-6 w-6" />}
            title="السجل التجاري"
            caption="يقبل: PDF, JPG, PNG (حتى 5 ميجابايت)"
            accept=".pdf,.jpg,.jpeg,.png"
            name="commercialRegistration"
            file={documents.commercialRegistration}
            error={errors.commercialRegistration}
            onFileChange={(file) =>
              updateDocument("commercialRegistration", file)
            }
          />

          <FileUploadZone
            icon={<ShieldCheckIcon className="h-6 w-6" />}
            title="شهادة الرقم الضريبي"
            caption="يقبل: PDF, JPG, PNG (حتى 5 ميجابايت)"
            accept=".pdf,.jpg,.jpeg,.png"
            name="taxId"
            file={documents.taxId}
            error={errors.taxId}
            onFileChange={(file) => updateDocument("taxId", file)}
          />

          <FileUploadZone
            icon={<StoreIcon className="h-6 w-6" />}
            title="صورة المتجر أو المنشأة"
            caption="يقبل: JPG, PNG (صورة خارجية)"
            accept=".jpg,.jpeg,.png"
            name="storePhoto"
            file={documents.storePhoto}
            error={errors.storePhoto}
            onFileChange={(file) => updateDocument("storePhoto", file)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            endIcon={<ArrowForwardIcon className="h-4 w-4" />}
            disabled={submitting}
            className="mt-4 w-full text-white"
          >
            {submitting ? "جارٍ الإرسال..." : "إرسال للمراجعة"}
          </Button>
        </form>

        <Text variant="body-md" className="text-on-surface-variant">
          هل تحتاج مساعدة؟{" "}
          <a href="#" className="text-link">
            تواصل مع الدعم
          </a>
        </Text>
      </Card.Body>
    </Card.Root>
  );
}
