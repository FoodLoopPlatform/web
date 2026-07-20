import { z } from "zod";

const egyptianPhoneRegex = /^01[0125]\d{8}$/;

export const businessSignupFieldSchema = z.object({
  storeName: z.string().trim().min(1, "اسم المتجر مطلوب"),
  businessType: z.string().min(1, "يرجى اختيار نوع النشاط التجاري"),
  ownerName: z.string().trim().min(2, "اسم المالك يجب ان يكون على الأقل حرفين"),
  phone: z.string().trim().regex(egyptianPhoneRegex, "رقم الهاتف غير صحيح"),
  email: z.string().trim().email("يرجى إدخال بريد إلكتروني صالح"),
  password: z.string().min(8, "يجب ألا تقل كلمة المرور عن 8 أحرف"),
  confirmPassword: z.string().min(1, "يرجى تأكيد كلمة المرور"),
});

export const businessSignupSchema = businessSignupFieldSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  },
);

export type BusinessSignupInput = z.infer<typeof businessSignupSchema>;
export type BusinessSignupField = keyof z.infer<
  typeof businessSignupFieldSchema
>;

export const documentUploadSchema = z.object({
  commercialRegistration: z.instanceof(File, {
    message: "يرجى إرفاق السجل التجاري",
  }),
  taxId: z.instanceof(File, { message: "يرجى إرفاق شهادة الرقم الضريبي" }),
  storePhoto: z.instanceof(File, { message: "يرجى إرفاق صورة المتجر" }),
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
