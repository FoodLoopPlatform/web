"use client";

import React, { useState } from "react";
import { StoreDocument } from "../../types/admin.types";
import { Endpoints } from "@/utils/endpoints";
import {
  DownloadIcon,
  EyeIcon,
  SpinnerIcon,
  CloseIcon,
  ExternalLinkIcon,
  FileIcon,
} from "@/components/icons";

interface StoreDocumentsCardProps {
  documents?: StoreDocument[];
  isRtl?: boolean;
  status?: "ACTIVE" | "SUSPENDED" | "PENDING";
  onApprove?: () => Promise<void> | void;
  onReject?: () => Promise<void> | void;
  isPendingVerification?: boolean;
}

export const StoreDocumentsCard: React.FC<StoreDocumentsCardProps> = ({
  documents = [],
  isRtl = false,
  status = "PENDING",
  onApprove,
  onReject,
}) => {
  const [previewDoc, setPreviewDoc] = useState<StoreDocument | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApproveAction = async () => {
    if (!onApprove) return;
    setIsApproving(true);
    try {
      await onApprove();
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectAction = async () => {
    if (!onReject) return;
    setIsRejecting(true);
    try {
      await onReject();
    } finally {
      setIsRejecting(false);
    }
  };

  const resolveUrl = (url?: string) => {
    if (!url) return "";
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
  };

  const getDocTitle = (type: string) => {
    switch (type) {
      case "StoreFacilityPhoto":
        return isRtl ? "صورة واجهة / منشأة المتجر" : "Store Facility Photo";
      case "CommercialRegistration":
        return isRtl ? "مستخرج السجل التجاري" : "Commercial Registration";
      case "TaxIdCertificate":
        return isRtl ? "شهادة البطاقة الضريبية" : "Tax ID Certificate";
      default:
        return type;
    }
  };

  const getDocIcon = (url: string) => {
    const isPdf = url.toLowerCase().includes(".pdf");
    if (isPdf) {
      return (
        <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 font-bold text-[10px]">
          PDF
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 font-bold text-[10px]">
        IMG
      </div>
    );
  };

  const handleDownload = async (doc: StoreDocument) => {
    const fullUrl = resolveUrl(doc.documentUrl);
    if (!fullUrl) return;

    const fileName =
      doc.documentUrl.split("/").pop() ||
      `${doc.verificationType || "document"}`;
    setDownloadingId(doc.id);

    try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName.includes(".") ? fileName : `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback if fetch fails (CORS restriction or network issue)
      const link = document.createElement("a");
      link.href = fullUrl;
      link.target = "_blank";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-4 ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-surface-container text-primary-container">
              <FileIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-on-surface">
                {isRtl ? "مستندات التوثيق والاعتماد" : "Verification Documents"}
              </h3>
              <p className="text-[10px] text-outline">
                {isRtl
                  ? "المستندات الرسمية المقدمة لمراجعة الطلب"
                  : "Submitted official credentials for review"}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant">
            {documents.length} {isRtl ? "مستندات" : "docs"}
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="py-6 text-center text-xs font-semibold text-outline bg-surface rounded-xl border border-dashed border-surface-container">
            {isRtl
              ? "لا توجد مستندات مرفوعة لهذا الحساب"
              : "No uploaded verification documents found."}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {documents.map((doc) => {
              const fileName = doc.documentUrl.split("/").pop() || "Document";
              const isDownloading = downloadingId === doc.id;

              return (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl bg-surface border border-surface-container flex items-center justify-between gap-3 hover:border-outline-variant transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getDocIcon(doc.documentUrl)}
                    <div
                      className={`flex flex-col min-w-0 ${isRtl ? "items-end text-right" : ""}`}
                    >
                      <span className="text-xs font-bold text-on-surface truncate max-w-[180px] sm:max-w-[260px]">
                        {getDocTitle(doc.verificationType)}
                      </span>
                      <span className="text-[10px] text-outline font-mono truncate max-w-[160px] sm:max-w-[220px]">
                        {fileName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-surface-container text-primary-container hover:bg-surface-container transition-colors text-xs font-bold cursor-pointer"
                      title={isRtl ? "معاينة المستند" : "View Document"}
                    >
                      <EyeIcon className="w-3.5 h-3.5" />
                      <span>{isRtl ? "معاينة" : "View"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      disabled={isDownloading}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 transition-colors text-xs font-bold cursor-pointer"
                      title={isRtl ? "تحميل المستند" : "Download Document"}
                    >
                      {isDownloading ? (
                        <SpinnerIcon className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                      ) : (
                        <DownloadIcon className="w-3.5 h-3.5" />
                      )}
                      <span>{isRtl ? "تحميل" : "Download"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Approve / Reject Actions bar */}
        {(onApprove || onReject) && (
          <div className="pt-3 border-t border-surface-container flex flex-col gap-3">
            {status === "ACTIVE" ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">
                    {isRtl
                      ? "تم توثيق واعتماد هذا الحساب بنجاح"
                      : "Account & Documents Verified Successfully"}
                  </span>
                </div>
                {onReject && (
                  <button
                    type="button"
                    onClick={handleRejectAction}
                    disabled={isRejecting}
                    className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors text-xs font-bold cursor-pointer flex items-center gap-1 disabled:opacity-50"
                  >
                    {isRejecting && (
                      <SpinnerIcon className="w-3 h-3 animate-spin" />
                    )}
                    <span>
                      {isRtl ? "إلغاء الاعتماد / رفض" : "Revoke / Reject"}
                    </span>
                  </button>
                )}
              </div>
            ) : status === "SUSPENDED" ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200 text-red-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">
                    {isRtl
                      ? "تم رفض الطلب وتعطيل التوثيق"
                      : "Verification Application Rejected / Suspended"}
                  </span>
                </div>
                {onApprove && (
                  <button
                    type="button"
                    onClick={handleApproveAction}
                    disabled={isApproving}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-xs font-bold cursor-pointer flex items-center gap-1 disabled:opacity-50"
                  >
                    {isApproving && (
                      <SpinnerIcon className="w-3 h-3 animate-spin text-white" />
                    )}
                    <span>
                      {isRtl
                        ? "إعادة التوثيق والاعتماد"
                        : "Re-approve Application"}
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {onApprove && (
                  <button
                    type="button"
                    onClick={handleApproveAction}
                    disabled={isApproving || isRejecting}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary hover:bg-primary disabled:opacity-50 transition-all text-xs font-extrabold cursor-pointer shadow-sm active:scale-95"
                  >
                    {isApproving ? (
                      <SpinnerIcon className="w-4 h-4 animate-spin text-on-primary" />
                    ) : null}
                    <span>
                      {isApproving
                        ? isRtl
                          ? "جارٍ التوثيق..."
                          : "Approving..."
                        : isRtl
                          ? "توثيق واعتماد الطلب"
                          : "Approve & Verify Account"}
                    </span>
                  </button>
                )}

                {onReject && (
                  <button
                    type="button"
                    onClick={handleRejectAction}
                    disabled={isApproving || isRejecting}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 disabled:opacity-50 transition-all text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
                  >
                    {isRejecting ? (
                      <SpinnerIcon className="w-4 h-4 animate-spin text-red-600" />
                    ) : (
                      <CloseIcon className="w-4 h-4" />
                    )}
                    <span>
                      {isRejecting
                        ? isRtl
                          ? "جارٍ الرفض..."
                          : "Rejecting..."
                        : isRtl
                          ? "رفض الطلب"
                          : "Reject Application"}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
          <div
            className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden ${
              isRtl ? "text-right" : "text-left"
            }`}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3">
                {getDocIcon(previewDoc.documentUrl)}
                <div>
                  <h4 className="text-sm font-bold text-on-surface">
                    {getDocTitle(previewDoc.verificationType)}
                  </h4>
                  <p className="text-[11px] text-outline font-mono">
                    {previewDoc.documentUrl.split("/").pop()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(previewDoc)}
                  className="p-2 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors text-xs font-bold flex items-center gap-1.5"
                  title={isRtl ? "تحميل" : "Download"}
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {isRtl ? "تحميل" : "Download"}
                  </span>
                </button>

                <a
                  href={resolveUrl(previewDoc.documentUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors text-xs font-bold flex items-center gap-1.5"
                  title={isRtl ? "فتح في نافذة جديدة" : "Open in new tab"}
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {isRtl ? "فتح بالمتصفح" : "Open tab"}
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-surface min-h-[400px]">
              {previewDoc.documentUrl.toLowerCase().includes(".pdf") ? (
                <iframe
                  src={resolveUrl(previewDoc.documentUrl)}
                  className="w-full h-[70vh] rounded-xl border border-surface-container bg-white shadow-inner"
                  title={getDocTitle(previewDoc.verificationType)}
                />
              ) : (
                <div className="relative flex items-center justify-center max-w-full max-h-[70vh]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveUrl(previewDoc.documentUrl)}
                    alt={getDocTitle(previewDoc.verificationType)}
                    className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-lg border border-surface-container bg-white"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
