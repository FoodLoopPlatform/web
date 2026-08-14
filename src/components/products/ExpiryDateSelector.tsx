"use client";

import { Icon } from "@/components/ui/icon";

interface ExpiryDateSelectorProps {
  expiryDate: string;
  setExpiryDate: (date: string) => void;
}

export function ExpiryDateSelector({
  expiryDate,
  setExpiryDate,
}: ExpiryDateSelectorProps) {
  return (
    <div className="bg-light-green rounded-xl overflow-hidden border border-outline-variant/50 shadow-sm flex flex-col justify-between">
      <div className="bg-surface-container-high px-md py-3 flex justify-between items-center border-b border-outline-variant/50">
        <h3 className="text-label-caps text-primary font-bold uppercase">
          إدارة تاريخ انتهاء الصلاحية
        </h3>
      </div>

      <div className="p-md min-h-[160px] flex flex-col justify-center bg-white">
        <div className="space-y-sm">
          <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase">
            تحديد تاريخ الانتهاء
          </label>
          <div className="relative">
            <input
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary font-data-mono text-sm transition-all outline-none"
              type="date"
            />
            <p className="mt-2 text-error text-[10px] font-bold uppercase flex items-center gap-1.5">
              <Icon name="help" className="h-3.5 w-3.5 text-error" />
              <span>
                المنتجات التي تنتهي صلاحيتها في غضون ٤٨ ساعة ستحصل على أولوية
                عرض وترويج تلقائية.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
