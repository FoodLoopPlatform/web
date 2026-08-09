import { Icon } from "@/components/ui/icon";
import { pricingStats } from "@/app/pricing/lib/mock-data";

export function PricingStatCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
      {/* Products in Active Pricing */}
      <div className="bg-light-green border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between min-h-40">
        <div className="flex items-start justify-between">
          <span className="text-sm tracking-widest text-on-surface-variant">
            المنتجات ضمن التسعير النشط
          </span>
          <Icon
            name="inventory_2"
            className="h-5 w-5 text-on-surface-variant"
          />
        </div>
        <div className="flex flex-col gap-2.5 pt-6">
          <p className="font-sans text-5xl font-bold text-primary leading-none">
            {pricingStats.activeListingsCount}
          </p>
          <p className="text-sm text-link">
            <bdi>+{pricingStats.activeListingsDelta}</bdi> منذ الأسبوع الماضي
          </p>
        </div>
      </div>

      {/* Average Discount Applied */}
      <div className="bg-light-green border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between min-h-40 relative overflow-hidden">
        <div className="absolute -bottom-2 -left-2 h-24 w-24 rounded-full bg-primary/5 blur-xl" />
        <div className="flex items-start justify-between relative">
          <span className="text-sm tracking-widest text-on-surface-variant">
            متوسط الخصم المطبق
          </span>
          <Icon
            name="trending_down"
            className="h-4 w-5 text-on-surface-variant"
          />
        </div>
        <div className="flex items-end justify-between pt-6 relative">
          <div className="flex flex-col gap-2.5">
            <p className="font-sans text-5xl font-bold text-primary leading-none">
              {pricingStats.averageDiscountPercent}%
            </p>
            <p className="text-sm text-on-surface-variant">
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
      <div className="bg-light-green border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between min-h-40">
        <div className="flex items-start justify-between">
          <span className="text-sm tracking-widest text-on-surface-variant">
            العد التنازلي للدورة القادمة
          </span>
          <Icon name="schedule" className="h-5 w-5 text-on-surface-variant" />
        </div>
        <div className="flex flex-col gap-4 pt-6">
          <p
            dir="ltr"
            className="font-data-mono text-[42px] tracking-tighter text-primary leading-normal text-right"
          >
            {pricingStats.nextCycleCountdownLabel}
          </p>
          <div className="h-1 w-full rounded-full bg-outline-variant/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#f5bc76]"
              style={{ width: `${pricingStats.nextCycleProgressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
