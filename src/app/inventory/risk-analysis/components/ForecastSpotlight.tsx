import { SparklesIcon } from "@/components/icons";

interface ForecastSpotlightProps {
  categoryName: string;
  affectedCount: number;
  onFocusCategory: () => void;
}

export function ForecastSpotlight({
  categoryName,
  affectedCount,
  onFocusCategory,
}: ForecastSpotlightProps) {
  return (
    <div className="bg-primary/10 border-2 border-dashed border-primary/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row-reverse gap-6 items-start w-full">
      <div className="bg-primary text-white rounded-xl p-4 shadow-elevation-3 shrink-0">
        <SparklesIcon className="h-6 w-6" />
      </div>

      <div className="flex-1 flex flex-col gap-2 items-start sm:items-end text-right w-full">
        <h3 className="text-sm text-primary">تسليط الضوء على التوقعات</h3>
        <p className="text-on-surface leading-relaxed">
          يرصد التحليل {affectedCount} عنصرًا من فئة &quot;{categoryName}&quot;
          معرضًا لمخاطر عالية خلال الأيام القادمة. نوصي بمراجعة الأسعار أو تفعيل
          خصومات سريعة على هذه الفئة قبل انتهاء الصلاحية.
        </p>
        <button
          type="button"
          onClick={onFocusCategory}
          className="mt-2 bg-primary text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 cursor-pointer"
        >
          <SparklesIcon className="h-4 w-4" />
          عرض عناصر هذه الفئة
        </button>
      </div>
    </div>
  );
}
