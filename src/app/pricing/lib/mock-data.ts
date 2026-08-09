export type AutomationMode = "autonomous" | "assisted" | "manual";

export type PricingListing = {
  id: string;
  code: string;
  name: string;
  image: string;
  originalPrice: number;
  currentPrice: number;
  discountPercent: number;
  cycleCountdownLabel: string;
  cycleUrgent: boolean;
  automationMode: AutomationMode;
};

export const pricingStats = {
  activeListingsCount: 42,
  activeListingsDelta: 3,
  averageDiscountPercent: 24,
  nextCycleCountdownLabel: "01:24:10",
  nextCycleProgressPercent: 65,
};

export const pricingListings: PricingListing[] = [
  {
    id: "1",
    code: "BK-20394",
    name: "رغيف خبز حرفي مخمر",
    image: "/pricing/sourdough.jpg",
    originalPrice: 85.0,
    currentPrice: 72.25,
    discountPercent: 15,
    cycleCountdownLabel: "خلال 2س 15د",
    cycleUrgent: false,
    automationMode: "autonomous",
  },
  {
    id: "2",
    code: "FR-90112",
    name: "فراولة عضوية طازجة",
    image: "/pricing/strawberries.jpg",
    originalPrice: 120.0,
    currentPrice: 84.0,
    discountPercent: 30,
    cycleCountdownLabel: "خلال 12د",
    cycleUrgent: true,
    automationMode: "assisted",
  },
  {
    id: "3",
    code: "BV-77231",
    name: "عصير أخضر مبرد على البارد",
    image: "/pricing/green-juice.jpg",
    originalPrice: 65.0,
    currentPrice: 65.0,
    discountPercent: 0,
    cycleCountdownLabel: "خلال 4س 40د",
    cycleUrgent: false,
    automationMode: "manual",
  },
  {
    id: "4",
    code: "PT-11204",
    name: "عسل الأزهار البرية (500غ)",
    image: "/pricing/honey.jpg",
    originalPrice: 145.0,
    currentPrice: 123.25,
    discountPercent: 15,
    cycleCountdownLabel: "خلال 1س 05د",
    cycleUrgent: false,
    automationMode: "autonomous",
  },
];

export const totalActiveListings = 42;

export const revenueForecastBars = [60, 35, 50, 15];
export const revenueForecastLiftPercent = 12;

export const atRiskItemsCount = 4;

export type AiPriceRecommendation = {
  productName: string;
  sku: string;
  image: string;
  riskLabel: string;
  originalPrice: number;
  recommendedPrice: number;
  discountPercent: number;
  insight: {
    prefix: string;
    highlightExpiry: string;
    middle: string;
    highlightDrop: string;
    suffix: string;
  };
};

export const aiPriceRecommendation: AiPriceRecommendation = {
  productName: "رغيف خبز حرفي مخمر",
  sku: "H-SRD-082",
  image: "/pricing/sourdough.jpg",
  riskLabel: "خطورة عالية: قرب انتهاء الصلاحية",
  originalPrice: 85.0,
  recommendedPrice: 68.0,
  discountPercent: 20,
  insight: {
    prefix: "المنتج على بعد ",
    highlightExpiry: "24 ساعة من انتهاء الصلاحية",
    middle: " مع ",
    highlightDrop: "انخفاض 30%",
    suffix:
      " في حركة الزوار الصباحية مؤخرًا. يُنصح بخصم 20% لتصفية المخزون بحلول المساء.",
  },
};

export type AutomationModeOption = {
  mode: AutomationMode;
  icon: string;
  title: string;
  description: string;
};

export const automationModeOptions: AutomationModeOption[] = [
  {
    mode: "manual",
    icon: "edit",
    title: "يدوي",
    description: "يقترح الذكاء الاصطناعي الخصومات، وأنت تطبقها يدويًا.",
  },
  {
    mode: "assisted",
    icon: "check_circle",
    title: "بمساعدة",
    description:
      "يقترح الذكاء الاصطناعي التسعير اليومي، وتوافق أو ترفض بنقرة واحدة.",
  },
  {
    mode: "autonomous",
    icon: "bolt",
    title: "تلقائي بالكامل",
    description: "يحدّث الذكاء الاصطناعي الأسعار تلقائيًا ضمن حدود الأمان.",
  },
];

export const automationSettings = {
  selectedMode: "assisted" as AutomationMode,
  expiryBufferDays: 3,
  highRiskItemsCount: 8,
};

export type PricingTier = {
  key: "conservative" | "aggressive" | "liquidate";
  label: string;
  discountPercent: number;
  sellThroughPercent: number;
  isOptimal: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    key: "conservative",
    label: "متحفظ",
    discountPercent: 10,
    sellThroughPercent: 45,
    isOptimal: false,
  },
  {
    key: "aggressive",
    label: "جريء",
    discountPercent: 20,
    sellThroughPercent: 95,
    isOptimal: true,
  },
  {
    key: "liquidate",
    label: "تصفية",
    discountPercent: 35,
    sellThroughPercent: 100,
    isOptimal: false,
  },
];
