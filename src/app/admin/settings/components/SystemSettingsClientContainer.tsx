"use client";

import React, { useState } from "react";
import { useAppLang } from "@/store/use-app-lang";
import { adminDictionary } from "../../constants/dictionary";
import { TabSwitcher } from "../../components";
import { CheckIcon } from "@/components/icons";

import {
  GlobalAutomationDefaults,
  GuidelineDocument,
  DocumentCategory,
} from "../../types/admin.types";

import {
  updateAutomationDefaults,
  uploadGuidelineDocument,
  toggleDocumentStatus,
} from "../../api/system-settings-api";

import { AutomationDefaultsSection } from "./AutomationDefaultsSection";
import { GuidelineDocumentsSection } from "./GuidelineDocumentsSection";

type SettingsTab = "automation" | "guidelines";

interface SystemSettingsClientContainerProps {
  initialDefaults: GlobalAutomationDefaults;
  initialDocuments: GuidelineDocument[];
}

export function SystemSettingsClientContainer({
  initialDefaults,
  initialDocuments,
}: SystemSettingsClientContainerProps) {
  const { lang } = useAppLang();
  const t = adminDictionary[lang];
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] = useState<SettingsTab>("automation");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States
  const [defaults, setDefaults] =
    useState<GlobalAutomationDefaults>(initialDefaults);
  const [documents, setDocuments] =
    useState<GuidelineDocument[]>(initialDocuments);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleSaveDefaults = async (updated: GlobalAutomationDefaults) => {
    const res = await updateAutomationDefaults(updated);
    if (res.data) {
      setDefaults(res.data);
      showToast(t.saveSuccess);
    }
  };

  const handleUploadDocument = async (data: {
    name: string;
    category: DocumentCategory;
    version: string;
    fileSize: string;
  }) => {
    const res = await uploadGuidelineDocument(data);
    if (res.data) {
      setDocuments((prev) => [res.data!, ...prev]);
      showToast(
        isRtl
          ? `تم رفع المستند المصدر "${data.name}" بنجاح كمسودة.`
          : `Source document "${data.name}" uploaded successfully as draft.`,
      );
    }
  };

  const handleToggleDocStatus = async (
    id: string,
    currentStatus: "Draft" | "Published",
  ) => {
    const nextStatus = currentStatus === "Published" ? "Draft" : "Published";
    const res = await toggleDocumentStatus(id, nextStatus);
    if (res.data) {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                status: res.data!.status,
                lastRagIndexedAt:
                  res.data!.lastRagIndexedAt || doc.lastRagIndexedAt,
              }
            : doc,
        ),
      );
      showToast(
        nextStatus === "Published"
          ? isRtl
            ? "تم نشر المستند وإضافته للفهرس الذكاء الاصطناعي (RAG)."
            : "Document published and indexed into RAG pipeline."
          : isRtl
            ? "تم تحويل المستند لمسودة وإيقاف الفهرسة."
            : "Document unpublished and reverted to draft.",
      );
    }
  };

  const tabOptions = [
    { id: "automation", label: t.tabGlobalAutomation },
    { id: "guidelines", label: t.tabGuidelineDocs, badge: documents.length },
  ];

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto pb-12 w-full">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 end-6 z-[9999] bg-on-surface text-white px-4 py-3 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckIcon className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className={isRtl ? "text-right" : "text-left"}>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary font-sans tracking-tight">
          {t.settingsTitle}
        </h1>
        <p className="text-xs sm:text-sm text-outline mt-1 font-medium">
          {t.settingsSubtitle}
        </p>
      </div>

      {/* Navigation Tabs */}
      <TabSwitcher
        tabs={tabOptions}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as SettingsTab)}
      />

      {/* Active Tab Panel */}
      {activeTab === "automation" && (
        <AutomationDefaultsSection
          defaults={defaults}
          t={t}
          isRtl={isRtl}
          onSave={handleSaveDefaults}
        />
      )}

      {activeTab === "guidelines" && (
        <GuidelineDocumentsSection
          documents={documents}
          t={t}
          isRtl={isRtl}
          onUploadDocument={handleUploadDocument}
          onToggleStatus={handleToggleDocStatus}
        />
      )}
    </div>
  );
}
