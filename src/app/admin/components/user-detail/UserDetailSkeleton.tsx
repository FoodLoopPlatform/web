export function UserDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="h-64 bg-gray-100 rounded-2xl border border-gray-200" />
          <div className="h-44 bg-gray-100 rounded-2xl border border-gray-200" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-64 bg-gray-100 rounded-2xl border border-gray-200" />
        </div>
      </div>
      <div className="h-64 bg-gray-100 rounded-2xl border border-gray-200" />
    </div>
  );
}
