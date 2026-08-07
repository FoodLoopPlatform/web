export function DisputesSkeleton() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-[1600px] mx-auto animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-48 bg-gray-200 rounded-lg" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
        </div>
        <div className="h-10 w-48 bg-gray-200 rounded-xl" />
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
        ))}
      </div>

      {/* Search Toolbar */}
      <div className="h-14 bg-gray-100 rounded-2xl border border-gray-200" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 h-96 bg-gray-100 rounded-2xl border border-gray-200" />
        <div className="flex flex-col gap-6">
          <div className="h-44 bg-gray-100 rounded-2xl border border-gray-200" />
          <div className="h-44 bg-gray-100 rounded-2xl border border-gray-200" />
        </div>
      </div>
    </div>
  );
}
