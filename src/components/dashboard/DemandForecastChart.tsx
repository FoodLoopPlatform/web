"use client";

import { useState } from "react";

export function DemandForecastChart() {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const chartData = [
    { day: "الإثنين", prediction: 130, actual: 96, predVal: 740, actVal: 520 },
    {
      day: "الثلاثاء",
      prediction: 190,
      actual: 160,
      predVal: 980,
      actVal: 810,
    },
    {
      day: "الأربعاء",
      prediction: 220,
      actual: 240,
      predVal: 1100,
      actVal: 1250,
    },
    {
      day: "الخميس",
      prediction: 260,
      actual: 210,
      predVal: 1300,
      actVal: 1050,
    },
    { day: "الجمعة", prediction: 160, actual: 180, predVal: 820, actVal: 900 },
    { day: "السبت", prediction: 130, actual: 80, predVal: 740, actVal: 450 },
    { day: "الأحد", prediction: 100, actual: 64, predVal: 500, actVal: 320 },
  ];

  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant min-h-[400px] flex flex-col">
      <div className="p-md bg-surface-container-high border-b border-outline-variant flex justify-between items-center">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-primary">
            توقعات الطلب والمبيعات
          </h3>
          <p className="text-on-surface-variant text-body-md mt-1">
            تنبؤات المبيعات الأسبوعية مقابل المبيعات الفعلية للسلع
          </p>
        </div>
        <div className="flex gap-xs">
          <span className="px-3 py-1 bg-primary-fixed text-link rounded-full text-xs font-bold">
            المبيعات المتوقعة
          </span>
          <span className="px-3 py-1 bg-outline-variant text-on-surface-variant rounded-full text-xs font-bold">
            المبيعات الفعلية
          </span>
        </div>
      </div>
      <div className="flex-grow p-md relative bg-white min-h-[300px]">
        {/* SVG/CSS Chart Layout */}
        <div className="absolute inset-x-0 bottom-0 top-16 px-md pb-md flex items-end justify-between">
          {/* Grid background lines */}
          <div className="absolute inset-x-md top-lg bottom-lg border-b border-dashed border-outline-variant/40"></div>
          <div className="absolute inset-x-md top-1/2 bottom-lg border-b border-dashed border-outline-variant/40"></div>

          <div className="flex items-end gap-sm w-full h-full pb-md z-10">
            {chartData.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-xs flex-1 relative group cursor-pointer"
                onMouseEnter={() => setHoveredDay(idx)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Tooltip */}
                {hoveredDay === idx && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-inverse-surface text-white p-2 rounded-lg text-xs z-20 shadow-lg flex flex-col gap-1 min-w-[100px] text-center">
                    <div>الطلب: {item.predVal} كجم</div>
                    <div className="border-t border-outline-variant/40 mt-1 pt-1 opacity-80">
                      الفعلي: {item.actVal} كجم
                    </div>
                  </div>
                )}

                <div className="w-full flex gap-1 items-end justify-center h-48 mb-2">
                  {/* Prediction bar */}
                  <div
                    style={{ height: `${(item.prediction / 300) * 100}%` }}
                    className="w-1/2 bg-primary-fixed opacity-70 group-hover:opacity-90 rounded-t-md transition-all duration-300"
                  />
                  {/* Actual bar */}
                  <div
                    style={{ height: `${(item.actual / 300) * 100}%` }}
                    className="w-1/2 bg-primary-rounded bg-primary rounded-t-md transition-all duration-300"
                  />
                </div>
                <span className="font-data-mono text-xs opacity-75 font-bold text-on-surface-variant">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
