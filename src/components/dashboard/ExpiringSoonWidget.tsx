import Link from "next/link";

export function ExpiringSoonWidget() {
  return (
    <div className="bg-light-green rounded-xl border border-outline-variant p-md flex flex-col justify-between">
      <div className="flex justify-between items-center mb-md">
        <h4 className="font-label-caps text-label-caps text-primary font-bold uppercase">
          قريب انتهاء الصلاحية
        </h4>
        <Link
          href="/inventory"
          className="text-link text-xs font-bold hover:underline"
        >
          عرض الكل
        </Link>
      </div>
      <div className="space-y-sm">
        {/* Item 1 */}
        <div className="flex items-center justify-between p-sm bg-white rounded-lg shadow-sm">
          <div className="flex gap-sm items-center">
            <div className="w-12 h-12 bg-tertiary-fixed flex flex-col items-center justify-center rounded-lg shrink-0">
              <span className="text-[10px] font-bold text-on-tertiary-fixed-variant">
                نوفمبر
              </span>
              <span className="text-lg font-bold text-on-tertiary-fixed-variant leading-none">
                ١٢
              </span>
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm">
                حليب كامل الدسم ٢٪
              </p>
              <p className="text-xs text-on-surface-variant">
                ٢٤ عبوة • ينتهي خلال ١٨ ساعة
              </p>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex items-center justify-between p-sm bg-white rounded-lg shadow-sm">
          <div className="flex gap-sm items-center">
            <div className="w-12 h-12 bg-tertiary-fixed flex flex-col items-center justify-center rounded-lg shrink-0">
              <span className="text-[10px] font-bold text-on-tertiary-fixed-variant">
                نوفمبر
              </span>
              <span className="text-lg font-bold text-on-tertiary-fixed-variant leading-none">
                ١٣
              </span>
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm">
                زبادي يوناني طبيعي
              </p>
              <p className="text-xs text-on-surface-variant">
                ١٥ عبوة • ينتهي خلال ٣٢ ساعة
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
