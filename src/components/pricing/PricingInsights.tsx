import { Icon } from "@/components/ui/icon";
import {
  atRiskItemsCount,
  revenueForecastBars,
  revenueForecastLiftPercent,
} from "@/app/pricing/lib/mock-data";

export function PricingInsights() {
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
            استنادًا إلى التعديلات الديناميكية الحالية، من المتوقع ارتفاع
            الإيرادات بنسبة <bdi>+{revenueForecastLiftPercent}%</bdi> هذه
            الدورة.
          </p>
        </div>
        <div className="flex gap-4 items-end justify-center pt-6 relative">
          {revenueForecastBars.map((fillPercent, index) => (
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
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h4 className="font-sans text-2xl font-semibold text-[#dfa964]">
              سلامة المخزون
            </h4>
            <Icon name="warning" className="h-4 w-4 text-[#dfa964]" />
          </div>
          <p className="text-body-md text-[#dfa964]">
            <bdi>{atRiskItemsCount}</bdi> عناصر تقترب من نهاية مدة صلاحيتها. قام
            الوضع التلقائي بزيادة خصوماتها لتصفية المخزون.
          </p>
        </div>
        <button
          type="button"
          className="bg-[#ffddb7] text-[#2a1700] font-bold text-body-md px-6 py-4 rounded-xl self-start cursor-pointer hover:opacity-90 transition-opacity"
        >
          عرض العناصر المعرّضة للخطر
        </button>
      </div>
    </section>
  );
}
