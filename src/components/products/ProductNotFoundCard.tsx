import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function ProductNotFoundCard() {
  return (
    <div className="max-w-3xl mx-auto py-16 text-center bg-surface-container-high/20 rounded-2xl border-2 border-dashed border-outline-variant p-xl">
      <Icon
        name="error_outline"
        className="h-16 w-16 mb-4 text-error/60 mx-auto"
      />
      <h3 className="font-bold text-xl text-on-surface mb-2">
        لم يتم العثور على المنتج
      </h3>
      <p className="text-body-md text-on-surface-variant mb-6">
        المنتج الذي تبحث عنه غير موجود أو تم حذفه مؤخراً.
      </p>
      <Link
        href="/inventory"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
      >
        <Icon name="arrow_forward" className="h-5 w-5" />
        <span>العودة إلى المخزون</span>
      </Link>
    </div>
  );
}
