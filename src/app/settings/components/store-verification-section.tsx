"use client";

import type { ReactNode } from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import {
  ShieldCheckIcon,
  AlertCircleIcon,
  CloseIcon,
  FileIcon,
  ExternalLinkIcon,
} from "@/components/icons";
import { Endpoints } from "@/utils/endpoints";
import type { StoreDocument, StoreVerificationStatus } from "../api/types";

type StoreVerificationSectionProps = {
  verificationStatus: StoreVerificationStatus;
  documents: StoreDocument[];
};

const STATUS_STYLES: Record<
  StoreVerificationStatus,
  { label: string; className: string; icon: ReactNode }
> = {
  Verified: {
    label: "موثّق",
    className: "bg-primary-fixed text-primary",
    icon: <ShieldCheckIcon className="h-4 w-4" />,
  },
  Unverified: {
    label: "بانتظار المراجعة",
    className: "bg-surface-container-high text-on-surface-variant",
    icon: <AlertCircleIcon className="h-4 w-4" />,
  },
  Rejected: {
    label: "مرفوض",
    className: "bg-error-container text-on-error-container",
    icon: <CloseIcon className="h-4 w-4" />,
  },
};

const DOC_TYPE_LABELS: Record<string, string> = {
  StoreFacilityPhoto: "صورة واجهة / منشأة المتجر",
  CommercialRegistration: "مستخرج السجل التجاري",
  TaxIdCertificate: "شهادة البطاقة الضريبية",
};

const DOC_STATUS_STYLES: Record<string, string> = {
  Verified: "bg-primary-fixed text-primary",
  Pending: "bg-surface-container-high text-on-surface-variant",
  Rejected: "bg-error-container text-on-error-container",
};

const DOC_STATUS_LABELS: Record<string, string> = {
  Verified: "معتمد",
  Pending: "قيد المراجعة",
  Rejected: "مرفوض",
};

function resolveDocumentUrl(url: string): string {
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${Endpoints.baseUrl}${cleanPath}`;
}

export function StoreVerificationSection({
  verificationStatus,
  documents,
}: StoreVerificationSectionProps) {
  const statusInfo = STATUS_STYLES[verificationStatus];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start border-b border-outline-variant/30 pb-8">
      <div className="lg:col-span-1 flex flex-col gap-2">
        <Heading level="md" className="text-primary font-bold">
          التوثيق والمستندات
        </Heading>
        <Text
          variant="body-md"
          className="text-on-surface-variant leading-relaxed"
        >
          حالة توثيق المتجر والمستندات الرسمية المقدمة عند التسجيل.
        </Text>
      </div>

      <div className="lg:col-span-2">
        <Card.Root className="border border-outline-variant/40 bg-surface-container-lowest rounded-xl shadow-sm">
          <Card.Body className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-body-md font-semibold text-on-surface">
                حالة التوثيق
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo.className}`}
              >
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </div>

            {documents.length === 0 ? (
              <div className="py-6 text-center text-body-md font-semibold text-outline bg-surface rounded-xl border border-dashed border-outline-variant">
                لا توجد مستندات مرفوعة لهذا المتجر
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-surface border border-outline-variant/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                        <FileIcon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-body-md font-bold text-on-surface truncate">
                          {DOC_TYPE_LABELS[doc.verificationType] ||
                            doc.verificationType}
                        </span>
                        <span
                          className={`inline-flex w-fit mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            DOC_STATUS_STYLES[doc.status] ||
                            "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          {DOC_STATUS_LABELS[doc.status] || doc.status}
                        </span>
                      </div>
                    </div>

                    <a
                      href={resolveDocumentUrl(doc.documentUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant text-primary hover:bg-surface-container-low transition-colors text-xs font-bold shrink-0"
                    >
                      <ExternalLinkIcon className="h-3.5 w-3.5" />
                      عرض
                    </a>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card.Root>
      </div>
    </div>
  );
}
