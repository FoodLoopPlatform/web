import React from "react";
import Image from "next/image";
import {
  AnalyticsSummary,
  AnalyticsSummaryTopStore,
  AnalyticsSummaryTopCharity,
} from "../../types/admin.types";
import { StoreIcon, UserIcon } from "@/components/icons";

interface AnalyticsPartnersHealthTabProps {
  topStores: AnalyticsSummaryTopStore[];
  topCharities: AnalyticsSummaryTopCharity[];
  systemAudit: NonNullable<AnalyticsSummary["systemAudit"]>;
  isRtl: boolean;
}

export function AnalyticsPartnersHealthTab({
  topStores,
  topCharities,
  systemAudit,
  isRtl,
}: AnalyticsPartnersHealthTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Stores */}
        <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div className="flex items-center gap-2">
              <StoreIcon className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-extrabold text-primary font-sans">
                {isRtl ? "أبرز المتاجر المساهمة" : "Top Partner Stores"}
              </h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {topStores.length} {isRtl ? "متاجر" : "Stores"}
            </span>
          </div>

          <div className="divide-y divide-surface-container">
            {topStores.map((store: AnalyticsSummaryTopStore, idx: number) => (
              <div
                key={store.storeId}
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-4 text-center text-xs font-bold text-outline">
                    #{idx + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-surface border border-card-border overflow-hidden relative shrink-0 flex items-center justify-center">
                    {store.logoUrl ? (
                      <Image
                        src={store.logoUrl}
                        alt={store.storeName}
                        width={32}
                        height={32}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-primary">
                        {store.storeName.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-on-surface truncate">
                      {store.storeName}
                    </span>
                    <span className="text-[10px] text-outline">
                      {store.rescuedBagsCount}{" "}
                      {isRtl ? "حقائب إنقاذ" : "bags rescued"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 text-right">
                  <span className="font-extrabold text-emerald-800 text-xs">
                    {store.foodSavedKg} {isRtl ? "كجم" : "kg"}
                  </span>
                  <span className="text-[10px] text-blue-700 font-bold">
                    {store.totalSalesValue} {isRtl ? "ج.م" : "EGP"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Charities */}
        <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-extrabold text-primary font-sans">
                {isRtl ? "أبرز الجمعيات المستفيدة" : "Top Recipient Charities"}
              </h4>
            </div>
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              {topCharities.length} {isRtl ? "جمعيات" : "Charities"}
            </span>
          </div>

          <div className="divide-y divide-surface-container">
            {topCharities.map(
              (charity: AnalyticsSummaryTopCharity, idx: number) => (
                <div
                  key={charity.charityId}
                  className="py-2.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-4 text-center text-xs font-bold text-outline">
                      #{idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-surface border border-card-border overflow-hidden relative shrink-0 flex items-center justify-center">
                      {charity.logoUrl ? (
                        <Image
                          src={charity.logoUrl}
                          alt={charity.charityName}
                          width={32}
                          height={32}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-primary">
                          {charity.charityName.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-on-surface truncate">
                        {charity.charityName}
                      </span>
                      <span className="text-[10px] text-outline">
                        {charity.supportBoxesCount}{" "}
                        {isRtl ? "صندوق دعم" : "boxes"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 text-right">
                    <span className="font-extrabold text-teal-800 text-xs">
                      {charity.donatedFoodKg} {isRtl ? "كجم" : "kg"}
                    </span>
                    <span className="text-[10px] text-outline font-bold">
                      {charity.totalDonationsCount}{" "}
                      {isRtl ? "تبرعات" : "donations"}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* System Audit & Observability */}
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <h3 className="text-sm font-extrabold text-primary font-sans">
              {isRtl ? "مراقبة صحة وأداء النظام" : "System Observability"}
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live</span>
            </span>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-card-border">
              <span className="font-bold text-outline">
                {isRtl ? "الجلسات النشطة الآن" : "Active Sessions"}
              </span>
              <span className="font-extrabold text-on-surface text-xs">
                {systemAudit.activeSessionsCount}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100">
              <span className="font-bold text-blue-900">
                {isRtl ? "قرارات الذكاء الاصطناعي (24س)" : "AI Decisions (24h)"}
              </span>
              <span className="font-extrabold text-blue-950 text-xs">
                {systemAudit.aiDecisions24hCount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100">
              <span className="font-bold text-amber-900">
                {isRtl ? "البلاغات المسجلة" : "Reported Incidents"}
              </span>
              <span className="font-extrabold text-amber-950 text-xs">
                {systemAudit.reportedIncidentsCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col gap-0.5 text-center mt-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                {isRtl ? "حالة النظام التشغيلية" : "System Health"}
              </span>
              <span className="text-xs font-extrabold text-emerald-950 font-sans">
                {systemAudit.systemHealth}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
