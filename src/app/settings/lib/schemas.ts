import { z } from "zod";

const egyptianPhoneRegex = /^(01[0125]\d{8}|0[23456789]\d{7,8})$/;

export const businessTypesList = [
  { value: "Supermarket", label: "سوبرماركت" },
  { value: "Restaurant", label: "مطعم" },
  { value: "Bakery", label: "مخبز" },
  { value: "Café", label: "مقهى" },
  { value: "Hotel", label: "فندق" },
  { value: "Convenience Store", label: "محل بقالة" },
  { value: "Grocery Chain", label: "سلسلة محلات غذائية" },
  { value: "Other", label: "آخر" },
] as const;

export const dayKeys = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

export type DayKey = (typeof dayKeys)[number];

export const dayLabelsArabic: Record<DayKey, string> = {
  saturday: "السبت",
  sunday: "الأحد",
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
};

export const operatingHourSchema = z
  .object({
    openTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "تنسيق الوقت غير صحيح"),
    closeTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "تنسيق الوقت غير صحيح"),
    closed: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.closed) return true;
      return data.openTime !== data.closeTime;
    },
    {
      message: "يجب أن يختلف وقت الإغلاق عن وقت الفتح",
      path: ["closeTime"],
    },
  );

export const storeProfileSchema = z
  .object({
    businessName: z
      .string()
      .trim()
      .min(2, "يجب أن يكون اسم المتجر حرفين على الأقل")
      .max(100, "يجب ألا يتجاوز اسم المتجر 100 حرف"),
    logoUrl: z.string().optional(),
    logoFile: z
      .custom<File>()
      .optional()
      .nullable()
      .refine(
        (file) => {
          if (!file) return true;
          return file.size <= 5 * 1024 * 1024;
        },
        { message: "حجم الصورة يجب ألا يتجاوز 5 ميجابايت" },
      )
      .refine(
        (file) => {
          if (!file) return true;
          return ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
        },
        { message: "يقبل فقط صيغ JPG أو PNG" },
      ),
    coverUrl: z.string().optional(),
    coverFile: z
      .custom<File>()
      .optional()
      .nullable()
      .refine(
        (file) => {
          if (!file) return true;
          return file.size <= 5 * 1024 * 1024;
        },
        { message: "حجم الصورة يجب ألا يتجاوز 5 ميجابايت" },
      )
      .refine(
        (file) => {
          if (!file) return true;
          return ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
        },
        { message: "يقبل فقط صيغ JPG أو PNG" },
      ),
    businessType: z.string().min(1, "يرجى اختيار نوع النشاط التجاري"),
    description: z.string().max(300, "يجب ألا يتجاوز الوصف 300 حرف").optional(),
    phone: z
      .string()
      .trim()
      .regex(
        egyptianPhoneRegex,
        "رقم الهاتف غير صحيح (مطلوب رقم مصري أرضي أو محمول)",
      ),
    email: z.string().trim().email("يرجى إدخال بريد إلكتروني صالح"),
    preferredLanguage: z.enum(["ar"]),
    operatingHours: z.record(z.string(), operatingHourSchema),
    disableAutomation: z.boolean(),
    automationMode: z.enum(["manual", "assisted", "autonomous"]),
    maxDiscount: z
      .number()
      .min(1, "يجب أن تكون القيمة 1% على الأقل")
      .max(15, "الحد الأقصى للخصم المسموح به هو 15%"),
    priceFloorRule: z.enum(["cost", "custom"]),
    customFloorPercent: z
      .number()
      .min(10, "الحد الأدنى هو 10%")
      .max(90, "الحد الأقصى هو 90%"),
    suggestDonation: z.boolean(),
    arrangeDelivery: z.boolean(),
    deliveryNotes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.disableAutomation && data.automationMode === "autonomous") {
        return data.maxDiscount >= 1 && data.maxDiscount <= 15;
      }
      return true;
    },
    {
      message: "الحد الأقصى للخصم التلقائي المسموح به هو 15%",
      path: ["maxDiscount"],
    },
  )
  .refine(
    (data) => {
      if (
        !data.disableAutomation &&
        data.automationMode === "autonomous" &&
        data.priceFloorRule === "custom"
      ) {
        return data.customFloorPercent >= 10 && data.customFloorPercent <= 90;
      }
      return true;
    },
    {
      message: "يجب أن تكون النسبة المخصصة بين 10% و 90%",
      path: ["customFloorPercent"],
    },
  );

export type StoreProfileInput = z.infer<typeof storeProfileSchema>;

export const locationSettingsSchema = z.object({
  governorate: z.string().min(1, "يرجى اختيار المحافظة"),
  city: z.string().trim().min(2, "يرجى إدخال المدينة"),
  cityArea: z.string().trim().min(2, "يرجى إدخال الحي أو المنطقة"),
  streetAddress: z.string().trim().min(5, "يرجى إدخال اسم الشارع بالتفصيل"),
  buildingDetails: z
    .string()
    .trim()
    .min(2, "يرجى إدخال تفاصيل المبنى (رقم المبنى، الطابق، المحل)"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "الرمز البريدي يجب أن يتكون من 5 أرقام")
    .optional()
    .or(z.literal("")),
  latitude: z
    .number({ message: "يجب إدخال إحداثيات خط العرض" })
    .min(22, "يجب أن تكون الإحداثيات داخل حدود جمهورية مصر العربية (شمالاً)")
    .max(32, "يجب أن تكون الإحداثيات داخل حدود جمهورية مصر العربية (شمالاً)"),
  longitude: z
    .number({ message: "يجب إدخال إحداثيات خط الطول" })
    .min(25, "يجب أن تكون الإحداثيات داخل حدود جمهورية مصر العربية (شرقاً)")
    .max(37, "يجب أن تكون الإحداثيات داخل حدود جمهورية مصر العربية (شرقاً)"),
  deliveryRadius: z
    .number()
    .min(1, "يجب أن يكون نطاق التوصيل 1 كم على الأقل")
    .max(30, "الحد الأقصى لنطاق التوصيل هو 30 كم"),
});

export type LocationSettingsInput = z.infer<typeof locationSettingsSchema>;
