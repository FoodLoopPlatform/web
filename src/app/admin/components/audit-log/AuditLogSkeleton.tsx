export function AuditLogSkeleton() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-[1600px] mx-auto animate-pulse pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-48 bg-gray-200 rounded-lg" />
          <div className="h-4 w-72 bg-gray-100 rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-xl" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 bg-gray-100 rounded-2xl border border-gray-200 p-5 flex flex-col justify-between"
          />
        ))}
      </div>

      {/* Filter Bar */}
      <div className="h-16 bg-gray-100 rounded-2xl border border-gray-200" />

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-card-border overflow-hidden flex flex-col justify-between min-h-[380px]">
        {/* Table Header */}
        <div className="h-12 bg-gray-100 border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-4 px-6 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 w-1/4">
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                <div className="flex flex-col gap-1 w-full">
                  <div className="h-3.5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-2.5 w-1/2 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
              <div className="h-4 w-36 bg-gray-100 rounded" />
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
              <div className="h-3.5 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="h-14 bg-gray-50 border-t border-gray-100 px-6 flex items-center justify-between">
          <div className="h-4 w-36 bg-gray-200 rounded" />
          <div className="h-8 w-48 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
