import { Icon } from "@/components/ui/icon";
import type {
  ProductPriceHistoryData,
  PriceHistoryEntry,
} from "@/app/pricing/api/types";

function formatEGP(value: number) {
  return `${value.toFixed(2)} EGP`;
}

function formatDateAr(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

type PriceHistoryTimelineProps = {
  historyData: ProductPriceHistoryData | null;
  isLoadingHistory: boolean;
  historyError: string | null;
  onRetry: () => void;
};

export function PriceHistoryTimeline({
  historyData,
  isLoadingHistory,
  historyError,
  onRetry,
}: PriceHistoryTimelineProps) {
  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div className="flex items-center gap-2.5">
          <Icon name="timeline" className="h-5 w-5 text-primary" />
          <h3 className="font-sans text-xl font-bold text-primary">
            تسلسل التعديلات الزمنية للأسعار
          </h3>
        </div>
        <span className="text-xs text-on-surface-variant">
          مرتبة من الأحدث إلى الأقدم
        </span>
      </div>

      {isLoadingHistory ? (
        <div className="flex flex-col gap-4 py-8 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-light-green/50 p-4 rounded-xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-outline-variant/30 rounded-full" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-48 bg-outline-variant/30 rounded" />
                  <div className="h-3 w-32 bg-outline-variant/20 rounded" />
                </div>
              </div>
              <div className="h-6 w-24 bg-outline-variant/30 rounded" />
            </div>
          ))}
        </div>
      ) : historyError ? (
        <div className="p-6 bg-error-container/40 rounded-xl text-center flex flex-col items-center gap-3">
          <Icon
            name="error_outline"
            className="h-8 w-8 text-on-error-container"
          />
          <p className="text-body-md font-bold text-on-error-container">
            {historyError}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="text-xs font-bold bg-primary text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : !historyData || historyData.history.length === 0 ? (
        <div className="text-center py-16 px-4 flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-light-green flex items-center justify-center text-primary">
            <Icon name="history_toggle_off" className="h-7 w-7" />
          </div>
          <p className="text-body-lg font-bold text-on-surface">
            لا يوجد سجل تعديلات سابقة لهذا المنتج
          </p>
          <p className="text-body-md text-on-surface-variant max-w-[550px]">
            يتم تسجيل التعديلات تلقائيًا عند تغيير السعر يدويًا أو عبر محرك
            التسعير الذكي.
          </p>
        </div>
      ) : (
        <div className="relative flex flex-col gap-6 pr-4 sm:pr-6">
          {/* Vertical connecting line */}
          <div className="absolute right-7 sm:right-9 top-4 bottom-4 w-0.5 bg-outline-variant/30" />

          {historyData.history.map((entry: PriceHistoryEntry, idx: number) => {
            const isLatest = idx === 0;
            const priceDiff = entry.newPrice - entry.oldPrice;
            const isReduction = priceDiff < 0;

            return (
              <div
                key={entry.id || idx}
                className="relative flex items-start gap-4 z-10"
              >
                {/* Timeline Node Badge */}
                <div
                  className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold shadow-xs ${
                    isLatest
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-white border-2 border-outline-variant text-on-surface-variant"
                  }`}
                >
                  {historyData.history.length - idx}
                </div>

                {/* Entry Card */}
                <div
                  className={`flex-1 rounded-xl p-4 sm:p-5 border transition-all ${
                    isLatest
                      ? "bg-[#f4f9f2] border-primary/40 shadow-xs"
                      : "bg-white border-outline-variant/30 hover:border-outline-variant"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-on-surface-variant">
                        {formatDateAr(entry.changedAt)}
                      </span>
                      {isLatest && (
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          السعر الأحدث
                        </span>
                      )}
                      <span className="bg-surface-container-high text-on-surface-variant text-[11px] px-2 py-0.5 rounded">
                        بواسطة: {entry.appliedBy || "الذكاء الاصطناعي"}
                      </span>
                    </div>

                    {/* Price Transition */}
                    <div className="flex items-center gap-2">
                      <span className="font-data-mono text-xs text-on-surface-variant/70 line-through">
                        <bdi>{formatEGP(entry.oldPrice)}</bdi>
                      </span>
                      <Icon
                        name="arrow_back"
                        className="h-3.5 w-3.5 text-on-surface-variant shrink-0"
                      />
                      <span className="font-data-mono text-base font-bold text-primary">
                        <bdi>{formatEGP(entry.newPrice)}</bdi>
                      </span>
                      {entry.discountPercent > 0 && (
                        <span className="bg-[#ffddb7] text-[#653e00] text-xs font-bold px-2 py-0.5 rounded">
                          <bdi>-{entry.discountPercent}%</bdi>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reason Description */}
                  <div className="mt-3 flex items-start gap-2 text-sm text-on-surface-variant bg-white/80 p-3 rounded-lg border border-outline-variant/15">
                    <Icon
                      name="info"
                      className="h-4 w-4 text-primary shrink-0 mt-0.5"
                    />
                    <p className="leading-relaxed">{entry.changeReason}</p>
                  </div>

                  {/* Delta summary */}
                  <div className="mt-2.5 flex items-center justify-between text-xs text-on-surface-variant">
                    <span>
                      فرق السعر:{" "}
                      <bdi
                        className={`font-mono font-bold ${
                          isReduction ? "text-[#0b723c]" : "text-on-surface"
                        }`}
                      >
                        {isReduction
                          ? `وفر ${Math.abs(priceDiff).toFixed(2)} EGP`
                          : priceDiff === 0
                            ? "بدون تغيير"
                            : `+${priceDiff.toFixed(2)} EGP`}
                      </bdi>
                    </span>

                    {entry.automationMode && (
                      <span className="text-[11px] text-on-surface-variant">
                        وضع الأتمتة:{" "}
                        <strong className="text-primary">
                          {entry.automationMode === "Autonomous"
                            ? "تلقائي بالكامل"
                            : entry.automationMode === "Assisted"
                              ? "بمساعدة"
                              : "يدوي"}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
