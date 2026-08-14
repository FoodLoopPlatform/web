"use client";

import React from "react";
import { OrderTab } from "../types/orders.types";
import { ORDER_STATUS_CONFIG } from "../constants/orders-status-config";
import { Icon } from "@/components/ui/icon";
import { ordersDictionary } from "../constants/orders-dictionary";
import { useAppLang } from "@/store/use-app-lang";

interface OrderStatusStepperProps {
  currentStatus: OrderTab;
  onStatusChange?: (newStatus: OrderTab) => void;
}

const STEPPER_STEPS: OrderTab[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "DELIVERED",
];

export function OrderStatusStepper({
  currentStatus,
  onStatusChange,
}: OrderStatusStepperProps) {
  const { lang } = useAppLang();
  const t = ordersDictionary[lang];
  const isRtl = lang === "ar";

  const getStepState = (stepKey: OrderTab) => {
    const currentIndex = ORDER_STATUS_CONFIG[currentStatus]?.stepOrder ?? 0;
    const stepIndex = ORDER_STATUS_CONFIG[stepKey]?.stepOrder ?? 0;

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "upcoming";
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="bg-[#F6F6F0] rounded-2xl p-6 sm:p-8 border border-outline-variant/40 w-full select-none"
    >
      <div className="flex items-center justify-between relative max-w-3xl mx-auto">
        {STEPPER_STEPS.map((stepKey, idx) => {
          const config = ORDER_STATUS_CONFIG[stepKey];
          const state = getStepState(stepKey);
          const isLast = idx === STEPPER_STEPS.length - 1;
          const stepLabel = t.tabs[config.labelKey];

          return (
            <React.Fragment key={stepKey}>
              {/* Step Node */}
              <div
                onClick={() => onStatusChange?.(stepKey)}
                className="flex flex-col items-center gap-2 relative z-10 cursor-pointer group transition-all"
              >
                {/* Node Icon Circle */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all shadow-xs ${
                    state === "completed"
                      ? "bg-emerald-700 text-white"
                      : state === "active"
                        ? "bg-amber-500 text-white ring-4 ring-amber-200/80 scale-105"
                        : "bg-surface-container-high text-outline opacity-60"
                  }`}
                >
                  {state === "completed" ? (
                    <Icon
                      name="check_circle"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill
                    />
                  ) : (
                    <Icon
                      name={config.icon}
                      className="w-5 h-5 sm:w-6 sm:h-6"
                    />
                  )}
                </div>

                {/* Step Title Label */}
                <span
                  className={`text-xs sm:text-sm font-sans font-bold transition-all ${
                    state === "completed"
                      ? "text-emerald-800 font-bold"
                      : state === "active"
                        ? "text-on-surface font-extrabold"
                        : "text-outline opacity-60"
                  }`}
                >
                  {stepLabel}
                </span>
              </div>

              {/* Connecting Line between steps */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 sm:mx-4 bg-outline-variant/50 relative -top-3">
                  <div
                    className={`h-full transition-all duration-300 ${
                      state === "completed" ? "bg-emerald-700 w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
