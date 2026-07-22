"use client";

export function RecentActivityWidget() {
  return (
    <div className="bg-[#f2f5ee] rounded-xl border border-[#bfc9be] p-md">
      <h4 className="font-label-caps text-label-caps text-[#00381a] font-bold uppercase mb-md">
        العمليات الأخيرة بالمتجر
      </h4>
      <div className="space-y-md">
        <div className="flex gap-sm border-r-2 border-[#90d6a2] pr-sm pl-0">
          <div className="min-w-[70px] font-data-mono text-xs opacity-75 font-bold text-[#404941]">
            ١٠:٤٥ ص
          </div>
          <div>
            <p className="text-sm font-bold text-[#1c1c18]">
              تم إنشاء صفقة خصم
            </p>
            <p className="text-xs text-[#404941]">خصم ٣٠٪ على طماطم عضوية</p>
          </div>
        </div>
        <div className="flex gap-sm border-r-2 border-[#ffddb7] pr-sm pl-0">
          <div className="min-w-[70px] font-data-mono text-xs opacity-75 font-bold text-[#404941]">
            ٠٩:١٢ ص
          </div>
          <div>
            <p className="text-sm font-bold text-[#1c1c18]">جمع تبرعات فائضة</p>
            <p className="text-xs text-[#404941]">بنك الطعام جمع ١٥ كجم فائض</p>
          </div>
        </div>
        <div className="flex gap-sm border-r-2 border-[#bfc9be] pr-sm pl-0 opacity-60">
          <div className="min-w-[70px] font-data-mono text-xs opacity-75 font-bold text-[#404941]">
            أمس
          </div>
          <div>
            <p className="text-sm font-bold text-[#1c1c18]">
              تسوية جرد المخزون
            </p>
            <p className="text-xs text-[#404941]">
              اكتمل التدقيق بواسطة س. ميلر
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
