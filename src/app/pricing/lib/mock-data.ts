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
