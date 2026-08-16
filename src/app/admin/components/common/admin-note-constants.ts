export interface NoteTemplate {
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  cat: "INFO" | "WARNING" | "URGENT" | "INTERNAL";
}

export const PRESET_TEMPLATES: NoteTemplate[] = [
  {
    titleEn: "Document Verification Request",
    titleAr: "طلب استكمال مستندات التوثيق",
    bodyEn:
      "Please upload your official updated tax registration and commercial license to maintain active store status.",
    bodyAr:
      "برجاء رفع صورة السجل التجاري والبطاقة الضريبية المحدثة لإعادة توثيق الحساب والسيطرة على العروض.",
    cat: "WARNING",
  },
  {
    titleEn: "Food Bag Surplus Alert",
    titleAr: "تنبيه استلام شحنة طعام فائض",
    bodyEn:
      "New batch of fresh surplus food bags available for pickup at regional distribution hub.",
    bodyAr:
      "تتوفر شحنة طعام طازجة جاهزة للاستلام فوراً من المركز الإقليمي لتوزيع التبرعات.",
    cat: "URGENT",
  },
  {
    titleEn: "Account Loyalty Bonus",
    titleAr: "مكافأة تميز وحساب نشط",
    bodyEn:
      "Congratulations on completing 20+ food saving operations! Digital voucher attached.",
    bodyAr:
      "تهانينا للوصول لـ ٢٠ عملية إنقاذ طعام ناجحة! تم إضافة قسيمة خصم تشجيعية في حسابك.",
    cat: "INFO",
  },
  {
    titleEn: "Internal Moderation Note",
    titleAr: "ملاحظة تدقيق إدارية داخلية",
    bodyEn:
      "Account under routine review by compliance team due to multiple pricing adjustments.",
    bodyAr:
      "الحساب قيد المراجعة الروتينية بواسطة فريق الإدارة بسبب تعديلات متكررة على تسعير الوجبات.",
    cat: "INTERNAL",
  },
];

export const CATEGORY_STYLES = {
  INFO: {
    labelEn: "Notice",
    labelAr: "تنويه عام",
    badge: "bg-emerald-50/60 text-emerald-700 border-emerald-200/70",
    activePill:
      "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold shadow-2xs",
  },
  WARNING: {
    labelEn: "Warning",
    labelAr: "تحذير هام",
    badge: "bg-amber-50/60 text-amber-700 border-amber-200/70",
    activePill:
      "bg-amber-100 text-amber-900 border-amber-300 font-extrabold shadow-2xs",
  },
  URGENT: {
    labelEn: "Urgent",
    labelAr: "عاجل جداً",
    badge: "bg-red-50/60 text-red-700 border-red-200/70",
    activePill:
      "bg-red-100 text-red-900 border-red-300 font-extrabold shadow-2xs",
  },
  INTERNAL: {
    labelEn: "Internal",
    labelAr: "ملاحظة داخلية",
    badge: "bg-slate-50 text-slate-600 border-slate-200",
    activePill:
      "bg-slate-200 text-slate-900 border-slate-300 font-extrabold shadow-2xs",
  },
};

export const ROLE_LABEL_MAP = {
  Consumer: { en: "Consumer", ar: "مستهلك", icon: "👤" },
  Store: { en: "Store", ar: "متجر", icon: "🏪" },
  Charity: { en: "Charity", ar: "جمعية", icon: "🤝" },
};
