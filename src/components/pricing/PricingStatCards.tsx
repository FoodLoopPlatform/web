"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { pricingStats as defaultStats } from "@/app/pricing/lib/mock-data";
import type {
  PricingStatsData,
  AiRecommendationsSchedule,
} from "@/app/pricing/api/types";
import { formatScheduleCountdown } from "@/app/pricing/api/pricing-api";

type PricingStatCardsProps = {
  stats?: PricingStatsData;
  schedule?: AiRecommendationsSchedule | null;
  isLoading?: boolean;
};

export function PricingStatCards({
  stats = defaultStats,
  schedule,
  isLoading = false,
}: PricingStatCardsProps) {
  const isRunning = Boolean(schedule?.isPricingBatchRunning);
  const nextBatchAt = schedule?.nextPricingBatchAt;

  const [, setTick] = useState(0);

  useEffect(() => {
    if (!nextBatchAt || isRunning) return;
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [nextBatchAt, isRunning]);

  const scheduleCountdown = nextBatchAt
    ? formatScheduleCountdown(nextBatchAt)
    : null;

  const liveCountdown = isRunning
    ? "جارٍ التشغيل..."
    : scheduleCountdown
      ? scheduleCountdown.label
      : stats.nextCycleCountdownLabel;

  const liveProgress = isRunning
    ? 100
    : scheduleCountdown
      ? scheduleCountdown.progressPercent
      : stats.nextCycleProgressPercent;

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="bg-light-green border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between min-h-40 animate-pulse text-right"
          >
            <div className="flex items-start justify-between">
              <div className="h-4 w-32 bg-outline-variant/30 rounded" />
              <div className="h-5 w-5 bg-outline-variant/30 rounded-full" />
            </div>
            <div className="flex flex-col gap-2 pt-6 items-start">
              <div className="h-10 w-24 bg-outline-variant/40 rounded" />
              <div className="h-4 w-40 bg-outline-variant/20 rounded" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
      {/* Products in Active Pricing */}
      <div className="bg-light-green border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between min-h-40 text-right">
        <div className="flex items-start justify-between">
          <span className="text-sm tracking-widest text-on-surface-variant text-right">
            المنتجات ضمن التسعير النشط
          </span>
          <Icon
            name="inventory_2"
            className="h-5 w-5 text-on-surface-variant"
          />
        </div>
        <div className="flex flex-col gap-2.5 pt-6 text-right items-start">
          <p className="font-sans text-5xl font-bold text-primary leading-none text-right">
            <bdi>{stats.activeListingsCount}</bdi>
          </p>
          <p className="text-sm text-link text-right">
            <bdi>+{stats.activeListingsDelta}</bdi> منذ الأسبوع الماضي
          </p>
        </div>
      </div>

      {/* Average Discount Applied */}
      <div className="bg-light-green border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between min-h-40 relative overflow-hidden text-right">
        <div className="absolute -bottom-2 -left-2 h-24 w-24 rounded-full bg-primary/5 blur-xl" />
        <div className="flex items-start justify-between relative">
          <span className="text-sm tracking-widest text-on-surface-variant text-right">
            متوسط الخصم المطبق
          </span>
          <Icon
            name="trending_down"
            className="h-4 w-5 text-on-surface-variant"
          />
        </div>
        <div className="flex items-end justify-between pt-6 relative">
          <div className="flex flex-col gap-2.5 text-right items-start">
            <p className="font-sans text-5xl font-bold text-primary leading-none text-right">
              <bdi>{stats.averageDiscountPercent}%</bdi>
            </p>
            <p className="text-sm text-on-surface-variant text-right">
              مُحسّن لتصفية المخزون
            </p>
          </div>
          <svg
            viewBox="0 0 92 48"
            className="h-12 w-23 text-link shrink-0"
            fill="none"
            aria-hidden="true"
          >
            <polyline
              points="0,32 16,36 32,20 48,28 64,10 80,16 92,4"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Next Cycle Countdown */}
      <div className="bg-light-green border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between min-h-40 text-right">
        <div className="flex items-start justify-between">
          <span className="text-sm tracking-widest text-on-surface-variant text-right">
            دورة الذكاء الاصطناعي القادمة
          </span>
          <Icon name="schedule" className="h-5 w-5 text-on-surface-variant" />
        </div>
        <div className="flex flex-col gap-3 pt-4 text-right items-start w-full">
          <div className="flex items-baseline gap-2">
            <p className="font-data-mono text-[36px] sm:text-[40px] tracking-tighter text-primary leading-normal text-right">
              <bdi>{liveCountdown}</bdi>
            </p>
            {schedule?.isPricingBatchRunning && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                نشط الآن
              </span>
            )}
          </div>
          <div className="h-1.5 w-full rounded-full bg-outline-variant/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#f5bc76] transition-all duration-1000"
              style={{ width: `${liveProgress}%` }}
            />
          </div>
          <span className="text-xs text-on-surface-variant">
            {schedule?.pricingIntervalMinutes
              ? `يتم فحص وتحديث الأسعار تلقائيًا كل ${schedule.pricingIntervalMinutes} دقيقة`
              : "فحص دوري لمخزون المنتجات وسرعة البيع"}
          </span>
        </div>
      </div>
    </section>
  );
}
