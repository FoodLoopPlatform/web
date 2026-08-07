"use client";

import React from "react";
import { TabOption } from "../../types/admin.types";

export type { TabOption };

interface TabSwitcherProps<T extends string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
}

export function TabSwitcher<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabSwitcherProps<T>) {
  return (
    <div className="bg-surface-container p-1 rounded-xl flex gap-1 border border-outline-variant/50 shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 sm:px-5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all whitespace-nowrap ${
              isActive
                ? "bg-white text-primary shadow-sm"
                : "text-outline hover:text-on-surface"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
