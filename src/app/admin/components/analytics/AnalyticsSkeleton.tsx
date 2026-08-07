export function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-[1600px] mx-auto pb-12 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-48 bg-gray-200 rounded-lg" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="h-72 bg-gray-100 rounded-2xl border border-gray-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 bg-gray-100 rounded-2xl border border-gray-200" />
            <div className="h-48 bg-gray-100 rounded-2xl border border-gray-200" />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-56 bg-gray-100 rounded-2xl border border-gray-200" />
          <div className="h-40 bg-gray-100 rounded-2xl border border-gray-200" />
        </div>
      </div>
    </div>
  );
}
