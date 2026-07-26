import { Icon } from "@/components/ui/icon";

export function LogisticsAlertWidget() {
  return (
    <div className="bg-tertiary-fixed rounded-xl p-md flex items-center gap-md border border-tertiary-container">
      <Icon
        name="cloudy_snowing"
        className="h-10 w-10 text-on-tertiary-fixed-variant"
      />
      <div>
        <p className="text-xs font-bold text-on-tertiary-fixed-variant uppercase tracking-tight">
          تنبيه أحوال الطقس واللوجستيات
        </p>
        <p className="text-sm text-on-tertiary-fixed-variant font-sans mt-1">
          من المتوقع قلة حركة الزبائن يوم الثلاثاء بسبب الحرارة. فكر في تقديم
          خصومات مبكرة لتقليل الهدر.
        </p>
      </div>
    </div>
  );
}
