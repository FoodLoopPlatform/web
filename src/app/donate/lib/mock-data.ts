export type DonationInventoryItem = {
  id: string;
  name: string;
  image: string;
  quantityLabel: string;
  daysLeftLabel: string;
};

export const donationInventoryItems: DonationInventoryItem[] = [
  {
    id: "1",
    name: "خضروات ورقية عضوية مشكلة",
    image: "/donate/mixed-greens.jpg",
    quantityLabel: "24 كيس",
    daysLeftLabel: "يومان متبقيان",
  },
  {
    id: "2",
    name: "تفاح هيرلوم هَني كِرِسب",
    image: "/donate/honeycrisp.jpg",
    quantityLabel: "12 كجم",
    daysLeftLabel: "4 أيام متبقية",
  },
  {
    id: "3",
    name: "خبز العجين المخمر الحرفي",
    image: "/pricing/sourdough.jpg",
    quantityLabel: "8 أرغفة",
    daysLeftLabel: "يوم واحد متبقٍ",
  },
];

export type CharityTag = {
  label: string;
  tone: "warning" | "neutral";
};

export type VerifiedCharity = {
  id: string;
  name: string;
  logo: string;
  distanceLabel: string;
  description: string;
  tags: CharityTag[];
};

export const verifiedCharities: VerifiedCharity[] = [
  {
    id: "1",
    name: "مركز الحصاد الحضري",
    logo: "/donate/charity-urban-harvest.jpg",
    distanceLabel: "0.8 كم",
    description:
      "يستقبل جميع المنتجات ومخبوزات الأفران. يدعم الإيواء الطارئ. مفتوح حتى الساعة 8 مساءً.",
    tags: [
      { label: "احتياج مرتفع", tone: "warning" },
      { label: "يتوفر تبريد", tone: "neutral" },
    ],
  },
  {
    id: "2",
    name: "مطبخ قلوب المدينة",
    logo: "/donate/charity-city-hearts.jpg",
    distanceLabel: "1.4 كم",
    description:
      "يركّز على الوجبات العضوية المعبأة مسبقًا. توزيع أسبوعي على كبار السن محدودي الدخل.",
    tags: [{ label: "استلام مجدول", tone: "neutral" }],
  },
];

export const donationImpact = {
  lifetimeMeals: 1222,
  lifetimeMealsLabel: "إجمالي الوجبات المقدَّمة",
  monthlyGoalPercent: 72,
};
