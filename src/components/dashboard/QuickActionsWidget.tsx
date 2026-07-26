import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function QuickActionsWidget() {
  return (
    <div className="bg-primary text-white rounded-xl p-md shadow-lg">
      <h4 className="text-lg font-bold mb-md text-center md:text-right">
        إجراءات سريعة للتاجر
      </h4>
      <div className="space-y-sm">
        <Link
          href="#"
          className="flex w-full bg-primary-fixed text-primary py-3.5 px-md rounded-xl font-bold items-center justify-between hover:scale-[1.02] active:scale-95 transition-[transform] duration-200 cursor-pointer font-sans focus-visible:ring-2 focus-visible:ring-white outline-none"
        >
          <span>تطبيق التسعير الذكي</span>
          <Icon name="sell" className="h-5 w-5" />
        </Link>
        <Link
          href="#"
          className="flex w-full bg-white/10 border border-white/20 text-white py-3.5 px-md rounded-xl font-bold items-center justify-between hover:bg-white/15 active:scale-95 transition-[background-color,transform] duration-200 cursor-pointer font-sans focus-visible:ring-2 focus-visible:ring-white outline-none"
        >
          <span>مراجعة مخاطر السلع</span>
          <Icon name="warning" className="h-5 w-5" />
        </Link>
        <Link
          href="#"
          className="flex w-full bg-white/10 border border-white/20 text-white py-3.5 px-md rounded-xl font-bold items-center justify-between hover:bg-white/15 active:scale-95 transition-[background-color,transform] duration-200 cursor-pointer font-sans focus-visible:ring-2 focus-visible:ring-white outline-none"
        >
          <span>طلب تبرع للجمعيات</span>
          <Icon name="volunteer_activism" className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
