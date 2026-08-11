export const statusMap: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  published: {
    bg: "bg-primary-fixed text-primary border-primary/20",
    label: "نشط (تم النشر)",
    text: "text-primary",
  },
  active: {
    bg: "bg-primary-fixed text-primary border-primary/20",
    label: "نشط",
    text: "text-primary",
  },
  pending: {
    bg: "bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary/20",
    label: "قيد المراجعة",
    text: "text-on-tertiary-fixed-variant",
  },
  draft: {
    bg: "bg-surface-container-highest text-on-surface-variant border-outline-variant/40",
    label: "مسودة",
    text: "text-on-surface-variant",
  },
  "out of stock": {
    bg: "bg-error-container text-error border-error/20",
    label: "نفد من المخزون",
    text: "text-error",
  },
  outofstock: {
    bg: "bg-error-container text-error border-error/20",
    label: "نفد من المخزون",
    text: "text-error",
  },
};

export const expiryVerificationConfig: Record<
  string,
  { bg: string; label: string; tooltipText: string }
> = {
  AiVerified: {
    bg: "bg-primary text-white border-primary/30 shadow-xs",
    label: "مُحقق بالذكاء الاصطناعي",
    tooltipText:
      "AiVerified: تم التحقق من تاريخ الصلاحية بدقة بالذكاء الاصطناعي",
  },
  AiLowConfidence: {
    bg: "bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary/30 shadow-xs",
    label: "ذكاء اصطناعي (ثقة منخفضة)",
    tooltipText: "AiLowConfidence: استخراج تاريخ الصلاحية ثقته منخفضة",
  },
};
