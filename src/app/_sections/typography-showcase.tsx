import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export function TypographyShowcase() {
  return (
    <section className="flex flex-col gap-stack-sm">
      <Heading as="h2" level="md">
        الطباعة
      </Heading>
      <div className="flex flex-col gap-3 rounded-lg border border-card-border bg-surface-container-lowest p-gutter">
        <Heading as="h1" level="lg">
          عنوان رئيسي كبير
        </Heading>
        <Heading as="h2" level="md">
          عنوان متوسط
        </Heading>
        <Text variant="body-lg">
          نص أساسي كبير — Cairo يوفر وضوحًا استثنائيًا للعربية مع طابع هندسي
          حديث.
        </Text>
        <Text variant="body-md">
          نص أساسي متوسط لمعظم المحتوى النصي في الواجهة.
        </Text>
        <Text variant="label-md">تسمية صغيرة للعناصر التفاعلية</Text>
      </div>
    </section>
  );
}
