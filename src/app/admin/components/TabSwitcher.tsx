import React from "react";

export interface TabOption<T extends string> {
  id: T;
  label: string;
}

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
    <div className="bg-[#eeeee9] p-1 rounded-xl flex gap-1 border border-[#bfc9be]/50 shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 sm:px-5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all whitespace-nowrap ${
              isActive
                ? "bg-white text-[#00381a] shadow-sm"
                : "text-[#707a70] hover:text-[#1a1c19]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
