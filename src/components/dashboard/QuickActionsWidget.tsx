"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function QuickActionsWidget() {
  return (
    <div className="bg-[#00381a] text-white rounded-xl p-md shadow-lg">
      <h4 className="text-lg font-bold mb-md text-center md:text-right">
        إجراءات سريعة للتاجر
      </h4>
      <div className="space-y-sm">
        <Link href="#" className="block w-full">
          <button className="w-full bg-[#98f3b0] text-[#00381a] py-3.5 px-md rounded-xl font-bold flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all cursor-pointer font-sans">
            <span>تطبيق التسعير الذكي</span>
            <Icon name="sell" className="h-5 w-5" />
          </button>
        </Link>
        <Link href="#" className="block w-full">
          <button className="w-full bg-white/10 border border-white/20 text-white py-3.5 px-md rounded-xl font-bold flex items-center justify-between hover:bg-white/15 active:scale-95 transition-all cursor-pointer font-sans">
            <span>مراجعة مخاطر السلع</span>
            <Icon name="warning" className="h-5 w-5" />
          </button>
        </Link>
        <Link href="#" className="block w-full">
          <button className="w-full bg-white/10 border border-white/20 text-white py-3.5 px-md rounded-xl font-bold flex items-center justify-between hover:bg-white/15 active:scale-95 transition-all cursor-pointer font-sans">
            <span>طلب تبرع للجمعيات</span>
            <Icon name="volunteer_activism" className="h-5 w-5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
