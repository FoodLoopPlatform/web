"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import {
  storeProfileSchema,
  type DayKey,
  type StoreProfileInput,
} from "../lib/schemas";
import { updateStoreProfile } from "../services/settings-service";
import { ProfileHoursSection } from "./profile-hours-section";
import { ProfileAutomationSection } from "./profile-automation-section";
import { ProfileIdentitySection } from "./profile-identity-section";
import { ProfileGeneralSection } from "./profile-general-section";

type StoreProfileFormProps = {
  initialData: Omit<StoreProfileInput, "logoFile" | "coverFile"> & {
    lastUpdated?: string;
  };
  onSaveSuccess: (lastUpdated: string) => void;
  showToast: (msg: string, type: "success" | "error") => void;
};

export function StoreProfileForm({
  initialData,
  onSaveSuccess,
  showToast,
}: StoreProfileFormProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoUrlRef = useRef<string>("");
  const coverUrlRef = useRef<string>("");

  const [form, setForm] = useState<
    Omit<StoreProfileInput, "logoFile" | "coverFile">
  >({
    businessName: initialData.businessName,
    logoUrl: initialData.logoUrl || "",
    coverUrl: initialData.coverUrl || "",
    businessType: initialData.businessType,
    description: initialData.description || "",
    phone: initialData.phone,
    email: initialData.email,
    preferredLanguage: "ar",
    operatingHours: initialData.operatingHours,
    disableAutomation: initialData.disableAutomation,
    automationMode: initialData.automationMode,
    maxDiscount: initialData.maxDiscount,
    priceFloorRule: initialData.priceFloorRule,
    customFloorPercent: initialData.customFloorPercent,
    suggestDonation: initialData.suggestDonation,
    arrangeDelivery: initialData.arrangeDelivery,
    deliveryNotes: initialData.deliveryNotes || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof StoreProfileInput | string, string>>
  >({});

  useEffect(() => {
    return () => {
      if (logoUrlRef.current) {
        URL.revokeObjectURL(logoUrlRef.current);
      }
      if (coverUrlRef.current) {
        URL.revokeObjectURL(coverUrlRef.current);
      }
    };
  }, []);

  const letterboxToSquare = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const size = 500;
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(file);
          canvas.width = size;
          canvas.height = size;

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, size, size);

          const scale = Math.min(size / img.width, size / img.height);
          const scaledW = img.width * scale;
          const scaledH = img.height * scale;
          const offsetX = (size - scaledW) / 2;
          const offsetY = (size - scaledH) / 2;

          ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(
                  new File([blob], file.name, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  }),
                );
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            0.9,
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("حجم الصورة يجب ألا يتجاوز 5 ميجابايت", "error");
      return;
    }
    try {
      const squareFile = await letterboxToSquare(file);
      if (logoUrlRef.current) {
        URL.revokeObjectURL(logoUrlRef.current);
      }
      const newUrl = URL.createObjectURL(squareFile);
      logoUrlRef.current = newUrl;
      setForm((prev) => ({
        ...prev,
        logoUrl: newUrl,
      }));
      showToast("تم تحديث الشعار بنجاح", "success");
    } catch {
      showToast("خطأ أثناء معالجة الشعار", "error");
    }
  };

  const handleCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("حجم الصورة يجب ألا يتجاوز 5 ميجابايت", "error");
      return;
    }
    if (coverUrlRef.current) {
      URL.revokeObjectURL(coverUrlRef.current);
    }
    const newUrl = URL.createObjectURL(file);
    coverUrlRef.current = newUrl;
    setForm((prev) => ({ ...prev, coverUrl: newUrl }));
    showToast("تم تحديث غلاف المتجر بنجاح", "success");
  };

  const handleInputChange = (
    key: keyof Omit<
      StoreProfileInput,
      "logoFile" | "coverFile" | "operatingHours"
    >,
    value: unknown,
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleHourChange = (
    day: DayKey,
    field: "openTime" | "closeTime",
    value: string,
  ) => {
    setForm((prev) => {
      const dayHours = { ...prev.operatingHours[day], [field]: value };
      return {
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [day]: dayHours || {
            openTime: "08:00",
            closeTime: "17:00",
            closed: false,
          },
        },
      };
    });
  };

  const handleClosedToggle = (day: DayKey) => {
    setForm((prev) => {
      const dayHours = {
        ...prev.operatingHours[day],
        closed: !prev.operatingHours[day]?.closed,
      };
      return {
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [day]: dayHours || {
            openTime: "08:00",
            closeTime: "17:00",
            closed: true,
          },
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationResult = storeProfileSchema.safeParse(form);
    if (!validationResult.success) {
      const fieldErrors: Partial<Record<string, string>> = {};
      validationResult.error.issues.forEach((issue) => {
        fieldErrors[issue.path.join(".")] = issue.message;
      });
      setErrors(fieldErrors);
      showToast("يرجى التحقق من البيانات المدخلة", "error");
      return;
    }

    const result = await updateStoreProfile(form);
    if (result.error) {
      showToast(result.error, "error");
    } else if (result.data) {
      showToast("تم حفظ إعدادات المتجر بنجاح", "success");
      onSaveSuccess(result.data.lastUpdated);
    }
  };

  return (
    <form
      id="store-profile-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 pb-16"
      noValidate
    >
      {/* 1. Brand Identity */}
      <ProfileIdentitySection
        logoUrl={form.logoUrl}
        coverUrl={form.coverUrl}
        logoInputRef={logoInputRef}
        coverInputRef={coverInputRef}
        onLogoUpload={handleLogoUpload}
        onCoverUpload={handleCoverUpload}
      />

      {/* 2 & 3. General & Contact Details */}
      <ProfileGeneralSection
        form={form}
        errors={errors}
        onInputChange={handleInputChange}
      />

      {/* 4. Operating Hours Section */}
      <ProfileHoursSection
        operatingHours={form.operatingHours}
        errors={errors}
        onHourChange={handleHourChange}
        onClosedToggle={handleClosedToggle}
      />

      {/* 5. AI Pricing Section */}
      <ProfileAutomationSection
        form={form}
        errors={errors}
        onInputChange={handleInputChange}
      />

      {/* 6. Delivery Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 flex flex-col gap-2">
          <Heading level="md" className="text-primary font-bold">
            خيارات التوصيل والاستلام
          </Heading>
          <Text
            variant="body-md"
            className="text-on-surface-variant leading-relaxed"
          >
            إعداد خدمة التوصيل وتوفير شروط خاصة بها للعملاء.
          </Text>
        </div>

        <div className="lg:col-span-2">
          <Card.Root className="border border-outline-variant/40 bg-surface-container-lowest rounded-xl shadow-sm">
            <Card.Body className="p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-container-low border border-outline-variant/60">
                <input
                  type="checkbox"
                  id="arrangeDelivery"
                  name="arrangeDelivery"
                  checked={form.arrangeDelivery}
                  onChange={(e) =>
                    handleInputChange("arrangeDelivery", e.target.checked)
                  }
                  className="h-5 w-5 accent-primary mt-1 cursor-pointer"
                />
                <div className="flex flex-col">
                  <label
                    htmlFor="arrangeDelivery"
                    className="text-body-md font-semibold text-on-surface cursor-pointer"
                  >
                    أقوم بتوفير خدمة التوصيل الخاصة بي
                  </label>
                  <span className="text-label-md text-on-surface-variant">
                    تعتمد منصة FoodLoop افتراضياً على استلام العميل من المتجر،
                    قم بالتفعيل في حال رغبتك بتوفير خدمة التوصيل.
                  </span>
                </div>
              </div>

              {form.arrangeDelivery && (
                <Field.Root invalid={!!errors.deliveryNotes}>
                  <Field.Label className="font-semibold text-primary">
                    شروط أو ملاحظات التوصيل
                  </Field.Label>
                  <textarea
                    name="deliveryNotes"
                    rows={3}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-3 text-body-md text-on-surface outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all resize-none"
                    placeholder="مثال: نقوم بالتوصيل داخل محيط المعادي بسعر ثابت 20 ج.م…"
                    value={form.deliveryNotes}
                    onChange={(e) =>
                      handleInputChange("deliveryNotes", e.target.value)
                    }
                  />
                  {errors.deliveryNotes && (
                    <Field.Error>{errors.deliveryNotes}</Field.Error>
                  )}
                </Field.Root>
              )}
            </Card.Body>
          </Card.Root>
        </div>
      </div>

      {/* Hidden button to hook standard form submit associations */}
      <button type="submit" className="hidden" />
    </form>
  );
}
