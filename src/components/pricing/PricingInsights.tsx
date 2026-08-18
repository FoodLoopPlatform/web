import { Icon } from "@/components/ui/icon";
import type { ProductPricingItem } from "@/app/pricing/api/types";

type PricingInsightsProps = {
  products?: ProductPricingItem[];
};

export function PricingInsights({ products = [] }: PricingInsightsProps) {
  const atRiskItemsCount = products.filter((p) => p.cycleUrgent).length;
  const discountedCount = products.filter((p) => p.discountPercent > 0).length;
  const averageDiscount =
    discountedCount > 0
      ? Math.round(
          products.reduce((acc, p) => acc + p.discountPercent, 0) /
            discountedCount,
        )
      : 0;

  const estimatedLiftPercent = Math.min(
    30,
    Math.max(5, Math.round(averageDiscount * 0.5) || 12),
  );

  const forecastBars = [45, 60, 75, 50];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-md pt-6">
      {/* Revenue Forecast */}
      <div className="bg-primary rounded-xl p-6 flex flex-col justify-between min-h-50 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        <div className="flex flex-col gap-2 relative">
          <h4 className="font-sans text-2xl font-semibold text-white">
            توقعات الإيرادات
          </h4>
          <p className="text-body-md text-white/80">
            استنادًا إلى التعديلات الديناميكية الحالية، من المتوقع تحسين
            المبيعات وتصفية المخزون بنسبة <bdi>+{estimatedLiftPercent}%</bdi>{" "}
            هذه الدورة.
          </p>
        </div>
        <div className="flex gap-4 items-end justify-center pt-6 relative">
          {forecastBars.map((fillPercent, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-lg bg-white/20 overflow-hidden"
              style={{ height: `${64 + fillPercent}px` }}
            >
              <div
                className="w-full bg-[#9bf6b3]"
                style={{ height: `${fillPercent}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Health */}
      <div className="bg-[#633d00] rounded-xl p-6 flex flex-col justify-between min-h-50">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-sans text-2xl font-semibold text-[#dfa964]">
              سلامة المخزون
            </h4>
            <Icon name="warning" className="h-4 w-4 text-[#dfa964]" />
          </div>
          <p className="text-body-md text-[#dfa964]">
            {atRiskItemsCount > 0 ? (
              <>
                <bdi>{atRiskItemsCount}</bdi> عناصر تقترب من نهاية مدة صلاحيتها.
                يُنصح بتطبيق الخصومات الديناميكية لتسريع تصفيتها.
              </>
            ) : (
              "جميع عناصر المخزون الحالية ضمن فترات صلاحية آمنة ومستقرة."
            )}
          </p>
        </div>
        <div className="text-xs text-[#dfa964]/80 mt-2">
          إجمالي العناصر النشطة: {products.length} منتج
        </div>
      </div>
    </section>
  );
}
