"use client";

import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { MapPinIcon } from "@/components/icons/map-pin-icon";
import { InfoCircleIcon } from "@/components/icons/info-circle-icon";
import {
  locationSettingsSchema,
  type LocationSettingsInput,
} from "../lib/schemas";
import { type LocationFormProps } from "../lib/types";
import { EGYPTIAN_GOVERNORATES } from "../lib/constants";
import { useAppStore } from "@/store/use-app-store";
import { updateMyStoreLocation } from "../api/stores-api";
import { invalidateStoreResource } from "../api/store-resource";
import { LocationMapPreview } from "./location-map-preview";

export function LocationForm({
  initialData,
  onSaveSuccess,
  showToast,
}: LocationFormProps) {
  const accessToken = useAppStore((state) => state.accessToken);
  const [form, setForm] = useState<LocationSettingsInput>({
    governorate: initialData.governorate,
    city: initialData.city,
    cityArea: initialData.cityArea,
    streetAddress: initialData.streetAddress,
    buildingDetails: initialData.buildingDetails,
    postalCode: initialData.postalCode || "",
    latitude: initialData.latitude,
    longitude: initialData.longitude,
    deliveryRadius: initialData.deliveryRadius || 8,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof LocationSettingsInput, string>>
  >({});
  const [pinPlaced, setPinPlaced] = useState<boolean>(
    initialData.latitude !== 0 && initialData.longitude !== 0,
  );

  const handleLocationSelect = (lat: number, lng: number) => {
    setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    setPinPlaced(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.latitude;
      delete next.longitude;
      return next;
    });
  };

  const handleClearPin = () => {
    setForm((prev) => ({ ...prev, latitude: 0, longitude: 0 }));
    setPinPlaced(false);
    showToast(
      "تم إلغاء تحديد الموقع، يرجى النقر على الخريطة لوضع الدبوس",
      "error",
    );
  };

  const handleInputChange = (
    key: keyof LocationSettingsInput,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!pinPlaced || form.latitude === 0 || form.longitude === 0) {
      setErrors((prev) => ({
        ...prev,
        latitude: "يجب تحديد موقع متجرك على الخريطة قبل الحفظ",
        longitude: "يجب تحديد موقع متجرك على الخريطة قبل الحفظ",
      }));
      showToast("يرجى تأكيد موقعك الجغرافي على الخريطة أولاً", "error");
      return;
    }

    const validationResult = locationSettingsSchema.safeParse(form);
    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof LocationSettingsInput, string>> =
        {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof LocationSettingsInput;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      showToast("يرجى التحقق من البيانات المدخلة", "error");
      return;
    }

    if (!accessToken) {
      showToast("يجب تسجيل الدخول لحفظ موقع المتجر", "error");
      return;
    }

    const result = await updateMyStoreLocation({
      governorate: form.governorate,
      city: form.city,
      neighborhood: form.cityArea,
      street: form.streetAddress,
      latitude: form.latitude,
      longitude: form.longitude,
    });

    if (result.error) {
      showToast(result.error, "error");
    } else if (result.data) {
      invalidateStoreResource();
      showToast("تم حفظ موقع المتجر بنجاح", "success");
      onSaveSuccess(new Date().toISOString());
    }
  };

  return (
    <form
      id="location-settings-form"
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-8 pb-16"
      noValidate
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4 w-full">
          <Card.Root className="border border-outline-variant/40 bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden relative">
            <LocationMapPreview
              latitude={form.latitude}
              longitude={form.longitude}
              deliveryRadius={form.deliveryRadius}
              pinPlaced={pinPlaced}
              onLocationSelect={handleLocationSelect}
              onClearPin={handleClearPin}
              showToast={showToast}
            />
          </Card.Root>
          {errors.latitude && (
            <div className="p-3.5 bg-error-container/20 border border-error-container/40 rounded-xl text-error text-body-md font-bold">
              {errors.latitude}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 w-full">
          <Card.Root className="border border-outline-variant/40 bg-surface-container-lowest rounded-2xl shadow-sm">
            <Card.Body className="p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                <MapPinIcon className="h-5.5 w-5.5 text-primary" />
                <Heading level="md" className="text-primary font-bold">
                  تفاصيل العنوان
                </Heading>
              </div>

              <div className="flex flex-col gap-4">
                <Field.Root invalid={!!errors.streetAddress}>
                  <Field.Label className="font-semibold text-on-surface">
                    الشارع
                  </Field.Label>
                  <Field.Control
                    name="streetAddress"
                    placeholder="مثال: شارع 9، أمام محطة مترو المعادي"
                    value={form.streetAddress}
                    onChange={(e) =>
                      handleInputChange("streetAddress", e.target.value)
                    }
                    className="rounded-xl border border-outline-variant p-3 mt-1 w-full"
                  />
                  {errors.streetAddress && (
                    <Field.Error>{errors.streetAddress}</Field.Error>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.buildingDetails}>
                  <Field.Label className="font-semibold text-on-surface">
                    رقم المبنى / المحل / العلامات المميزة
                  </Field.Label>
                  <Field.Control
                    name="buildingDetails"
                    placeholder="مثال: برج الزهور، الدور الأرضي، محل 3"
                    value={form.buildingDetails}
                    onChange={(e) =>
                      handleInputChange("buildingDetails", e.target.value)
                    }
                    className="rounded-xl border border-outline-variant p-3 mt-1 w-full"
                  />
                  {errors.buildingDetails && (
                    <Field.Error>{errors.buildingDetails}</Field.Error>
                  )}
                </Field.Root>

                <div className="grid grid-cols-2 gap-4">
                  <Field.Root invalid={!!errors.city}>
                    <Field.Label className="font-semibold text-on-surface">
                      المدينة
                    </Field.Label>
                    <Field.Control
                      name="city"
                      placeholder="مثال: القاهرة"
                      value={form.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className="rounded-xl border border-outline-variant p-3 mt-1 w-full"
                    />
                    {errors.city && <Field.Error>{errors.city}</Field.Error>}
                  </Field.Root>

                  <Field.Root invalid={!!errors.cityArea}>
                    <Field.Label className="font-semibold text-on-surface">
                      الحي / المنطقة
                    </Field.Label>
                    <Field.Control
                      name="cityArea"
                      placeholder="مثال: المعادي"
                      value={form.cityArea}
                      onChange={(e) =>
                        handleInputChange("cityArea", e.target.value)
                      }
                      className="rounded-xl border border-outline-variant p-3 mt-1 w-full"
                    />
                    {errors.cityArea && (
                      <Field.Error>{errors.cityArea}</Field.Error>
                    )}
                  </Field.Root>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field.Root invalid={!!errors.governorate}>
                    <Field.Label className="font-semibold text-on-surface">
                      المحافظة
                    </Field.Label>
                    <Field.Select
                      name="governorate"
                      value={form.governorate}
                      onChange={(e) =>
                        handleInputChange("governorate", e.target.value)
                      }
                      className="rounded-xl border border-outline-variant p-3 mt-1 w-full bg-surface-container-lowest"
                    >
                      <option value="" disabled>
                        اختر…
                      </option>
                      {EGYPTIAN_GOVERNORATES.map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </Field.Select>
                    {errors.governorate && (
                      <Field.Error>{errors.governorate}</Field.Error>
                    )}
                  </Field.Root>

                  <Field.Root invalid={!!errors.postalCode}>
                    <Field.Label className="font-semibold text-on-surface">
                      الرمز البريدي (اختياري)
                    </Field.Label>
                    <Field.Control
                      name="postalCode"
                      placeholder="مثال: 11728"
                      value={form.postalCode || ""}
                      maxLength={5}
                      onChange={(e) =>
                        handleInputChange("postalCode", e.target.value)
                      }
                      className="rounded-xl border border-outline-variant p-3 mt-1 w-full"
                    />
                    {errors.postalCode && (
                      <Field.Error>{errors.postalCode}</Field.Error>
                    )}
                  </Field.Root>
                </div>
              </div>
            </Card.Body>
          </Card.Root>

          <Card.Root className="border border-outline-variant/40 bg-surface-container-lowest rounded-2xl shadow-sm">
            <Card.Body className="p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-primary/10 text-primary">
                    <svg
                      className="h-5.5 w-5.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </span>
                  <Heading level="md" className="text-primary font-bold">
                    نطاق التوصيل
                  </Heading>
                </div>
                <span className="px-2.5 py-1 bg-primary-fixed-dim/25 text-primary text-label-md font-bold rounded-lg border border-primary/10">
                  {form.deliveryRadius.toFixed(1)} كم
                </span>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <span className="text-body-md font-semibold text-on-surface">
                  حدد مسافة التغطية للنشاط
                </span>
                <div className="relative w-full pt-6 pb-2">
                  <div
                    className="absolute top-0 bg-primary text-on-primary text-[11px] font-bold px-2 py-0.75 rounded-md shadow-sm after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-primary transition-all duration-150 pointer-events-none"
                    style={{
                      right: `${((form.deliveryRadius - 1) / 29) * 100}%`,
                      transform: "translateX(50%)",
                    }}
                  >
                    {form.deliveryRadius} كم
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={form.deliveryRadius}
                    onChange={(e) =>
                      handleInputChange(
                        "deliveryRadius",
                        Number(e.target.value),
                      )
                    }
                    className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[11px] text-outline mt-1.5 font-bold">
                    <span>1 كم</span>
                    <span>15 كم</span>
                    <span>30 كم</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 p-3.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface-variant text-label-md leading-relaxed mt-2">
                <InfoCircleIcon className="h-5 w-5 text-outline shrink-0 mt-0.5" />
                <span>
                  زيادة نطاق التوصيل قد تزيد من تكاليف التوصيل المترتبة على
                  عملائك، ولكنها توسع انتشار متجرك للوصول إلى عدد أكبر من
                  المستهلكين المهتمين.
                </span>
              </div>
            </Card.Body>
          </Card.Root>
        </div>
      </div>

      <button type="submit" className="hidden" />
    </form>
  );
}
