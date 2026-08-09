"use client";

import React, { useState } from "react";
import { AdminDictionary } from "../../constants/dictionary";
import { GuidelineDocument, DocumentCategory } from "../../types/admin.types";
import { DocumentUploadModal } from "./DocumentUploadModal";
import {
  FileIcon,
  PlusIcon,
  SparklesIcon,
  ClockIcon,
} from "@/components/icons";

interface GuidelineDocumentsSectionProps {
  documents: GuidelineDocument[];
  t: AdminDictionary;
  isRtl?: boolean;
  onUploadDocument: (data: {
    name: string;
    category: DocumentCategory;
    version: string;
    fileSize: string;
  }) => void;
  onToggleStatus: (id: string, currentStatus: "Draft" | "Published") => void;
}

export const GuidelineDocumentsSection: React.FC<
  GuidelineDocumentsSectionProps
> = ({ documents, t, isRtl = false, onUploadDocument, onToggleStatus }) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div
            className={`flex items-center gap-3 ${isRtl ? "text-right" : "text-left"}`}
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-primary font-sans">
                {t.tabGuidelineDocs}
              </h3>
              <p className="text-xs text-outline font-medium">
                {isRtl
                  ? "إدارة المستندات واللوائح المصدرية لنموذج الذكاء الاصطناعي (RAG)"
                  : "Manage source policy docs powering AI donation eligibility (RAG pipeline)"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <PlusIcon className="w-4 h-4" />
            <span>{t.uploadDocumentBtn}</span>
          </button>
        </div>

        {/* Document Table */}
        <div className="overflow-x-auto border border-card-border rounded-xl">
          <table
            className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}
          >
            <thead>
              <tr className="bg-surface border-b border-card-border">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
                  {t.documentNameCol}
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
                  {t.categoryCol}
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
                  {t.versionCol}
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
                  {t.ragIndexCol}
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
                  {t.statusCol}
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-outline text-center whitespace-nowrap">
                  {t.actionsCol}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {documents.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-xs text-outline font-semibold"
                  >
                    {t.noData}
                  </td>
                </tr>
              ) : (
                documents.map((doc) => {
                  const isPublished = doc.status === "Published";
                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-surface/60 transition-colors"
                    >
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0">
                            <FileIcon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-on-surface">
                              {doc.name}
                            </span>
                            <span className="text-[10px] text-outline">
                              {doc.fileSize} • {doc.lastUpdated}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3.5 whitespace-nowrap text-xs">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-surface-container text-on-surface-variant border border-outline-variant/40">
                          {doc.category}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 whitespace-nowrap text-xs font-bold font-mono text-outline">
                        {doc.version}
                      </td>

                      <td className="px-3 py-3.5 whitespace-nowrap text-xs">
                        {doc.lastRagIndexedAt ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold">
                            <SparklesIcon className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              {t.ragIndexedAt.replace(
                                "{time}",
                                doc.lastRagIndexedAt,
                              )}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-700 text-[10px] font-bold">
                            <ClockIcon className="w-3.5 h-3.5 text-amber-600" />
                            <span>{t.ragPendingIndex}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-3.5 whitespace-nowrap text-xs">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-surface-container text-outline border border-outline-variant/40"
                          }`}
                        >
                          {isPublished ? t.publishedStatus : t.draftStatus}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(doc.id, doc.status)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            isPublished
                              ? "bg-surface-container hover:bg-surface-container-high text-outline"
                              : "bg-primary-container hover:bg-primary text-on-primary"
                          }`}
                        >
                          {isPublished ? t.unpublishBtn : t.publishBtn}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DocumentUploadModal
        isOpen={isUploadOpen}
        t={t}
        isRtl={isRtl}
        onClose={() => setIsUploadOpen(false)}
        onUpload={onUploadDocument}
      />
    </div>
  );
};
