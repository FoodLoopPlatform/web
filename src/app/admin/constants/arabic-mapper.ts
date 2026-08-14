/**
 * Dynamic System Localization Helper for Real API Data & UI Elements.
 * Translates system roles, statuses, relative time, locations, and ISO dates dynamically
 * without depending on hardcoded mock user/store names.
 */

const SYSTEM_TERMS: Record<string, string> = {
  // System Roles & Statuses
  Consumer: "مستهلك",
  Store: "متجر شريك",
  Charity: "جمعية خيرية",
  ACTIVE: "نشط",
  SUSPENDED: "معلق",
  PENDING: "قيد المراجعة",
  Verified: "موثق",
  Unverified: "غير موثق",
  Open: "مفتوحة",
  Closed: "مغلقة",
  Pending: "قيد الانتظار",
  High: "عالية",
  Medium: "متوسطة",
  Low: "منخفضة",

  // Relative Time & System Activity
  Recently: "مؤخراً",
  "Just now": "الآن",
  Never: "لم ينشط بعد",
  Today: "اليوم",
  Yesterday: "أمس",
};

const MONTHS_AR: Record<string, string> = {
  Jan: "يناير",
  Feb: "فبراير",
  Mar: "مارس",
  Apr: "أبريل",
  May: "مايو",
  Jun: "يونيو",
  Jul: "يوليو",
  Aug: "أغسطس",
  Sep: "سبتمبر",
  Oct: "أكتوبر",
  Nov: "نوفمبر",
  Dec: "ديسمبر",
};

/**
 * Dynamically localizes system strings, dates, and relative time for real API data.
 * If text is already in Arabic (returned by localized backend APIs), it is returned directly.
 */
export function arText(
  text: string | undefined | null,
  isRtl: boolean = true,
): string {
  if (!text) return "";
  if (!isRtl) return text;

  const trimmed = text.trim();

  // 1. Direct System Terms Lookup
  if (SYSTEM_TERMS[trimmed]) {
    return SYSTEM_TERMS[trimmed];
  }

  // 2. Dynamic Relative Time ("X mins ago", "X hours ago", "X days ago")
  const relativeTimeMatch = trimmed.match(
    /^(\d+)\s+(min|mins|hour|hours|day|days)\s+ago$/i,
  );
  if (relativeTimeMatch) {
    const amount = relativeTimeMatch[1];
    const unit = relativeTimeMatch[2].toLowerCase();
    if (unit.startsWith("min")) return `منذ ${amount} دقيقة`;
    if (unit.startsWith("hour")) return `منذ ${amount} ساعة`;
    if (unit.startsWith("day")) return `منذ ${amount} يوم`;
  }

  // 3. Dynamic Customer Prefix ("Customer 123..." -> "مستهلك 123...")
  if (trimmed.includes("Customer")) {
    return trimmed.replace(/\bCustomer\b/g, "مستهلك");
  }

  // 5. Short English Date Format ("Aug 09, 2026" or "Jul 30, 2026")
  const shortDateMatch = trimmed.match(
    /^([A-Za-z]{3})\s+(\d{1,2}),?\s+(\d{4})$/,
  );
  if (shortDateMatch) {
    const [, month, day, year] = shortDateMatch;
    const monthAr = MONTHS_AR[month] || month;
    return `${parseInt(day, 10)} ${monthAr} ${year}`;
  }

  // 6. ISO Date Format ("2026-08-09T..." or "2026-08-09")
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }

  // 7. Real API Data (already in Arabic or real user names) -> return as-is
  return trimmed;
}
