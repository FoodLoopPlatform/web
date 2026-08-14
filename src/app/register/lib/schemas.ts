import { z } from "zod";

const egyptianPhoneRegex = /^01[0125]\d{8}$/;

export const businessSignupFieldSchema = z.object({
  storeName: z.string().trim().min(1, "اسم المتجر مطلوب"),
  businessType: z.string().min(1, "يرجى اختيار نوع النشاط التجاري"),
  ownerName: z.string().trim().min(2, "اسم المالك يجب ان يكون على الأقل حرفين"),
  phone: z.string().trim().regex(egyptianPhoneRegex, "رقم الهاتف غير صحيح"),
  email: z.string().trim().email("يرجى إدخال بريد إلكتروني صالح"),
  password: z
    .string()
    .min(8, "يجب ألا تقل كلمة المرور عن 8 أحرف")
    .regex(
      /[a-z]/,
      "يجب أن تحتوي كلمة المرور على حرف إنجليزي صغير واحد على الأقل",
    )
    .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل"),
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

export const storeDocumentUploadSchema = z.object({
  commercialRegistration: z.instanceof(File, {
    message: "يرجى إرفاق السجل التجاري",
  }),
  taxId: z.instanceof(File, { message: "يرجى إرفاق شهادة الرقم الضريبي" }),
  storePhoto: z.instanceof(File, { message: "يرجى إرفاق صورة المتجر" }),
});

export type StoreDocumentUploadInput = z.infer<
  typeof storeDocumentUploadSchema
>;

/** Backend `Type` value (POST /stores/me/documents) for each store document field. */
export const storeDocumentTypeMap: Record<
  keyof StoreDocumentUploadInput,
  string
> = {
  commercialRegistration: "CommercialRegistration",
  taxId: "TaxIdCertificate",
  storePhoto: "StoreFacilityPhoto",
};

export const charityDocumentUploadSchema = z.object({
  declarationDecree: z.instanceof(File, {
    message: "يرجى إرفاق قرار الاشهار",
  }),
  boardMembersList: z.instanceof(File, {
    message: "يرجى إرفاق كشف اسماء مجلس الادارة",
  }),
  bylaws: z.instanceof(File, {
    message: "يرجى إرفاق النظام الاساسي للجمعية",
  }),
});

export type CharityDocumentUploadInput = z.infer<
  typeof charityDocumentUploadSchema
>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("يرجى إدخال بريد إلكتروني صالح"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordFieldSchema = z.object({
  newPassword: z
    .string()
    .min(8, "يجب ألا تقل كلمة المرور عن 8 أحرف")
    .max(100, "يجب ألا تزيد كلمة المرور عن 100 حرف")
    .regex(
      /[a-z]/,
      "يجب أن تحتوي كلمة المرور على حرف إنجليزي صغير واحد على الأقل",
    )
    .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل"),
  confirmPassword: z.string().min(1, "يرجى تأكيد كلمة المرور"),
});

export const resetPasswordSchema = resetPasswordFieldSchema.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  },
);

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/** Backend `Type` value (POST /charities/me/documents) for each charity document field. */
export const charityDocumentTypeMap: Record<
  keyof CharityDocumentUploadInput,
  string
> = {
  declarationDecree: "AssociationCertificate",
  boardMembersList: "BoardOfDirectorsList",
  bylaws: "CharityBylaws",
};
