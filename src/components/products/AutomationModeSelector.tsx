"use client";

import { Icon } from "@/components/ui/icon";
import { automationModeOptions } from "@/app/pricing/lib/mock-data";
import type { AutomationMode } from "@/app/products/api/types";

interface AutomationModeSelectorProps {
  automationMode: AutomationMode;
  setAutomationMode: (mode: AutomationMode) => void;
}

export function AutomationModeSelector({
  automationMode,
  setAutomationMode,
}: AutomationModeSelectorProps) {
  return (
    <div className="bg-light-green rounded-xl p-md border border-outline-variant/40 shadow-sm flex flex-col gap-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-label-caps text-primary font-bold uppercase">
          وضع أتمتة التسعير بالذكاء الاصطناعي
        </h3>
        <span className="text-xs text-on-surface-variant font-medium">
          اختر آلية الأتمتة للمنتج
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {automationModeOptions.map((option) => {
          const isSelected = automationMode === option.mode;
          return (
            <button
              key={option.mode}
              type="button"
              onClick={() => setAutomationMode(option.mode as AutomationMode)}
              className={`flex flex-col gap-2 rounded-xl p-4 text-right transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isSelected
                  ? "bg-[#f7faf4] border-2 border-primary shadow-sm"
                  : "bg-surface-container-lowest border border-outline-variant/40 hover:bg-surface-container-low"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`h-8 w-8 flex items-center justify-center rounded-lg ${
                    isSelected ? "bg-[#98f3b0]" : "bg-surface-container-high"
                  }`}
                >
                  <Icon
                    name={option.icon}
                    className={`h-4 w-4 ${
                      isSelected ? "text-[#0b723c]" : "text-on-surface-variant"
                    }`}
                    fill={isSelected}
                  />
                </div>
                <input
                  type="radio"
                  name="productAutomationMode"
                  checked={isSelected}
                  onChange={() =>
                    setAutomationMode(option.mode as AutomationMode)
                  }
                  className="h-4 w-4 accent-primary cursor-pointer"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">
                  {option.title}
                </p>
                <p className="text-[11px] text-on-surface-variant leading-tight mt-1">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
