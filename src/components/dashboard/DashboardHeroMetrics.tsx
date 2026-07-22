"use client";

import { Icon } from "@/components/ui/icon";

export function DashboardHeroMetrics() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
      {/* Potential Waste Saved */}
      <div className="bg-[#f2f5ee] p-md rounded-xl border border-[#bfc9be] hover:shadow-md transition-all group flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start mb-xs">
          <span className="bg-[#98f3b0] p-2 rounded-lg flex items-center justify-center">
            <Icon name="eco" className="h-6 w-6 text-[#006d38]" fill={true} />
          </span>
          <span className="text-[#006d38] font-data-mono text-data-mono font-bold">
            +12.4%
          </span>
        </div>
        <div>
          <p className="text-label-md text-[#404941] mb-1">
            النفايات التي تم إنقاذها
          </p>
          <h2 className="font-headline-md text-headline-md text-[#00381a] font-bold">
            1,284 كجم
          </h2>
        </div>
      </div>

      {/* Revenue Recovered */}
      <div className="bg-[#f2f5ee] p-md rounded-xl border border-[#bfc9be] hover:shadow-md transition-all group flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start mb-xs">
          <span className="bg-[#ffddb7] p-2 rounded-lg flex items-center justify-center">
            <Icon
              name="payments"
              className="h-6 w-6 text-[#452900]"
              fill={true}
            />
          </span>
          <span className="text-[#633d00] font-data-mono text-data-mono font-bold">
            +8.2%
          </span>
        </div>
        <div>
          <p className="text-label-md text-[#404941] mb-1">
            الإيرادات المستردة
          </p>
          <h2 className="font-headline-md text-headline-md text-[#00381a] font-bold">
            4,592.00 ج.م
          </h2>
        </div>
      </div>

      {/* Community Impact */}
      <div className="bg-[#f2f5ee] p-md rounded-xl border border-[#bfc9be] hover:shadow-md transition-all group flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start mb-xs">
          <span className="bg-[#abf3bc] p-2 rounded-lg flex items-center justify-center">
            <Icon
              name="volunteer_activism"
              className="h-6 w-6 text-[#00381a]"
              fill={true}
            />
          </span>
          <span className="text-[#00381a] font-data-mono text-data-mono font-bold">
            420 صفقة
          </span>
        </div>
        <div>
          <p className="text-label-md text-[#404941] mb-1">
            الأثر المجتمعي للمتجر
          </p>
          <h2 className="font-headline-md text-headline-md text-[#00381a] font-bold">
            2.4 ألف وجبة
          </h2>
        </div>
      </div>
    </section>
  );
}
