"use client";

import React, { useState } from "react";
import { useAdminLang } from "@/store/use-admin-lang";
import { adminDictionary } from "../../constants/dictionary";
import { TabSwitcher } from "../../components";
import { CheckIcon } from "@/components/icons";

import {
  GlobalAutomationDefaults,
  GuidelineDocument,
  PlatformAdmin,
  SecuritySettings,
  AiObservabilitySettings,
  DocumentCategory,
  AdminPermission,
} from "../../types/admin.types";

import {
  updateAutomationDefaults,
  uploadGuidelineDocument,
  toggleDocumentStatus,
  updateAdminPermissions,
  updateSecuritySettings,
  updateAiObservabilitySettings,
} from "../../api/system-settings-api";

import { AutomationDefaultsSection } from "./AutomationDefaultsSection";
import { GuidelineDocumentsSection } from "./GuidelineDocumentsSection";
import { SecurityRbacSection } from "./SecurityRbacSection";
import { AiObservabilitySection } from "./AiObservabilitySection";

type SettingsTab = "automation" | "guidelines" | "roles" | "observability";

interface SystemSettingsClientContainerProps {
  initialDefaults: GlobalAutomationDefaults;
  initialDocuments: GuidelineDocument[];
  initialAdmins: PlatformAdmin[];
  initialSecuritySettings: SecuritySettings;
  initialAiObservabilitySettings: AiObservabilitySettings;
}

export function SystemSettingsClientContainer({
  initialDefaults,
  initialDocuments,
  initialAdmins,
  initialSecuritySettings,
  initialAiObservabilitySettings,
}: SystemSettingsClientContainerProps) {
  const { lang } = useAdminLang();
  const t = adminDictionary[lang];
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] = useState<SettingsTab>("automation");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States
  const [defaults, setDefaults] =
    useState<GlobalAutomationDefaults>(initialDefaults);
  const [documents, setDocuments] =
    useState<GuidelineDocument[]>(initialDocuments);
  const [admins, setAdmins] = useState<PlatformAdmin[]>(initialAdmins);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(
    initialSecuritySettings,
  );
  const [observabilitySettings, setObservabilitySettings] =
    useState<AiObservabilitySettings>(initialAiObservabilitySettings);

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
            ? "تم نشر المستند وإضافته لفهرس الذكاء الاصطناعي (RAG)."
            : "Document published and indexed into RAG pipeline."
          : isRtl
            ? "تم تحويل المستند لمسودة وإيقاف الفهرسة."
            : "Document unpublished and reverted to draft.",
      );
    }
  };

  const handleUpdateAdmin = async (
    id: string,
    permissions: AdminPermission[],
    roleTitle: string,
  ) => {
    const res = await updateAdminPermissions(id, permissions, roleTitle);
    if (res.data) {
      setAdmins((prev) =>
        prev.map((adm) =>
          adm.id === id
            ? { ...adm, permissions, roleTitle: res.data!.roleTitle }
            : adm,
        ),
      );
      showToast(
        isRtl
          ? "تم تعديل صلاحيات الحساب الإداري بنجاح."
          : "Admin permissions updated successfully.",
      );
    }
  };

  const handleUpdateSecuritySettings = async (updated: SecuritySettings) => {
    const res = await updateSecuritySettings(updated);
    if (res.data) {
      setSecuritySettings(res.data);
      showToast(
        isRtl
          ? "تم تحديل سياسات الأمان وتخزين سجلات المراجعة."
          : "Security and Audit Log retention settings updated.",
      );
    }
  };

  const handleUpdateAiObservability = async (
    updated: AiObservabilitySettings,
  ) => {
    const res = await updateAiObservabilitySettings(updated);
    if (res.data) {
      setObservabilitySettings(res.data);
      showToast(
        isRtl
          ? "تم تحديث إعدادات التخزين المؤقت والمراقبة بنجاح."
          : "AI caching and observability settings saved.",
      );
    }
  };

  const tabOptions = [
    { id: "automation", label: t.tabGlobalAutomation },
    { id: "guidelines", label: t.tabGuidelineDocs, badge: documents.length },
    { id: "roles", label: t.tabSecurityRbac, badge: admins.length },
    { id: "observability", label: t.tabAiObservability },
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary font-brand tracking-tight">
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

      {activeTab === "roles" && (
        <SecurityRbacSection
          admins={admins}
          securitySettings={securitySettings}
          t={t}
          isRtl={isRtl}
          onUpdateAdmin={handleUpdateAdmin}
          onUpdateSecuritySettings={handleUpdateSecuritySettings}
        />
      )}

      {activeTab === "observability" && (
        <AiObservabilitySection
          observabilitySettings={observabilitySettings}
          t={t}
          isRtl={isRtl}
          onSave={handleUpdateAiObservability}
        />
      )}
    </div>
  );
}
