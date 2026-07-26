export function RecentActivityWidget() {
  return (
    <div className="bg-light-green rounded-xl border border-outline-variant p-md">
      <h4 className="font-label-caps text-label-caps text-primary font-bold uppercase mb-md">
        العمليات الأخيرة بالمتجر
      </h4>
      <div className="space-y-md">
        <div className="flex gap-sm border-r-2 border-inverse-primary pr-sm pl-0">
          <div className="min-w-[70px] font-data-mono text-xs opacity-75 font-bold text-on-surface-variant">
            ١٠:٤٥ ص
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">
              تم إنشاء صفقة خصم
            </p>
            <p className="text-xs text-on-surface-variant">
              خصم ٣٠٪ على طماطم عضوية
            </p>
          </div>
        </div>
        <div className="flex gap-sm border-r-2 border-tertiary-fixed pr-sm pl-0">
          <div className="min-w-[70px] font-data-mono text-xs opacity-75 font-bold text-on-surface-variant">
            ٠٩:١٢ ص
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">
              جمع تبرعات فائضة
            </p>
            <p className="text-xs text-on-surface-variant">
              بنك الطعام جمع ١٥ كجم فائض
            </p>
          </div>
        </div>
        <div className="flex gap-sm border-r-2 border-outline-variant pr-sm pl-0 opacity-60">
          <div className="min-w-[70px] font-data-mono text-xs opacity-75 font-bold text-on-surface-variant">
            أمس
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">
              تسوية جرد المخزون
            </p>
            <p className="text-xs text-on-surface-variant">
              اكتمل التدقيق بواسطة س. ميلر
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
