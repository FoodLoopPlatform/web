"use client";

import React, { useState } from "react";
import { AdminDictionary } from "../../constants/dictionary";
import { AiObservabilitySettings } from "../../types/admin.types";
import { SlidersIcon, BarChartIcon } from "@/components/icons";

interface AiObservabilitySectionProps {
  observabilitySettings: AiObservabilitySettings;
  t: AdminDictionary;
  isRtl?: boolean;
  onSave: (settings: AiObservabilitySettings) => void;
}

export const AiObservabilitySection: React.FC<AiObservabilitySectionProps> = ({
  observabilitySettings,
  t,
  isRtl = false,
  onSave,
}) => {
  const [formData, setFormData] = useState<AiObservabilitySettings>({
    ...observabilitySettings,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isHealthy = formData.sentryStatus === "Healthy";

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-6">
        {/* Header */}
        <div
          className={`flex items-center gap-3 ${isRtl ? "text-right" : "text-left"}`}
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <SlidersIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-primary font-brand">
              {t.tabAiObservability}
            </h3>
            <p className="text-xs text-outline font-medium">
              {isRtl
                ? "ضبط إعدادات التخزين المؤقت وتجميع طلبات الذكاء الاصطناعي والتكامل مع Sentry لتقليل التكلفة ومتابعة الأداء"
                : "Configure LLM prompt caching TTL, batching windows, and Sentry observability alert thresholds"}
            </p>
          </div>
        </div>

        {/* Integration Status Badge */}
        <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/40">
          <div className="flex items-center gap-3">
            <BarChartIcon className="w-5 h-5 text-primary" />
            <div>
              <span className="text-xs font-bold text-on-surface">
                {t.sentryStatusLabel}
              </span>
              <p className="text-[11px] text-outline">
                {isRtl
                  ? "مراقبة الأداء، الأخطاء، وزمن استجابة النموذج (LLM Latency)"
                  : "Live tracking for latency, error rate spikes, and API call health"}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
              isHealthy
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>{formData.sentryStatus}</span>
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* AI Cost Optimization: Prompt Cache TTL */}
          <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-outline-variant/40">
            <label className="text-xs font-bold text-on-surface">
              {t.promptCacheLabel}
            </label>
            <p className="text-[11px] text-outline">{t.promptCacheSub}</p>
            <input
              type="number"
              min={5}
              max={1440}
              value={formData.promptCacheTtlMinutes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  promptCacheTtlMinutes: parseInt(e.target.value, 10) || 60,
                }))
              }
              className="mt-2 w-full p-2.5 rounded-lg border border-outline-variant bg-white text-xs font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* AI Cost Optimization: Request Batching Window */}
          <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-outline-variant/40">
            <label className="text-xs font-bold text-on-surface">
              {t.batchingWindowLabel}
            </label>
            <p className="text-[11px] text-outline">{t.batchingWindowSub}</p>
            <input
              type="number"
              min={50}
              max={5000}
              step={50}
              value={formData.requestBatchingWindowMs}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  requestBatchingWindowMs: parseInt(e.target.value, 10) || 250,
                }))
              }
              className="mt-2 w-full p-2.5 rounded-lg border border-outline-variant bg-white text-xs font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Observability: Latency Threshold */}
          <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-outline-variant/40">
            <label className="text-xs font-bold text-on-surface">
              {t.sentryLatencyLabel}
            </label>
            <input
              type="number"
              min={200}
              max={10000}
              step={100}
              value={formData.sentryAlertThresholdLatencyMs}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sentryAlertThresholdLatencyMs:
                    parseInt(e.target.value, 10) || 1200,
                }))
              }
              className="mt-2 w-full p-2.5 rounded-lg border border-outline-variant bg-white text-xs font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Observability: Error Rate Threshold */}
          <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-outline-variant/40">
            <label className="text-xs font-bold text-on-surface">
              {t.sentryErrorRateLabel}
            </label>
            <input
              type="number"
              min={0.1}
              max={20}
              step={0.1}
              value={formData.sentryErrorRateThresholdPercent}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sentryErrorRateThresholdPercent:
                    parseFloat(e.target.value) || 2.5,
                }))
              }
              className="mt-2 w-full p-2.5 rounded-lg border border-outline-variant bg-white text-xs font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Monthly API Cost Cap */}
          <div className="md:col-span-2 flex flex-col gap-2 p-4 bg-surface rounded-xl border border-outline-variant/40">
            <label className="text-xs font-bold text-on-surface">
              {t.apiCostCapLabel}
            </label>
            <input
              type="number"
              min={1000}
              max={500000}
              step={1000}
              value={formData.monthlyApiCostCapEgp}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  monthlyApiCostCapEgp: parseInt(e.target.value, 10) || 15000,
                }))
              }
              className="mt-1 w-full p-2.5 rounded-lg border border-outline-variant bg-white text-xs font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-2 flex justify-end pt-2 border-t border-surface-container">
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {t.saveBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
