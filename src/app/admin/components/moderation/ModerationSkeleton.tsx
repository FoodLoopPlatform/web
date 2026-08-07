export function ModerationSkeleton() {
  return (
    <div className="w-full flex flex-col gap-5 lg:gap-6 max-w-[1600px] mx-auto min-h-screen pb-12 animate-pulse font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-48 bg-gray-200 rounded-lg" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-xl" />
      </div>

      <div className="h-10 w-full max-w-2xl bg-gray-100 rounded-full" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-64 bg-gray-100 rounded-2xl border border-gray-200"
          />
        ))}
      </div>
    </div>
  );
}
