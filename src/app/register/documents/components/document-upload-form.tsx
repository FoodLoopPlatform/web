"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowForwardIcon } from "@/components/icons/arrow-forward-icon";
import { FileIcon } from "@/components/icons/file-icon";
import { ShieldCheckIcon } from "@/components/icons/shield-check-icon";
import { StoreIcon } from "@/components/icons/store-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { FileUploadZone } from "./file-upload-zone";
import {
  charityDocumentTypeMap,
  charityDocumentUploadSchema,
  storeDocumentTypeMap,
  storeDocumentUploadSchema,
} from "../../lib/schemas";
import {
  useRegisterFlow,
  type DocumentsState,
} from "../../lib/register-flow-context";
import { submitDocumentUpload } from "../../services/register-service";

type DocumentField = {
  key: keyof DocumentsState;
  icon: React.ReactNode;
  title: string;
  caption: string;
  accept: string;
};

const storeFields: DocumentField[] = [
  {
    key: "commercialRegistration",
    icon: <FileIcon className="h-6 w-6" />,
    title: "السجل التجاري",
    caption: "يقبل: PDF, JPG, PNG (حتى 5 ميجابايت)",
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    key: "taxId",
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    title: "شهادة الرقم الضريبي",
    caption: "يقبل: PDF, JPG, PNG (حتى 5 ميجابايت)",
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    key: "storePhoto",
    icon: <StoreIcon className="h-6 w-6" />,
    title: "صورة المتجر أو المنشأة",
    caption: "يقبل: JPG, PNG (صورة خارجية)",
    accept: ".jpg,.jpeg,.png",
  },
];

const charityFields: DocumentField[] = [
  {
    key: "declarationDecree",
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    title: "قرار الاشهار",
    caption: "يقبل: PDF, JPG, PNG (حتى 5 ميجابايت)",
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    key: "boardMembersList",
    icon: <UserIcon className="h-6 w-6" />,
    title: "كشف اسماء مجلس الادارة",
    caption: "يقبل: PDF, JPG, PNG (حتى 5 ميجابايت)",
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    key: "bylaws",
    icon: <FileIcon className="h-6 w-6" />,
    title: "النظام الاساسي للجمعية",
    caption: "يقبل: PDF, JPG, PNG (حتى 5 ميجابايت)",
    accept: ".pdf,.jpg,.jpeg,.png",
  },
];

export function DocumentUploadForm() {
  const router = useRouter();
  const email = useAppStore((state) => state.user?.email);
  const { accountType, documents, setDocuments } = useRegisterFlow();
  const [errors, setErrors] = useState<
    Partial<Record<keyof DocumentsState, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isCharity = accountType === "Charity";
  const fields = isCharity ? charityFields : storeFields;
  const schema = isCharity
    ? charityDocumentUploadSchema
    : storeDocumentUploadSchema;
  const typeMap = isCharity ? charityDocumentTypeMap : storeDocumentTypeMap;

  function updateDocument(key: keyof DocumentsState, file: File | null) {
    setDocuments({ ...documents, [key]: file });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse(documents);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof DocumentsState, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof DocumentsState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    if (!email) {
      setSubmitError("انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى");
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);
    const res = await submitDocumentUpload(result.data, typeMap, email);

    setSubmitting(false);

    if (!res.success) {
      setSubmitError("حدث خطأ غير متوقع");
      return;
    }

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
            className=" text-center text-on-surface-variant"
          >
            يرجى تقديم المستندات القانونية التالية للتحقق من صحة النشاط التجاري.
          </Text>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-stack-md"
          noValidate
        >
          {fields.map((field) => (
            <FileUploadZone
              key={field.key}
              icon={field.icon}
              title={field.title}
              caption={field.caption}
              accept={field.accept}
              name={field.key}
              file={documents[field.key]}
              error={errors[field.key]}
              onFileChange={(file) => updateDocument(field.key, file)}
            />
          ))}

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

        {submitError && (
          <div className="w-full whitespace-pre-line rounded-md bg-error-container px-4 py-2 text-body-md text-on-error-container">
            {submitError}
          </div>
        )}
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
