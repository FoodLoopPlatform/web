import {
  AuditLogItem,
  AuditLogFilterParams,
  AuditLogFetchResult,
} from "../types/admin.types";

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "AUD-90142",
    actionType: "Pricing Change",
    actorName: "System AI v4.2",
    actorRole: "System AI",
    actorAvatar: "/avatars/ai-bot.png",
    timestamp: "2026-08-06 11:42:15",
    isoDate: "2026-08-06T11:42:15Z",
    detailsEn:
      "Dynamic price markdown (-25%) applied to surplus bakery items at El Abd Bakery due to 2-hour expiry threshold.",
    detailsAr:
      "تخفيض تلقائي ديناميكي للأسعار (-٢٥٪) لمخبوزات فائضة في مخبز العبد بسبب اقتراب انتهاء الصلاحية خلال ساعتين.",
    severity: "Low",
    targetId: "PRD-50192",
    targetName: "El Abd Bakery - Surplus Croissant Pack",
  },
  {
    id: "AUD-90141",
    actionType: "Listing Moderation",
    actorName: "Admin Sarah",
    actorRole: "Admin",
    actorAvatar: "/avatars/sarah.png",
    timestamp: "2026-08-06 10:15:00",
    isoDate: "2026-08-06T10:15:00Z",
    detailsEn:
      "Approved listing 'Dairy Surplus Bag' from Metro Market after manual origin verification.",
    detailsAr:
      "تمت الموافقة على قائمة 'حقيبة ألبان فائضة' من مترو ماركت بعد التوثيق اليدوي للمصدر.",
    severity: "Med",
    targetId: "LST-88210",
    targetName: "Metro Market - Dairy Bag",
  },
  {
    id: "AUD-90140",
    actionType: "Donation Decision",
    actorName: "System AI v4.2",
    actorRole: "System AI",
    actorAvatar: "/avatars/ai-bot.png",
    timestamp: "2026-08-06 09:30:22",
    isoDate: "2026-08-06T09:30:22Z",
    detailsEn:
      "Automated routing of 50 meal boxes from Gourmet Egypt to Egyptian Food Bank based on proximity.",
    detailsAr:
      "توجيه آلي لـ ٥٠ وجبة فائضة من جورميه إيجيبت إلى بنك الطعام المصري بناءً على القرب الجغرافي.",
    severity: "Low",
    targetId: "DON-33104",
    targetName: "Egyptian Food Bank Dispatch",
  },
  {
    id: "AUD-90139",
    actionType: "Listing Moderation",
    actorName: "Admin Mike",
    actorRole: "Moderator",
    actorAvatar: "/avatars/mike.png",
    timestamp: "2026-08-05 18:04:10",
    isoDate: "2026-08-05T18:04:10Z",
    detailsEn:
      "Flagged and suspended listing 'Frozen Meat Meal' due to customer health hazard reports.",
    detailsAr:
      "إبلاغ وتعليق عرض 'وجبة لحوم مجمدة' بسبب بلاغات صحية من العملاء.",
    severity: "High",
    targetId: "LST-10943",
    targetName: "Seoudi Market - Frozen Meat",
  },
  {
    id: "AUD-90138",
    actionType: "Pricing Change",
    actorName: "System AI v4.2",
    actorRole: "System AI",
    actorAvatar: "/avatars/ai-bot.png",
    timestamp: "2026-08-05 15:20:00",
    isoDate: "2026-08-05T15:20:00Z",
    detailsEn:
      "Automated 40% discount trigger for surplus fresh juice inventory ahead of evening store closing.",
    detailsAr:
      "تفعيل خصم آلي بنسبة ٤٠٪ لعصائر طازجة فائضة قبل موعد إغلاق المتجر المسائي.",
    severity: "Low",
    targetId: "PRD-22019",
    targetName: "Fathallah Market - Juice Bag",
  },
  {
    id: "AUD-90137",
    actionType: "Donation Decision",
    actorName: "Admin Sarah",
    actorRole: "Admin",
    actorAvatar: "/avatars/sarah.png",
    timestamp: "2026-08-04 12:10:45",
    isoDate: "2026-08-04T12:10:45Z",
    detailsEn:
      "Manually reallocated 30 surplus bread packs to Resala Charity following partner request.",
    detailsAr:
      "عادة توجيه يدوية لـ ٣٠ ربطة خبز فائض لجمعية رسالة بناءً على طلب الشريك.",
    severity: "Med",
    targetId: "DON-11048",
    targetName: "Resala Charity Allocation",
  },
  {
    id: "AUD-90136",
    actionType: "Pricing Change",
    actorName: "System AI v4.2",
    actorRole: "System AI",
    actorAvatar: "/avatars/ai-bot.png",
    timestamp: "2026-08-03 14:05:30",
    isoDate: "2026-08-03T14:05:30Z",
    detailsEn:
      "Dynamic floor price protection triggered for organic produce bags (min 30 EGP).",
    detailsAr: "حماية الحد الأدنى للسعر الآلي لمنتجات عضوية (حد أدنى ٣٠ ج.م).",
    severity: "Low",
    targetId: "PRD-77102",
    targetName: "Gourmet Organic Veggies",
  },
  {
    id: "AUD-90135",
    actionType: "Listing Moderation",
    actorName: "System AI v4.2",
    actorRole: "System AI",
    actorAvatar: "/avatars/ai-bot.png",
    timestamp: "2026-08-02 09:12:00",
    isoDate: "2026-08-02T09:12:00Z",
    detailsEn:
      "Auto-approved store verification documents for 12 new partner branches in Heliopolis.",
    detailsAr: "توثيق آلي لملفات ١٢ فرع متجر جديد بمصر الجديدة.",
    severity: "Low",
    targetId: "STR-99104",
    targetName: "Heliopolis Branch Group",
  },
  {
    id: "AUD-90134",
    actionType: "Donation Decision",
    actorName: "Admin Mike",
    actorRole: "Admin",
    actorAvatar: "/avatars/mike.png",
    timestamp: "2026-07-28 16:45:10",
    isoDate: "2026-07-28T16:45:10Z",
    detailsEn:
      "Approved emergency donation grant of 100 food crates to Orman Association.",
    detailsAr:
      "الموافقة على منحة تبرع طارئة بـ ١٠٠ صندوق طعام لجمعية الأورمان.",
    severity: "High",
    targetId: "DON-00912",
    targetName: "Orman Association Grant",
  },
  {
    id: "AUD-90133",
    actionType: "Pricing Change",
    actorName: "Admin Sarah",
    actorRole: "Admin",
    actorAvatar: "/avatars/sarah.png",
    timestamp: "2026-07-20 10:00:00",
    isoDate: "2026-07-20T10:00:00Z",
    detailsEn:
      "Manual override of dynamic surge pricing cap for Maadi zone distribution.",
    detailsAr: "تعديل يدوي لسقف تسعير الزيادة الآلي لتوزيع منطقة المعادي.",
    severity: "Med",
    targetId: "CFG- Maadi",
    targetName: "Maadi Zone Pricing Config",
  },
];

