/**
 * Automatic Arabic Localization Mapping Helper for Admin Portal Data
 */

const ARABIC_MAPPINGS: Record<string, string> = {
  // Consumer / User Names
  "Benjamin Thorne": "بنيامين ثورن",
  "Elena Lucero": "إيلينا لوسيرو",
  "Miriam G. Vance": "مريم فانس",
  "Hana Kim": "هناء كيم",
  "Derek O'Brian": "ديريك أوبراين",
  "Aly Soliman": "علي سليمان",
  "Farida Hegazi": "فريدة حجازي",

  // Store Names
  "El Abd Bakery": "مخبز العبد",
  "Metro Market": "مترو ماركت",
  "Gourmet Egypt": "جورميه مصر",
  "Seoudi Supermarket": "سوبرماركت السعودي",
  "Fathallah Market": "فتحة الله ماركت",

  // Charity Names
  "Resala Charity": "جمعية رسالة الخيرية",
  "Egyptian Food Bank": "بنك الطعام المصري",
  "Orman Association": "جمعية الأورمان",

  // Locations
  "Zamalek, Cairo": "الزمالك، القاهرة",
  "Maadi, Cairo": "المعادي، القاهرة",
  "Heliopolis, Cairo": "مصر الجديدة، القاهرة",
  "Tagamoa, New Cairo": "التجمع، القاهرة الجديدة",
  "Dokki, Giza": "الدقي، الجيزة",
  "Sidi Gaber, Alexandria": "سيدي جابر، الإسكندرية",
  "Nasr City, Cairo": "مدينة نصر، القاهرة",
  "Downtown, Cairo": "وسط البلد، القاهرة",
  "Smouha, Alexandria": "سموحة، الإسكندرية",
  "Third Settlement, New Cairo": "التجمع الثالث، القاهرة الجديدة",
  "Giza Square, Giza": "ميدان الجيزة، الجيزة",
  "Portland, OR – Zone 4A": "المنطقة 4أ - بورتلاند",

  // Last Active / Joined Dates
  "2 mins ago": "منذ دقيقتين",
  "14 days ago": "منذ 14 يوماً",
  "Just now": "الآن",
  Never: "لم ينشط بعد",
  "1 hour ago": "منذ ساعة",
  "12 hours ago": "منذ 12 ساعة",
  "3 days ago": "منذ 3 أيام",
  "8 days ago": "منذ 8 أيام",
  "5 mins ago": "منذ 5 دقائق",
  "2 hours ago": "منذ ساعتين",
  "2 days ago": "منذ يومين",
  "1 day ago": "منذ يوم واحد",
  "4 hours ago": "منذ 4 ساعات",

  // Flag Reasons
  "Inappropriate language / Abusive report": "لغة غير لائقة / بلاغ إساءة",
  "Potential health hazard claim review required":
    "ادعاء وجود خطر صحي - يتطلب المراجعة",

  // Review Comments
  "The donuts box was squashed and some donuts were missing.":
    "كانت علبة الدوناتس مضغوطة وكان هناك بعض القطع مفقودة.",
  "Sold me dairy products that expired 2 days ago! Unacceptable.":
    "تم بيع منتجات ألبان منتهية الصلاحية منذ يومين! أمر غير مقبول.",
  "Excellent bag! Got a huge variety of cheese and baked goods for only 90 EGP instead of 300.":
    "حقيبة ممتازة! حصلت على تشكيلة كبيرة من الأجبان والمخبوزات بـ 90 ج.م فقط بدلاً من 300.",

  // Support Tickets
  "Payment failure during checkout": "فشل عملية الدفع عند الخروج",
  "I tried purchasing a food loop bag from El Abd Bakery, but the app crashed on the payment page and the money was deducted from my InstaPay, but no order was generated.":
    "حاولت شراء حقيبة فود لوب من مخبز العبد، ولكن التطبيق توقف عند صفحة الدفع وتم خصم المبلغ من إنستاباي دون إنشاء الطلب.",
  "Unable to update inventory": "غير قادر على تحديث المخزون",
  "The bulk inventory upload feature is throwing a 500 Server Error when we upload our Excel spreadsheet of surplus products.":
    "خاصية رفع المخزون بالجملة تعرض خطأ 500 بالسيرفر عند رفع ملف الإكسيل للمنتجات الفائضة.",
  "Here is the transaction screenshot: Instapay ref #339102":
    "إليك صورة عملية الدفع: مرجع إنستاباي #339102",
  "Hello! We are looking into your upload template. Please ensure the dates are formatted as YYYY-MM-DD.":
    "أهلاً بك! نحن نراجع نموذج الرفع الخاص بك. يرجى التأكد من تنسيق التواريخ كـ YYYY-MM-DD.",
  "Thanks, we confirmed they are in that format. What else can it be?":
    "شكراً، تأكدنا أنها بهذا التنسيق. ماذا يمكن أن تكون المشكلة أيضاً؟",

  // Admin Logs
  "Admin Sarah": "أدمن سارة",
  "Admin Mike": "أدمن مايك",
  System: "النظام الآلي",
  "Suspended consumer C-12983": "تعليق حساب المستهلك C-12983",
  "Auto-verified 42 consumers": "توثيق تلقائي لـ 42 مستهلكاً",
  "Updated rules for Maadi": "تحديث القواعد لمنطقة المعادي",
  "Verified store S-50192 (El Abd Bakery)": "توثيق متجر S-50192 (مخبز العبد)",
  "Resolved support ticket TKT-439": "حل تذكرة الدعم TKT-439",
  "Abusive behavior in chat": "سلوك غير لائق في المحادثات",
  "Set max limits to 120": "تحديد الحد الأقصى عند 120",

  // Account Roles & Statuses
  Consumer: "مستهلك",
  Store: "متجر شريك",
  Charity: "جمعية خيرية",
  ACTIVE: "نشط",
  SUSPENDED: "معلق",
  PENDING: "قيد المراجعة",
  Open: "مفتوحة",
  Closed: "مغلقة",
  High: "عالية",
  Medium: "متوسطة",
  Low: "منخفضة",
};

/**
 * Localizes a string to Arabic if isRtl is active, otherwise returns the original text.
 */
export function arText(
  text: string | undefined | null,
  isRtl: boolean = true,
): string {
  if (!text) return "";
  if (!isRtl) return text;
  return ARABIC_MAPPINGS[text.trim()] || text;
}
