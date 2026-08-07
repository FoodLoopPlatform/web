import { AlertCircleIcon, BarChartIcon } from "@/components/icons";

interface RiskAnalysisHeaderProps {
  avgDemandScore: number;
  criticalCount: number;
}

export function RiskAnalysisHeader({
  avgDemandScore,
  criticalCount,
}: RiskAnalysisHeaderProps) {
  return (
    <div className="flex flex-col-reverse lg:flex-row lg:items-start justify-between gap-md w-full">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <BarChartIcon className="h-4 w-4" />
          {avgDemandScore}% متوسط الطلب
        </span>
        <span className="bg-error-container text-on-error-container px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <AlertCircleIcon className="h-4 w-4" />
          {criticalCount} عنصر حرج
        </span>
      </div>

      <div className="flex flex-col gap-2 max-w-2xl lg:text-right">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          تحليل وتوقعات مخاطر المخزون
        </h1>
        <p className="text-on-surface-variant text-body-md">
          تحليل ذكي للمواد القابلة للتلف ودوران المخزون. اتخاذ الإجراءات الآن
          يمنع الهدر ويحسّن أرباحك.
        </p>
      </div>
    </div>
  );
}
