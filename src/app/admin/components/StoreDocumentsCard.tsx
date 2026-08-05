import React, { useState } from "react";
import { StoreDocument } from "../api/user-detail-api";
import { Endpoints } from "@/utils/endpoints";

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
  isPendingVerification = false,
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

    const fileName = doc.documentUrl.split("/").pop() || `${doc.verificationType || "document"}`;
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
        className={`bg-white rounded-2xl border border-[#e0e6df] p-6 shadow-sm flex flex-col gap-4 ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#eeeee9] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#eeeee9] text-[#005129]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#1a1c19]">
                {isRtl ? "مستندات التوثيق والاعتماد" : "Verification Documents"}
              </h3>
              <p className="text-[10px] text-[#707a70]">
                {isRtl ? "المستندات الرسمية المقدمة لمراجعة الطلب" : "Submitted official credentials for review"}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eeeee9] text-[#404941]">
            {documents.length} {isRtl ? "مستندات" : "docs"}
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="py-6 text-center text-xs font-semibold text-[#707a70] bg-[#fafaf4] rounded-xl border border-dashed border-[#eeeee9]">
            {isRtl ? "لا توجد مستندات مرفوعة لهذا الحساب" : "No uploaded verification documents found."}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {documents.map((doc) => {
              const fileName = doc.documentUrl.split("/").pop() || "Document";
              const isDownloading = downloadingId === doc.id;

              return (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl bg-[#fafaf4] border border-[#eeeee9] flex items-center justify-between gap-3 hover:border-[#bfc9be] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getDocIcon(doc.documentUrl)}
                    <div className={`flex flex-col min-w-0 ${isRtl ? "items-end text-right" : ""}`}>
                      <span className="text-xs font-bold text-[#1a1c19] truncate max-w-[180px] sm:max-w-[260px]">
                        {getDocTitle(doc.verificationType)}
                      </span>
                      <span className="text-[10px] text-[#707a70] font-mono truncate max-w-[160px] sm:max-w-[220px]">
                        {fileName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#eeeee9] text-[#005129] hover:bg-[#eeeee9] transition-colors text-xs font-bold cursor-pointer"
                      title={isRtl ? "معاينة المستند" : "View Document"}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
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
                        <svg className="w-3.5 h-3.5 animate-spin text-emerald-700" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
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
          <div className="pt-3 border-t border-[#eeeee9] flex flex-col gap-3">
            {status === "ACTIVE" ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-bold">
                    {isRtl ? "تم توثيق واعتماد هذا الحساب بنجاح" : "Account & Documents Verified Successfully"}
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
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    <span>{isRtl ? "إلغاء الاعتماد / رفض" : "Revoke / Reject"}</span>
                  </button>
                )}
              </div>
            ) : status === "SUSPENDED" ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200 text-red-800">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-bold">
                    {isRtl ? "تم رفض الطلب وتعطيل التوثيق" : "Verification Application Rejected / Suspended"}
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
                      <svg className="w-3 h-3 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    <span>{isRtl ? "إعادة التوثيق والاعتماد" : "Re-approve Application"}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 justify-end">
                {onApprove && (
                  <button
                    type="button"
                    onClick={handleApproveAction}
                    disabled={isApproving || isRejecting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#005129] text-white hover:bg-[#00381a] disabled:opacity-50 transition-all text-xs font-extrabold cursor-pointer shadow-sm active:scale-95"
                  >
                    {isApproving ? (
                      <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                    <span>
                      {isApproving
                        ? (isRtl ? "جارٍ التوثيق..." : "Approving...")
                        : (isRtl ? "توثيق واعتماد الطلب" : "Approve & Verify Account")}
                    </span>
                  </button>
                )}

                {onReject && (
                  <button
                    type="button"
                    onClick={handleRejectAction}
                    disabled={isApproving || isRejecting}
                    className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 disabled:opacity-50 transition-all text-xs font-bold cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-xs"
                  >
                    {isRejecting ? (
                      <svg className="w-4 h-4 animate-spin text-red-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span>
                      {isRejecting
                        ? (isRtl ? "جارٍ الرفض..." : "Rejecting...")
                        : (isRtl ? "رفض الطلب" : "Reject Application")}
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
            <div className={`p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 ${isRtl ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                {getDocIcon(previewDoc.documentUrl)}
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    {getDocTitle(previewDoc.verificationType)}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-mono">
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">{isRtl ? "تحميل" : "Download"}</span>
                </button>

                <a
                  href={resolveUrl(previewDoc.documentUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-bold flex items-center gap-1.5"
                  title={isRtl ? "فتح في نافذة جديدة" : "Open in new tab"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="hidden sm:inline">{isRtl ? "فتح بالمتصفح" : "Open tab"}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-gray-900/5 min-h-[400px]">
              {previewDoc.documentUrl.toLowerCase().includes(".pdf") ? (
                <iframe
                  src={resolveUrl(previewDoc.documentUrl)}
                  className="w-full h-[70vh] rounded-xl border border-gray-200 bg-white shadow-inner"
                  title={getDocTitle(previewDoc.verificationType)}
                />
              ) : (
                <div className="relative flex items-center justify-center max-w-full max-h-[70vh]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveUrl(previewDoc.documentUrl)}
                    alt={getDocTitle(previewDoc.verificationType)}
                    className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-lg border border-gray-200 bg-white"
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

