import { AlertCircleIcon } from "@/components/icons";
import { formatCurrency } from "../lib/risk-analysis";

interface ValueAtRiskWidgetProps {
  totalValueAtRisk: number;
  criticalCount: number;
  percentOfInventory: number;
}

export function ValueAtRiskWidget({
  totalValueAtRisk,
  criticalCount,
  percentOfInventory,
}: ValueAtRiskWidgetProps) {
  return (
    <div className="backdrop-blur-sm bg-white/70 border border-card-border rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
      <div className="flex flex-col gap-1 sm:text-right">
        <div className="flex items-center gap-2">
          <AlertCircleIcon className="h-5 w-5 text-error shrink-0" />
          <h3 className="text-xl sm:text-2xl font-semibold text-primary">
            القيمة المعرضة لخطر الهدر
          </h3>
        </div>
        <p className="text-sm text-on-surface-variant">
          موزعة على {criticalCount} عنصرًا يحتاج إجراءً خلال الأيام القادمة
        </p>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-3xl sm:text-4xl font-bold text-primary font-brand">
          {formatCurrency(totalValueAtRisk)}
        </span>
        <span className="text-sm font-medium text-link">
          {percentOfInventory}% من قيمة المخزون الحالي
        </span>
      </div>
    </div>
  );
}
