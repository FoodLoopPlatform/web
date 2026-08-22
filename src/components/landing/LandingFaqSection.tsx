"use client";

import { useState } from "react";
import { useAppLang } from "@/store/use-app-lang";

interface FaqItem {
  id: string;
  category: "b2c" | "b2b" | "ngo";
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

const FAQ_ITEMS: FaqItem[] = [
  // B2C Items
  {
    id: "b2c-1",
    category: "b2c",
    questionAr: "هل الطعام المعروض في FoodLoop طازج وآمن للاستهلاك؟",
    questionEn:
      "Is the food listed on FoodLoop fresh and safe for consumption?",
    answerAr:
      "بكل تأكيد! جميع الأطعمة والمخبوزات المعروضة طازجة وسليمة 100%. الخصم يُطبق فقط لأن المنتج اقترب من نهاية يوم عمل المتجر أو اقترب من تاريخ انتهاء صلاحيته المثالي، ولكنه يخضع لمعايير فحص جودة صارمة.",
    answerEn:
      "Absolutely! All listed food items and bakery goods are 100% fresh and safe. Discounts apply solely because items are nearing end-of-day store hours or peak freshness dates, while undergoing strict quality inspection standards.",
  },
  {
    id: "b2c-2",
    category: "b2c",
    questionAr: "كيف أحصل على وجبتي بعد حجزها من التطبيق؟",
    questionEn: "How do I claim my meal after reserving it in the app?",
    answerAr:
      "بمجرد تأكيد الحجز والدفع عبر التطبيق، ستحصل على إيصال رقمي. يمكنك التوجه مباشرة إلى المتجر في الوقت المحدد واستلام وجبتك الطازجة فوراً.",
    answerEn:
      "Once your reservation and payment are confirmed in the app, you'll receive a digital receipt. Simply head to the store during the designated pickup window to claim your fresh meal instantly.",
  },

  // B2B Items
  {
    id: "b2b-1",
    category: "b2b",
    questionAr:
      "هل سيقوم الذكاء الاصطناعي بتخفيض أسعاري بشكل عشوائي أو يعرضني للخسارة؟",
    questionEn: "Will the AI randomly cut my prices or cause financial losses?",
    answerAr:
      "لا نهائياً. أنت تمتلك السيطرة الكاملة؛ حيث يمكنك تحديد 'الحد الأدنى للسعر' (Price Floor) الذي لا يمكن للنظام تجاوزه أبداً. كما أن خوارزمياتنا تلتزم بنسبة خصم تدريجية ومدروسة لتسريع البيع بأعلى هامش ربح ممكن.",
    answerEn:
      "Not at all. You maintain full control by setting a strict 'Price Floor' that the AI will never cross. Our algorithms follow a calculated, gradual discount curve to accelerate sales while optimizing your profit margins.",
  },
  {
    id: "b2b-2",
    category: "b2b",
    questionAr: "ماذا يحدث إذا لم يُباع المنتج حتى بعد تطبيق الخصم الأقصى؟",
    questionEn:
      "What happens if a product doesn't sell even at maximum discount?",
    answerAr:
      "إذا وصل المنتج للحد الأدنى من السعر ولم يُباع، يقوم النظام تلقائياً بإيقاف الخصم، ويقترح عليك تحويل المنتج إلى 'تبرع خيري' لتستفيد من الإعفاءات الضريبية بدلاً من إعدامه.",
    answerEn:
      "If an item hits the Price Floor without selling, the system automatically halts discounts and suggests rerouting the item as a verified charity donation, enabling tax benefits rather than food waste.",
  },
  {
    id: "b2b-3",
    category: "b2b",
    questionAr: "هل يحتاج متجري لأجهزة جديدة للربط مع FoodLoop؟",
    questionEn: "Does my store need new hardware to integrate with FoodLoop?",
    answerAr:
      "لا، المنصة مصممة لترتبط بسلاسة مع أنظمة نقاط البيع (POS) وإدارة المخزون الحالية لديك دون تعقيدات تقنية.",
    answerEn:
      "No. FoodLoop seamlessly connects with your existing POS and inventory management software without extra hardware or technical complexity.",
  },

  // NGO Items
  {
    id: "ngo-1",
    category: "ngo",
    questionAr: "هل توجد أي رسوم خفية لاشتراك الجمعيات الخيرية؟",
    questionEn: "Are there any hidden fees for charity subscription?",
    answerAr:
      "منصة FoodLoop مجانية بالكامل (100%) للجمعيات والمؤسسات الخيرية المعتمدة إيماناً منا بدعم المجتمع.",
    answerEn:
      "FoodLoop is 100% free for accredited NGOs and non-profit organizations as part of our commitment to social impact.",
  },
  {
    id: "ngo-2",
    category: "ngo",
    questionAr: "كيف نضمن استلام التبرعات الغذائية قبل فسادها؟",
    questionEn:
      "How do we ensure food donations are collected before spoiling?",
    answerAr:
      "نظامنا اللوجستي يعمل بشكل آلي؛ حيث يرسل تنبيهات فورية لمندوبي الجمعية المتواجدين في المحيط الجغرافي للمتجر، مما يضمن استلام الطعام وتوزيعه وهو في أفضل حالاته.",
    answerEn:
      "Our automated logistics system dispatches instant alerts to nearby registered NGO delegates based on geographic proximity, ensuring food is collected and distributed at peak freshness.",
  },
];

export function LandingFaqSection() {
  const { lang } = useAppLang();
  const isAr = lang === "ar";

  const [activeCategory, setActiveCategory] = useState<
    "all" | "b2c" | "b2b" | "ngo"
  >("all");
  const [openId, setOpenId] = useState<string | null>("b2c-1");

  const filteredItems =
    activeCategory === "all"
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="scroll-mt-24 py-16 lg:py-24 bg-[#fafaf4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Title */}
        <div
          className={`text-center space-y-3 ${isAr ? "text-right" : "text-left"} sm:text-center`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#005129]/10 text-[#005129] text-xs sm:text-sm font-bold border border-[#005129]/20">
            <span>❓</span>
            <span>
              {isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1c19] tracking-tight">
            {isAr
              ? "كل ما تحتاج معرفته عن FoodLoop"
              : "Everything You Need to Know"}
          </h2>
          <p className="text-[#404941] text-base sm:text-lg max-w-2xl mx-auto">
            {isAr
              ? "إجابات شاملة لأبرز الاستفسارات المتعلقة بالمنظومة للمستهلكين، المتاجر، والجمعيات الخيرية."
              : "Comprehensive answers for consumers, merchant stores, and non-profit organizations."}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-[#00381a] text-white shadow-md"
                : "bg-white text-[#404941] border border-gray-200 hover:border-[#005129]/40 hover:bg-emerald-50/50"
            }`}
          >
            {isAr ? "الكل" : "All Questions"}
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory("b2c")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === "b2c"
                ? "bg-[#00381a] text-white shadow-md"
                : "bg-white text-[#404941] border border-gray-200 hover:border-[#005129]/40 hover:bg-emerald-50/50"
            }`}
          >
            <span>🛍️</span>
            <span>{isAr ? "أسئلة المستهلكين (B2C)" : "Consumers (B2C)"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory("b2b")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === "b2b"
                ? "bg-[#00381a] text-white shadow-md"
                : "bg-white text-[#404941] border border-gray-200 hover:border-[#005129]/40 hover:bg-emerald-50/50"
            }`}
          >
            <span>🏪</span>
            <span>{isAr ? "أسئلة المتاجر (B2B)" : "Business (B2B)"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory("ngo")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === "ngo"
                ? "bg-[#00381a] text-white shadow-md"
                : "bg-white text-[#404941] border border-gray-200 hover:border-[#005129]/40 hover:bg-emerald-50/50"
            }`}
          >
            <span>🤝</span>
            <span>{isAr ? "أسئلة الجمعيات (NGOs)" : "Charities (NGOs)"}</span>
          </button>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isOpen = openId === item.id;
            const question = isAr ? item.questionAr : item.questionEn;
            const answer = isAr ? item.answerAr : item.answerEn;

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#005129] shadow-md ring-1 ring-[#005129]/10"
                    : "border-gray-200/80 hover:border-gray-300 shadow-2xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`w-full p-5 text-base sm:text-lg font-bold text-[#1a1c19] flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                    isAr ? "text-right" : "text-left"
                  }`}
                  aria-expanded={isOpen}
                >
                  <span className="flex-1">{question}</span>
                  <span
                    className={`w-8 h-8 rounded-full bg-[#f4f9f4] text-[#005129] flex items-center justify-center shrink-0 transition-transform duration-300 font-extrabold ${
                      isOpen ? "rotate-180 bg-[#005129] text-white" : ""
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div
                    className={`px-5 pb-5 pt-1 text-sm sm:text-base text-[#404941] leading-relaxed border-t border-gray-100/80 ${isAr ? "text-right" : "text-left"}`}
                  >
                    <p>{answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
