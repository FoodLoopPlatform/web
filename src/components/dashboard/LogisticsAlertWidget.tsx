"use client";

import { Icon } from "@/components/ui/icon";

export function LogisticsAlertWidget() {
  return (
    <div className="bg-[#ffddb7] rounded-xl p-md flex items-center gap-md border border-[#ffb95e]">
      <Icon name="cloudy_snowing" className="h-10 w-10 text-[#633d00]" />
      <div>
        <p className="text-xs font-bold text-[#633d00] uppercase tracking-tight">
          تنبيه أحوال الطقس واللوجستيات
        </p>
        <p className="text-sm text-[#653e00] font-sans mt-1">
          من المتوقع قلة حركة الزبائن يوم الثلاثاء بسبب الحرارة. فكر في تقديم
          خصومات مبكرة لتقليل الهدر.
        </p>
      </div>
    </div>
  );
}
