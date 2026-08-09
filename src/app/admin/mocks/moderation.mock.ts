/**
 * TEMPORARY MOCK DATA
 * This file contains mock data used for Admin Portal Moderation Queue endpoints while real backend endpoints are pending.
 * Remove this file once corresponding backend endpoints are fully live.
 */

import { ModerationItem } from "../types/admin.types";

export const SAMPLE_MODERATION_ITEMS: ModerationItem[] = [
  {
    id: "mod-1",
    productNameAr: "عسل الجبل البري الذهبي",
    productNameEn: "Wildflower Gold Honey",
    storeNameAr: "مزرعة المروج الخضراء",
    storeNameEn: "Sun-Drenched Meadows Farm",
    imageUrl:
      "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=600&auto=format&fit=crop",
    aiConfidence: 65,
    flags: ["user_report", "unverified_origin"],
    flagReasonQuoteAr:
      "أبلغ أحد المستخدمين عن احتمال وجود معلومات مضللة بشأن حالة شهادة العضوية.",
    flagReasonQuoteEn:
      "User reported possible misleading labeling regarding organic certification status.",
    createdAt: "2026-08-05T10:15:00Z",
  },
  {
    id: "mod-2",
    productNameAr: "خبز التخمير الطبيعي اليدوي",
    productNameEn: "Artisan Heritage Sourdough",
    storeNameAr: "مخبز الحقل والفرن",
    storeNameEn: "Hearth & Soil Bakery",
    imageUrl:
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop",
    aiConfidence: 32,
    flags: ["low_ai_confidence", "duplicate_listing"],
    flagReasonQuoteAr:
      "رصد الذكاء الاصطناعي تشابهاً عالياً مع القائمة رقم #4928 من نفس البائع. احتمال محتوى مكرر.",
    flagReasonQuoteEn:
      "AI flagged high similarity to listing #4928 from the same vendor. Possible spam.",
    createdAt: "2026-08-05T11:00:00Z",
  },
  {
    id: "mod-3",
    productNameAr: "فراولة طازجة عضوية ممتاز",
    productNameEn: "Fresh Organic Strawberries",
    storeNameAr: "عضويات وادي النيل",
    storeNameEn: "Nile Valley Organics",
    imageUrl:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop",
    aiConfidence: 89,
    flags: ["low_ai_confidence"],
    flagReasonQuoteAr:
      "سعر الكيلو أقل بنسبة 40٪ من متوسط سعر السوق لفراولة الدرجة العضوية.",
    flagReasonQuoteEn:
      "Price per kg is 40% below market average for organic grade strawberries.",
    createdAt: "2026-08-05T12:30:00Z",
  },
  {
    id: "mod-4",
    productNameAr: "جبن ماعز بالأعشاب الريفية",
    productNameEn: "Herbed Goat Cheese",
    storeNameAr: "أجبان الفيوم الريفية",
    storeNameEn: "Fayoum Dairy Artisans",
    imageUrl:
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop",
    aiConfidence: 71,
    flags: ["user_report", "duplicate_listing"],
    flagReasonQuoteAr:
      "تبدو صورة الغلاف مستخدمة سابقاً في قائمة منتهية الصلاحية.",
    flagReasonQuoteEn:
      "Packaging photo appears reused from a previous expired listing.",
    createdAt: "2026-08-05T13:45:00Z",
  },
];

export let mockModerationStore: ModerationItem[] = [...SAMPLE_MODERATION_ITEMS];

export function resetMockModerationStore(): ModerationItem[] {
  mockModerationStore = [...SAMPLE_MODERATION_ITEMS];
  return mockModerationStore;
}

export function filterMockModerationItem(id: string): void {
  mockModerationStore = mockModerationStore.filter((item) => item.id !== id);
}
