"use client";

export function InventorySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-surface-container-high/40 rounded-xl min-h-[280px] sm:min-h-[320px] border border-outline-variant/30 flex flex-col p-4 justify-between"
        >
          <div className="bg-surface-container-highest rounded-lg h-44 sm:h-52 md:h-auto md:aspect-square w-full" />
          <div className="space-y-2 mt-4">
            <div className="bg-surface-container-highest rounded h-4 w-3/4" />
            <div className="bg-surface-container-highest rounded h-3 w-1/2" />
          </div>
          <div className="bg-surface-container-highest rounded h-8 w-full mt-4" />
        </div>
      ))}
    </div>
  );
}
