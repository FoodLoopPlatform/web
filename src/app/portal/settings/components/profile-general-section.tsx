"use client";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { businessTypesList, type StoreProfileInput } from "../lib/schemas";

type ProfileGeneralSectionProps = {
  form: Omit<StoreProfileInput, "logoFile" | "coverFile">;
  errors: Partial<Record<string, string>>;
  onInputChange: (
    key: keyof Omit<
      StoreProfileInput,
      "logoFile" | "coverFile" | "operatingHours"
    >,
    value: unknown,
  ) => void;
};

export function ProfileGeneralSection({
  form,
  errors,
  onInputChange,
}: ProfileGeneralSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start border-b border-outline-variant/30 pb-8">
        <div className="lg:col-span-1 flex flex-col gap-2">
          <Heading level="md" className="text-primary font-bold">
            المعلومات الأساسية
          </Heading>
          <Text
            variant="body-md"
            className="text-on-surface-variant leading-relaxed"
          >
            الاسم التجاري والوصف التعريفي للعملاء على المنصة.
          </Text>
        </div>

        <div className="lg:col-span-2">
          <Card.Root className="border border-outline-variant/40 bg-surface-container-lowest rounded-xl shadow-sm">
            <Card.Body className="p-6 flex flex-col gap-4">
              <Field.Root invalid={!!errors.businessName}>
                <Field.Label className="font-semibold text-primary">
                  اسم المتجر
                </Field.Label>
                <Field.Control
                  name="businessName"
                  autoComplete="organization"
                  placeholder="مثال: سوبرماركت النيل…"
                  value={form.businessName}
                  onChange={(e) =>
                    onInputChange("businessName", e.target.value)
                  }
                  className="rounded-lg border border-outline-variant p-3"
                />
                {errors.businessName && (
                  <Field.Error>{errors.businessName}</Field.Error>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.businessType}>
                <Field.Label className="font-semibold text-primary">
                  نوع النشاط التجاري
                </Field.Label>
                <Field.Select
                  name="businessType"
                  value={form.businessType}
                  onChange={(e) =>
                    onInputChange("businessType", e.target.value)
                  }
                  className="rounded-lg border border-outline-variant p-3"
                >
                  <option value="" disabled>
                    اختر نوع النشاط…
                  </option>
                  {businessTypesList.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Field.Select>
                {errors.businessType && (
                  <Field.Error>{errors.businessType}</Field.Error>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.description}>
                <Field.Label className="font-semibold text-primary">
                  وصف قصير عن المتجر
                </Field.Label>
                <textarea
                  name="description"
                  rows={4}
                  maxLength={300}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-3 text-body-md text-on-surface outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all resize-none"
                  placeholder="مثال: نقدم أفضل السلع الغذائية الفائضة بجودة عالية وأسعار منافسة للمساهمة في تقليل الهدر…"
                  value={form.description}
                  onChange={(e) => onInputChange("description", e.target.value)}
                />
                <div className="flex justify-between mt-1 px-1">
                  <span className="text-[12px] text-outline">
                    {(form.description || "").length}/300
                  </span>
                  {errors.description && (
                    <span className="text-label-md text-error">
                      {errors.description}
                    </span>
                  )}
                </div>
              </Field.Root>
            </Card.Body>
          </Card.Root>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start border-b border-outline-variant/30 pb-8">
        <div className="lg:col-span-1 flex flex-col gap-2">
          <Heading level="md" className="text-primary font-bold">
            معلومات الاتصال والدعم
          </Heading>
          <Text
            variant="body-md"
            className="text-on-surface-variant leading-relaxed"
          >
            قنوات الاتصال المعتمدة لاستقبال استفسارات العملاء والمنسقين.
          </Text>
        </div>

        <div className="lg:col-span-2">
          <Card.Root className="border border-outline-variant/40 bg-surface-container-lowest rounded-xl shadow-sm">
            <Card.Body className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field.Root invalid={!!errors.phone}>
                <Field.Label className="font-semibold text-primary">
                  رقم الهاتف
                </Field.Label>
                <Field.Control
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="مثال: 01012345678…"
                  value={form.phone}
                  onChange={(e) => onInputChange("phone", e.target.value)}
                  className="rounded-lg border border-outline-variant p-3"
                />
                {errors.phone && <Field.Error>{errors.phone}</Field.Error>}
              </Field.Root>

              <Field.Root invalid={!!errors.email}>
                <Field.Label className="font-semibold text-primary">
                  البريد الإلكتروني للنشاط
                </Field.Label>
                <Field.Control
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@store.com"
                  value={form.email}
                  onChange={(e) => onInputChange("email", e.target.value)}
                  className="rounded-lg border border-outline-variant p-3"
                />
                {errors.email && <Field.Error>{errors.email}</Field.Error>}
              </Field.Root>
            </Card.Body>
          </Card.Root>
        </div>
      </div>
    </>
  );
}
