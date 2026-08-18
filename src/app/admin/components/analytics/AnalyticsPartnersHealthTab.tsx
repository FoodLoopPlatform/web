"use client";

import React from "react";
import Image from "next/image";
import {
  AnalyticsSummaryTopStore,
  AnalyticsSummaryTopCharity,
} from "../../types/admin.types";
import { StoreIcon, UserIcon } from "@/components/icons";

interface AnalyticsPartnersHealthTabProps {
  topStores: AnalyticsSummaryTopStore[];
  topCharities: AnalyticsSummaryTopCharity[];
  isRtl?: boolean;
}

export function AnalyticsPartnersHealthTab({
  topStores,
  topCharities,
  isRtl = false,
}: AnalyticsPartnersHealthTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Stores */}
        <div className="bg-white rounded-2xl border border-card-border p-6 shadow-xs flex flex-col gap-3">
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
            {topStores.map((store, idx) => (
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
        <div className="bg-white rounded-2xl border border-card-border p-6 shadow-xs flex flex-col gap-3">
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
            {topCharities.map((charity, idx) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
