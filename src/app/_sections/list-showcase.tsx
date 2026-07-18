import { Heading } from "@/components/ui/heading";
import { List } from "@/components/ui/list";
import { LeafIcon } from "@/components/icons/leaf-icon";
import { BagIcon } from "@/components/icons/bag-icon";
import { MapPinIcon } from "@/components/icons/map-pin-icon";

export function ListShowcase() {
  return (
    <section className="flex flex-col gap-stack-sm">
      <Heading as="h2" level="md">
        القوائم
      </Heading>
      <List.Root className="max-w-sm rounded-lg border border-card-border bg-surface-container-lowest px-gutter">
        <List.Item icon={<LeafIcon className="h-5 w-5" />}>
          مصادر عضوية موثقة
        </List.Item>
        <List.Item icon={<BagIcon className="h-5 w-5" />}>
          تغليف قابل لإعادة الاستخدام
        </List.Item>
        <List.Item icon={<MapPinIcon className="h-5 w-5" />}>
          تسليم من أقرب نقطة تجميع
        </List.Item>
      </List.Root>
    </section>
  );
}
