"use client";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import type { StoreProfileInput } from "../lib/schemas";

type ProfileAutomationSectionProps = {
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

export function ProfileAutomationSection({
  form,
  errors,
  onInputChange,
}: ProfileAutomationSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start border-b border-outline-variant/30 pb-8">
      {/* Right Column: Title & Description */}
      <div className="lg:col-span-1 flex flex-col gap-2">
        <Heading level="md" className="text-primary font-bold">
          التسعير التلقائي (الذكاء الاصطناعي)
        </Heading>
        <Text
          variant="body-md"
          className="text-on-surface-variant leading-relaxed"
        >
          إدارة سياسات تخفيض الأسعار التلقائية للفائض الغذائي، وتحديد الحدود
          القصوى للخصومات لحماية أرباحك.
        </Text>
      </div>

      {/* Left Column: Input Card */}
      <div className="lg:col-span-2">
        <Card.Root className="border border-outline-variant/40 bg-surface-container-lowest rounded-xl shadow-sm">
          <Card.Body className="gap-stack-sm p-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 mb-4">
              <input
                type="checkbox"
                id="disableAutomation"
                name="disableAutomation"
                checked={form.disableAutomation}
                onChange={(e) =>
                  onInputChange("disableAutomation", e.target.checked)
                }
                className="h-5 w-5 accent-primary mt-1 cursor-pointer"
              />
              <div className="flex flex-col">
                <label
                  htmlFor="disableAutomation"
                  className="text-body-md font-semibold text-on-surface cursor-pointer"
                >
                  تعطيل تغييرات الأسعار التلقائية بالكامل
                </label>
                <span className="text-label-md text-on-surface-variant">
                  عند التفعيل، سيتم إيقاف التسعير التلقائي والاعتماد على التسعير
                  اليدوي فقط.
                </span>
              </div>
            </div>

            {!form.disableAutomation && (
              <div className="flex flex-col gap-6 p-4 rounded-xl border border-outline-variant/60 bg-surface-container-lowest">
                <div className="flex flex-col gap-3">
                  <Text
                    variant="label-md"
                    className="font-semibold text-on-surface"
                  >
                    وضع التسعير التلقائي
                  </Text>
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        mode: "manual",
                        title: "يدوي (توصيات فقط)",
                        desc: "يقدم الذكاء الاصطناعي توصيات فقط دون تطبيق تلقائي",
                      },
                      {
                        mode: "assisted",
                        title: "شبه تلقائي (يتطلب موافقة)",
                        desc: "يقترح الذكاء الاصطناعي الأسعار وينتظر موافقتك لتطبيقها",
                      },
                      {
                        mode: "autonomous",
                        title: "تلقائي بالكامل",
                        desc: "يطبق الذكاء الاصطناعي التغييرات تلقائياً ضمن الحدود المسموحة",
                      },
                    ].map((item) => (
                      <label
                        key={item.mode}
                        className="flex items-start gap-3 p-3.5 rounded-lg border border-outline-variant/60 bg-surface-container-low hover:bg-surface-container-high/50 transition-colors cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="automationMode"
                          checked={form.automationMode === item.mode}
                          onChange={() =>
                            onInputChange("automationMode", item.mode)
                          }
                          className="h-4 w-4 accent-primary mt-1"
                        />
                        <div className="flex flex-col ms-2">
                          <span className="text-body-md font-semibold text-on-surface">
                            {item.title}
                          </span>
                          <span className="text-label-md text-on-surface-variant mt-0.5">
                            {item.desc}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {form.automationMode === "autonomous" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-surface-container-low border border-outline-variant/60">
                    <Field.Root invalid={!!errors.maxDiscount}>
                      <Field.Label>
                        الحد الأقصى للخصم التلقائي المسموح به
                      </Field.Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          name="maxDiscount"
                          type="number"
                          min={1}
                          max={15}
                          className="w-24 rounded-lg border border-outline-variant bg-surface-container-lowest p-2 text-body-md text-on-surface outline-none focus:border-primary"
                          value={form.maxDiscount}
                          onChange={(e) =>
                            onInputChange("maxDiscount", Number(e.target.value))
                          }
                        />
                        <span className="text-body-md font-bold text-on-surface">
                          %
                        </span>
                      </div>
                      <Field.HelperText>
                        الحد الأقصى المسموح به في النظام هو 15% لحماية أرباحك.
                      </Field.HelperText>
                      {errors.maxDiscount && (
                        <Field.Error>{errors.maxDiscount}</Field.Error>
                      )}
                    </Field.Root>

                    <div className="flex flex-col gap-2">
                      <Text
                        variant="label-md"
                        className="font-semibold text-on-surface"
                      >
                        قاعدة الحد الأدنى للسعر
                      </Text>
                      <div className="flex flex-col gap-2 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-body-md text-on-surface">
                          <input
                            type="radio"
                            name="priceFloorRule"
                            checked={form.priceFloorRule === "cost"}
                            onChange={() =>
                              onInputChange("priceFloorRule", "cost")
                            }
                            className="h-4 w-4 accent-primary"
                          />
                          <span>
                            عدم البيع بأقل من تكلفة المنتج (حسب الفاتورة)
                          </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-body-md text-on-surface">
                          <input
                            type="radio"
                            name="priceFloorRule"
                            checked={form.priceFloorRule === "custom"}
                            onChange={() =>
                              onInputChange("priceFloorRule", "custom")
                            }
                            className="h-4 w-4 accent-primary"
                          />
                          <span>تحديد حد أدنى مخصص كنسبة من السعر الأصلي</span>
                        </label>

                        {form.priceFloorRule === "custom" && (
                          <div className="flex items-center gap-2 mt-1 ps-6">
                            <input
                              name="customFloorPercent"
                              type="number"
                              min={10}
                              max={90}
                              className="w-24 rounded-lg border border-outline-variant bg-surface-container-lowest p-2 text-body-md text-on-surface outline-none focus:border-primary"
                              value={form.customFloorPercent}
                              onChange={(e) =>
                                onInputChange(
                                  "customFloorPercent",
                                  Number(e.target.value),
                                )
                              }
                            />
                            <span className="text-body-md font-bold text-on-surface">
                              %
                            </span>
                            {errors.customFloorPercent && (
                              <span className="text-label-md text-error font-semibold">
                                {errors.customFloorPercent}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-start gap-3 p-4 rounded-xl border border-outline-variant/60 bg-surface-container-lowest mt-2">
              <input
                type="checkbox"
                id="suggestDonation"
                name="suggestDonation"
                checked={form.suggestDonation}
                onChange={(e) =>
                  onInputChange("suggestDonation", e.target.checked)
                }
                className="h-5 w-5 accent-primary mt-1 cursor-pointer"
              />
              <div className="flex flex-col">
                <label
                  htmlFor="suggestDonation"
                  className="text-body-md font-semibold text-on-surface cursor-pointer"
                >
                  اقتراح السلع المؤهلة للتبرع تلقائياً
                </label>
                <span className="text-label-md text-on-surface-variant">
                  توصية المنتجات القريبة جداً من انتهاء الصلاحية للمؤسسات
                  الخيرية الشريكة.
                </span>
              </div>
            </div>
          </Card.Body>
        </Card.Root>
      </div>
    </div>
  );
}
