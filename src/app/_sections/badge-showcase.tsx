import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";

export function BadgeShowcase() {
  return (
    <section className="flex flex-col gap-stack-sm">
      <Heading as="h2" level="md">
        الشارات
      </Heading>
      <div className="flex flex-wrap gap-2">
        <Badge variant="status">عضوي</Badge>
        <Badge variant="status">قريب منك</Badge>
        <Badge variant="primary">موصى به</Badge>
        <Badge variant="neutral">نباتي</Badge>
        <Badge variant="outline">جديد</Badge>
      </div>
    </section>
  );
}
