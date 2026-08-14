import type { MerchantProduct } from "./types";

export const INITIAL_MOCK_PRODUCTS: MerchantProduct[] = [
  {
    id: "prod-101",
    storeId: "store-1",
    categoryId: "cat-dairy",
    categoryName: "Dairy & Cheese",
    categoryNameAr: "ألبان وأجبان",
    title: "Almarai Whole Milk 1L",
    titleAr: "حليب المراعي كامل الدسم 1 لتر",
    description: "حليب بقر طازج كامل الدسم غني بالتغذية والكالسيوم 1 لتر.",
    descriptionAr: "حليب بقر طازج كامل الدسم غني بالتغذية والكالسيوم 1 لتر.",
    originalPrice: 45,
    discountedPrice: 35,
    quantityAvailable: 14,
    expirationDate: "2026-08-25T00:00:00.000Z",
    status: "active",
    automationMode: "Autonomous",
    expiryVerificationState: "AiVerified",
    images: [
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
    ],
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "prod-102",
    storeId: "store-1",
    categoryId: "cat-dairy",
    categoryName: "Dairy & Cheese",
    categoryNameAr: "ألبان وأجبان",
    title: "Juhayna Plain Yoghurt 105g",
    titleAr: "زبادي جهينة طازج 105 جم",
    description: "زبادي طبيعي طازج بدون إضافة سكر من جهينة.",
    descriptionAr: "زبادي طبيعي طازج بدون إضافة سكر من جهينة.",
    originalPrice: 14,
    discountedPrice: 9,
    quantityAvailable: 28,
    expirationDate: "2026-08-05T00:00:00.000Z",
    status: "active",
    automationMode: "Assisted",
    expiryVerificationState: "AiLowConfidence",
    images: [
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    ],
    createdAt: "2026-07-25T10:00:00.000Z",
  },
  {
    id: "prod-103",
    storeId: "store-1",
    categoryId: "cat-dairy",
    categoryName: "Dairy & Cheese",
    categoryNameAr: "ألبان وأجبان",
    title: "Feta White Cheese 500g",
    titleAr: "جبنة بيضاء فيتا 500 جم",
    description: "جبنة فيتا بيضاء طبيعية بقوام كريمي وطعم رائع.",
    descriptionAr: "جبنة فيتا بيضاء طبيعية بقوام كريمي وطعم رائع.",
    originalPrice: 70,
    discountedPrice: 52,
    quantityAvailable: 8,
    expirationDate: "2026-08-09T00:00:00.000Z",
    status: "active",
    automationMode: "Manual",
    expiryVerificationState: "AiVerified",
    images: [
      "https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=600&q=80",
    ],
    createdAt: "2026-07-28T10:00:00.000Z",
  },
  {
    id: "prod-104",
    storeId: "store-1",
    categoryId: "cat-bakery",
    categoryName: "Bakery",
    categoryNameAr: "مخبوزات",
    title: "Fresh White Toast Bread",
    titleAr: "خبز توست أبيض طازج",
    description: "توست أبيض طازج مخبوز بعناية يومياً.",
    descriptionAr: "توست أبيض طازج مخبوز بعناية يومياً.",
    originalPrice: 32,
    discountedPrice: 24,
    quantityAvailable: 16,
    expirationDate: "2026-08-28T00:00:00.000Z",
    status: "published",
    automationMode: "Manual",
    expiryVerificationState: "Manual",
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    ],
    createdAt: "2026-08-05T10:00:00.000Z",
  },
  {
    id: "prod-105",
    storeId: "store-1",
    categoryId: "cat-beverages",
    categoryName: "Beverages",
    categoryNameAr: "مشروبات",
    title: "Fresh Orange Juice 1L",
    titleAr: "عصير برتقال طبيعي 1 لتر",
    description: "عصير برتقال طبيعي 100% بدون أي مواد حافظة.",
    descriptionAr: "عصير برتقال طبيعي 100% بدون أي مواد حافظة.",
    originalPrice: 42,
    discountedPrice: 30,
    quantityAvailable: 5,
    expirationDate: "2026-08-01T00:00:00.000Z",
    status: "out of stock",
    automationMode: "Assisted",
    expiryVerificationState: "AiLowConfidence",
    images: [
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
    ],
    createdAt: "2026-07-20T10:00:00.000Z",
  },
  {
    id: "prod-106",
    storeId: "store-1",
    categoryId: "cat-produce",
    categoryName: "Produce",
    categoryNameAr: "خضروات وفواكه",
    title: "Mixed Fresh Vegetables Basket",
    titleAr: "طبق خضار مشكل طازج",
    description: "تشكيلة خضروات طازجة متنوعة ومغسولة جاهزة للاستخدام.",
    descriptionAr: "تشكيلة خضروات طازجة متنوعة ومغسولة جاهزة للاستخدام.",
    originalPrice: 60,
    discountedPrice: 40,
    quantityAvailable: 10,
    expirationDate: "2026-08-22T00:00:00.000Z",
    status: "active",
    automationMode: "Autonomous",
    expiryVerificationState: "AiVerified",
    images: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    ],
    createdAt: "2026-08-08T10:00:00.000Z",
  },
];

let inMemoryProductsStore = [...INITIAL_MOCK_PRODUCTS];

export function getMockProducts(): MerchantProduct[] {
  return [...inMemoryProductsStore];
}

export function getMockProductById(id: string): MerchantProduct | undefined {
  return inMemoryProductsStore.find((p) => p.id === id);
}

export function deleteMockProduct(id: string): boolean {
  const initialLen = inMemoryProductsStore.length;
  inMemoryProductsStore = inMemoryProductsStore.filter((p) => p.id !== id);
  return inMemoryProductsStore.length < initialLen;
}
