export function ProductDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-lg animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 bg-surface-container-high/60 rounded-xl w-1/3" />

      {/* Main card skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg bg-light-green p-lg rounded-2xl border border-outline-variant/40">
        {/* Image skeleton */}
        <div className="md:col-span-5 aspect-square bg-surface-container-high/80 rounded-xl" />

        {/* Info skeleton */}
        <div className="md:col-span-7 flex flex-col gap-md">
          <div className="h-6 bg-surface-container-high/60 rounded-lg w-1/4" />
          <div className="h-10 bg-surface-container-high/60 rounded-xl w-3/4" />
          <div className="h-20 bg-surface-container-high/40 rounded-xl w-full" />
          <div className="grid grid-cols-2 gap-md pt-4">
            <div className="h-16 bg-surface-container-high/50 rounded-xl" />
            <div className="h-16 bg-surface-container-high/50 rounded-xl" />
          </div>
          <div className="h-14 bg-surface-container-high/60 rounded-xl w-full mt-4" />
        </div>
      </div>
    </div>
  );
}
