"use client";

import React, { useState } from "react";
import { AdminDictionary } from "../../constants/dictionary";
import { GlobalAutomationDefaults } from "../../types/admin.types";
import { ConfirmationModal } from "../../components";
import { SlidersIcon, ShieldCheckIcon } from "@/components/icons";

interface AutomationDefaultsSectionProps {
  defaults: GlobalAutomationDefaults;
  t: AdminDictionary;
  isRtl?: boolean;
  onSave: (updated: GlobalAutomationDefaults) => void;
}

export const AutomationDefaultsSection: React.FC<
  AutomationDefaultsSectionProps
> = ({ defaults, t, isRtl = false, onSave }) => {
  const [formData, setFormData] = useState<GlobalAutomationDefaults>({
    ...defaults,
  });
  const [commissionRate, setCommissionRate] = useState("10");
  const [rateLimit, setRateLimit] = useState("120");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleMaxDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setFormData((prev) => ({ ...prev, maxDiscountPerCycle: 1 }));
      return;
    }
    // Hard clamp to 1-15%
    const clamped = Math.min(15, Math.max(1, val));
    setFormData((prev) => ({ ...prev, maxDiscountPerCycle: clamped }));
  };

  const handleToggle = (field: "autoVerifyStores" | "bulkUploads") => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    onSave(formData);
    setIsConfirmOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Platform Automation Limits Card */}
      <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-6">
        <div
          className={`flex items-center gap-3 ${isRtl ? "text-right" : "text-left"}`}
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <SlidersIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-primary font-sans">
              {t.systemFeatures}
            </h3>
            <p className="text-xs text-outline font-medium">
              {t.systemFeaturesSub}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Max Discount Per Cycle (Hard-Clamped 1-15%) */}
          <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-outline-variant/40">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface">
                {t.maxDiscountLabel}
              </label>
              <span className="text-xs font-extrabold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                {formData.maxDiscountPerCycle}%
              </span>
            </div>
            <p className="text-[11px] text-outline leading-relaxed">
              {t.maxDiscountSub}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min={1}
                max={15}
                value={formData.maxDiscountPerCycle}
                onChange={handleMaxDiscountChange}
                className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min={1}
                max={15}
                value={formData.maxDiscountPerCycle}
                onChange={handleMaxDiscountChange}
                className="w-20 p-2 text-center text-xs font-bold rounded-lg border border-outline-variant bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Price Floor & Signup Default Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-outline-variant/40">
              <label className="text-xs font-bold text-on-surface">
                {t.priceFloorLabel}
              </label>
              <p className="text-[11px] text-outline">{t.priceFloorSub}</p>
              <select
                value={formData.defaultPriceFloorPolicy}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    defaultPriceFloorPolicy: e.target
                      .value as GlobalAutomationDefaults["defaultPriceFloorPolicy"],
                  }))
                }
                className="mt-2 w-full p-2.5 rounded-lg border border-outline-variant bg-white text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="DYNAMIC_AI">
                  {isRtl
                    ? "ذكاء اصطناعي ديناميكي (موصى به)"
                    : "Dynamic AI (Recommended)"}
                </option>
                <option value="FIXED_30">
                  {isRtl
                    ? "حد أدنى ثابت ٣٠٪ من السعر الأصلي"
                    : "Fixed 30% of Original Price"}
                </option>
                <option value="FIXED_50">
                  {isRtl
                    ? "حد أدنى ثابت ٥٠٪ من السعر الأصلي"
                    : "Fixed 50% of Original Price"}
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-outline-variant/40">
              <label className="text-xs font-bold text-on-surface">
                {t.defaultModeLabel}
              </label>
              <p className="text-[11px] text-outline">{t.defaultModeSub}</p>
              <select
                value={formData.newBusinessDefaultMode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newBusinessDefaultMode: e.target
                      .value as GlobalAutomationDefaults["newBusinessDefaultMode"],
                  }))
                }
                className="mt-2 w-full p-2.5 rounded-lg border border-outline-variant bg-white text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="Manual">
                  {isRtl ? "نمط يدوّي (Manual Mode)" : "Manual Mode"}
                </option>
                <option value="Assisted">
                  {isRtl ? "نمط مُساعد (Assisted Mode)" : "Assisted Mode"}
                </option>
                <option value="Autonomous">
                  {isRtl
                    ? "نمط تلقائي كامل (Autonomous Mode)"
                    : "Autonomous Mode"}
                </option>
              </select>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="divide-y divide-surface-container border border-card-border rounded-xl px-4">
            <div className="py-3.5 flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-on-surface">
                  {t.autoVerifyLabel}
                </span>
                <span className="text-[10px] text-outline">
                  {t.autoVerifySub}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("autoVerifyStores")}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                  formData.autoVerifyStores
                    ? "bg-primary"
                    : "bg-surface-container"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    formData.autoVerifyStores
                      ? isRtl
                        ? "right-1"
                        : "left-6"
                      : isRtl
                        ? "right-6"
                        : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="py-3.5 flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-on-surface">
                  {t.bulkLabel}
                </span>
                <span className="text-[10px] text-outline">{t.bulkSub}</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("bulkUploads")}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                  formData.bulkUploads ? "bg-primary" : "bg-surface-container"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    formData.bulkUploads
                      ? isRtl
                        ? "right-1"
                        : "left-6"
                      : isRtl
                        ? "right-6"
                        : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Operational Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-on-surface-variant mb-1.5 text-xs font-bold uppercase tracking-wider">
                {t.commissionLabel}
              </label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-xs font-bold bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant mb-1.5 text-xs font-bold uppercase tracking-wider">
                {t.rateLimitLabel}
              </label>
              <input
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-xs font-bold bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-on-primary rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <ShieldCheckIcon className="w-4 h-4" />
              <span>{t.saveBtn}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        title={t.confirmSaveGlobalTitle}
        message={t.confirmSaveGlobalMsg}
        confirmLabel={t.saveBtn}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="warning"
        isRtl={isRtl}
        onConfirm={handleConfirmSave}
        onClose={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};