export function fetchMockAuditLogs(
  params: AuditLogFilterParams,
): AuditLogFetchResult {
  let filtered = [...MOCK_AUDIT_LOGS];

  // 1. Search Query filter (search in details, actorName, actionType, targetName, targetId)
  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.detailsEn.toLowerCase().includes(q) ||
        item.detailsAr.toLowerCase().includes(q) ||
        item.actorName.toLowerCase().includes(q) ||
        item.actionType.toLowerCase().includes(q) ||
        (item.targetName && item.targetName.toLowerCase().includes(q)) ||
        item.id.toLowerCase().includes(q),
    );
  }

  // 2. Action Type filter
  if (params.actionType && params.actionType !== "ALL") {
    filtered = filtered.filter((item) => item.actionType === params.actionType);
  }

  // 3. Severity filter
  if (params.severity && params.severity !== "ALL") {
    filtered = filtered.filter((item) => item.severity === params.severity);
  }

  // 4. Date Range filter
  if (params.dateRange && params.dateRange !== "ALL") {
    const now = new Date("2026-08-06T12:00:00Z").getTime(); // fixed reference baseline for test reproducibility
    filtered = filtered.filter((item) => {
      const itemTime = new Date(item.isoDate).getTime();
      const diffDays = (now - itemTime) / (1000 * 60 * 60 * 24);

      if (params.dateRange === "TODAY") return diffDays <= 1;
      if (params.dateRange === "7DAYS") return diffDays <= 7;
      if (params.dateRange === "30DAYS") return diffDays <= 30;
      return true;
    });
  }

  const page = params.page || 1;
  const pageSize = params.pageSize || 5;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;

  const startIndex = (page - 1) * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    total,
    page,
    pageSize,
    totalPages,
    stats: {
      activeSessions: 24,
      aiDecisions24h: 1420,
      flaggedEvents: 3,
      systemHealthStatus: "Stable Ops",
    },
  };
}
