"use client";

import React, { useState } from "react";
import { useAppLang } from "@/store/use-app-lang";
import { adminDictionary } from "../../constants/dictionary";
import { TabSwitcher } from "../../components";
import { CheckIcon } from "@/components/icons";

import { GlobalAutomationDefaults } from "../../types/admin.types";

import { updateAutomationDefaults } from "../../api/system-settings-api";

import { AutomationDefaultsSection } from "./AutomationDefaultsSection";

type SettingsTab = "automation" | "guidelines";

interface SystemSettingsClientContainerProps {
  initialDefaults: GlobalAutomationDefaults;
}

export function SystemSettingsClientContainer({
  initialDefaults,
}: SystemSettingsClientContainerProps) {
  const { lang } = useAppLang();
  const t = adminDictionary[lang];
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] = useState<SettingsTab>("automation");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States
  const [defaults, setDefaults] =
    useState<GlobalAutomationDefaults>(initialDefaults);

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

  const tabOptions = [{ id: "automation", label: t.tabGlobalAutomation }];

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
    </div>
  );
}
