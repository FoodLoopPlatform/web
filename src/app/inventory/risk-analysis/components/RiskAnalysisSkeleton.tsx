export function RiskAnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-lg w-full animate-pulse">
      <div className="flex items-center justify-between gap-md">
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-surface-container-high/60 rounded-xl" />
          <div className="h-10 w-28 bg-surface-container-high/60 rounded-xl" />
        </div>
        <div className="h-10 w-64 bg-surface-container-high/60 rounded-xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-lg items-start w-full">
        <div className="w-full lg:w-[320px] shrink-0 h-80 bg-surface-container-high/40 rounded-xl" />
        <div className="flex-1 min-w-0 flex flex-col gap-lg w-full">
          <div className="h-24 bg-surface-container-high/40 rounded-xl w-full" />
          <div className="h-72 bg-surface-container-high/40 rounded-xl w-full" />
          <div className="h-32 bg-surface-container-high/40 rounded-2xl w-full" />
        </div>
      </div>
    </div>
  );
}
