export function DisputeDetailSkeleton() {
  return (
    <div className="flex flex-col gap-lg w-full animate-pulse">
      <div className="flex items-center justify-between gap-md">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-surface-container-high/60 rounded" />
          <div className="h-8 w-80 bg-surface-container-high/60 rounded-xl" />
        </div>
        <div className="h-8 w-24 bg-surface-container-high/60 rounded-full" />
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-10 w-full flex flex-col lg:flex-row gap-lg">
        <div className="w-full lg:w-[260px] h-40 bg-surface-container-high/40 rounded-xl shrink-0" />
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-24 bg-surface-container-high/40 rounded-xl w-full" />
          <div className="h-40 bg-surface-container-high/40 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}
