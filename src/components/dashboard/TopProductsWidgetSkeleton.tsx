export function TopProductsWidgetSkeleton() {
  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant animate-pulse">
      <div className="p-md bg-surface-container-high border-b border-outline-variant h-[52px]" />
      <div className="divide-y divide-outline-variant">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-sm p-md"
          >
            <div className="flex items-center gap-sm min-w-0 flex-1">
              <span className="h-7 w-7 rounded-full bg-surface-container-high/60 shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="h-3.5 w-2/3 rounded bg-surface-container-high/60" />
                <span className="h-3 w-1/3 rounded bg-surface-container-high/60" />
              </div>
            </div>
            <span className="h-4 w-14 rounded bg-surface-container-high/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
