import { Heading } from "@/components/ui/heading";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function FormShowcase() {
  return (
    <section className="flex flex-col gap-stack-sm">
      <Heading as="h2" level="md">
        حقول الإدخال
      </Heading>
      <div className="flex max-w-sm flex-col gap-stack-md">
        <Field.Root>
          <Field.Label>الاسم الكامل</Field.Label>
          <Field.Control placeholder="مثال: سارة أحمد" />
          <Field.HelperText>كما يظهر في بطاقة الهوية</Field.HelperText>
        </Field.Root>

        <Field.Root invalid>
          <Field.Label>البريد الإلكتروني</Field.Label>
          <Field.Control type="email" defaultValue="not-an-email" />
          <Field.Error>يرجى إدخال بريد إلكتروني صالح</Field.Error>
        </Field.Root>

        <Button variant="primary" className="self-start">
          إرسال
        </Button>
      </div>
    </section>
  );
}
