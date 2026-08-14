"use client";

export function DisputesSkeleton() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-[1600px] mx-auto animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface-container-high/40 rounded-2xl h-24 border border-outline-variant/30"
          />
        ))}
      </div>
      <div className="bg-surface-container-high/40 rounded-2xl border border-outline-variant/30 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 border-b border-outline-variant/20 last:border-b-0"
          />
        ))}
      </div>
    </div>
  );
}
