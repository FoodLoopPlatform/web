export function DashboardHeroMetricsSkeleton() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg animate-pulse">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-light-green p-md rounded-xl border border-outline-variant flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex justify-between items-start mb-xs">
            <span className="h-10 w-10 rounded-lg bg-surface-container-high/60" />
            <span className="h-5 w-16 rounded-full bg-surface-container-high/60" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="h-3 w-28 rounded bg-surface-container-high/60" />
            <span className="h-6 w-24 rounded bg-surface-container-high/60" />
          </div>
        </div>
      ))}
    </section>
  );
}
