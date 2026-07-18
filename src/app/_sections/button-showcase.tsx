import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { LeafIcon } from "@/components/icons/leaf-icon";

export function ButtonShowcase() {
  return (
    <section className="flex flex-col gap-stack-sm">
      <Heading as="h2" level="md">
        الأزرار
      </Heading>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" startIcon={<LeafIcon className="h-4 w-4" />}>
          تصفح المنتجات
        </Button>
        <Button variant="secondary">إضافة إلى القائمة</Button>
        <Button variant="outline">التفاصيل</Button>
        <Button variant="ghost">إلغاء</Button>
        <Button variant="primary" size="sm">
          حجز الآن
        </Button>
        <Button variant="primary" disabled>
          غير متاح
        </Button>
      </div>
    </section>
  );
}
