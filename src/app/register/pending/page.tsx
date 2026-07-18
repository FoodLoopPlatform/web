import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { ClockIcon } from "@/components/icons/clock-icon";
import { InfoCircleIcon } from "@/components/icons/info-circle-icon";
import { HeadsetIcon } from "@/components/icons/headset-icon";
import { LeafIcon } from "@/components/icons/leaf-icon";
import { RegisterProgress } from "../components/register-progress";

export default function VerificationPendingPage() {
  return (
    <div className="relative flex w-full max-w-xl flex-col gap-stack-lg pb-2">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="absolute -top-16 -inset-s-16 h-64 w-64 rounded-full bg-primary-container/10 blur-3xl" />
        <span className="absolute top-1/2 -inset-e-24 h-52 w-52 rounded-full bg-tertiary-fixed/20 blur-3xl" />
        <span className="absolute bottom-0 inset-s-1/3 h-40 w-40 rounded-full bg-inverse-primary/10 blur-3xl" />
      </div>

      <RegisterProgress
        step={3}
        label="رحلة التسجيل"
        labelClassName="text-primary"
        variant="linear"
        className="mx-auto max-w-xs"
      />

      <Card.Root className="relative overflow-hidden border-outline-variant bg-surface-container-low">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-on-tertiary-fixed-variant" />
        <Card.Body className="items-center gap-stack-md p-16 text-center">
          <div className="flex flex-col items-center gap-3 pt-8">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant">
              <ClockIcon className="h-10 w-10" />
            </span>
            <Heading as="h1" level="lg" className="text-center">
              قيد المراجعة
            </Heading>
            <span className="inline-flex items-center gap-2 rounded-full bg-on-tertiary-fixed-variant/10 px-4 py-1 text-label-md text-on-tertiary-fixed-variant">
              <span className="h-2 w-2 rounded-full bg-on-tertiary-fixed-variant" />
              الحالة: بانتظار التحقق
            </span>
          </div>

          <Text
            variant="body-lg"
            className="max-w-md text-center text-on-surface-variant"
          >
            طلبك قيد المعالجة الآن. يقوم فريق اللوجستيات وضمان الجودة لدينا
            بمراجعة بياناتك للتأكد من التزامها بمعايير FoodLoop العالية.
          </Text>

          <div className="flex w-full items-start gap-4 rounded-md bg-surface-container p-6 text-start">
            <InfoCircleIcon className="h-6 w-6 shrink-0 text-primary" />
            <div className="flex flex-col gap-1">
              <Text variant="label-md" className="text-link">
                الوقت التقديري للمراجعة
              </Text>
              <Text variant="body-md" className="text-on-surface">
                24-48 ساعة عمل
              </Text>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-4 border-t border-outline-variant pt-4">
            <Text variant="body-md" className="text-on-surface-variant">
              هل لديك أسئلة حول طلبك؟
            </Text>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-body-md font-medium text-link opacity-80 transition-opacity hover:opacity-100"
            >
              <HeadsetIcon className="h-5 w-5" />
              تواصل مع الدعم
            </a>
          </div>
        </Card.Body>
      </Card.Root>

      <div className="flex items-center gap-stack-sm">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-primary-container text-on-primary-container">
          <LeafIcon className="h-7 w-7" />
        </span>
        <Text
          variant="body-md"
          as="p"
          className="italic text-on-surface-variant"
        >
          &ldquo;نحن ملتزمون بربط أحدث المحاصيل المحلية بخدمات لوجستية موثوقة.
          شكرًا لصبركم أثناء التحقق من حسابكم.&rdquo;
        </Text>
      </div>
    </div>
  );
}
