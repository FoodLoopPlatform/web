import React from "react";
import Image from "next/image";
import { TopEntityListProps } from "../../types/analytics.types";

export const AnalyticsTopEntitiesList: React.FC<TopEntityListProps> = ({
  titleAr,
  titleEn,
  items,
  isRtl = false,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-surface-container shadow-sm flex flex-col gap-4">
      <h3 className="text-base font-extrabold text-on-surface">
        {isRtl ? titleAr : titleEn}
      </h3>
      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-xs text-outline italic">
            {isRtl
              ? "لا توجد بيانات المتاحة حالياً"
              : "No entity data available."}
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 overflow-hidden relative flex items-center justify-center shrink-0">
                  {item.avatarUrl ? (
                    <Image
                      src={item.avatarUrl}
                      alt={item.nameEn}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs font-black text-primary">
                      {(isRtl ? item.nameAr : item.nameEn)
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">
                    {isRtl ? item.nameAr : item.nameEn}
                  </span>
                  <span className="text-[10px] font-medium text-outline">
                    {isRtl ? item.metricLabelAr : item.metricLabelEn}
                  </span>
                </div>
              </div>
              <span className="text-xs font-extrabold text-primary bg-primary-container/30 px-2.5 py-1 rounded-full">
                {item.metricValue}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
