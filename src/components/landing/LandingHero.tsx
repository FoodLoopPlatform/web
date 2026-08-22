"use client";

import Link from "next/link";
import { MobileAppShowcase } from "./MobileAppShowcase";
import { ArrowForwardIcon, PlayCircleIcon } from "@/components/icons";
import { useAppLang } from "@/store/use-app-lang";

interface LandingHeroProps {
  onWatchDemo?: () => void;
}

export function LandingHero({ onWatchDemo }: LandingHeroProps) {
  const { lang } = useAppLang();
  const isAr = lang === "ar";

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24"
    >
      {/* Background Soft Glow Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#e8f5eb]/80 via-[#e0f0e5]/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#f4f9f2]/90 to-transparent rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content & CTAs */}
          <div
            className={`lg:col-span-7 space-y-6 sm:space-y-8 ${isAr ? "text-right" : "text-left"}`}
          >
            {/* Main Title H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans text-[#1a1c19] leading-[1.2] sm:leading-[1.25] tracking-tight">
              {isAr ? (
                <>
                  حوّل فائض المخزون من هدر <br />
                  <span className="relative inline-block text-[#00381a]">
                    إلى أرباح وقيمة مجتمعية
                    <svg
                      className="absolute -bottom-2 right-0 w-full h-3 text-[#a7e2b8] -z-10"
                      viewBox="0 0 160 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M3 15 Q 80 2 157 15"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </>
              ) : (
                <>
                  Turn Surplus Inventory <br />
                  From Waste{" "}
                  <span className="relative inline-block text-[#00381a]">
                    Into Profit & Social Value
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-3 text-[#a7e2b8] -z-10"
                      viewBox="0 0 160 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M3 15 Q 80 2 157 15"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle Paragraph */}
            <p className="text-base sm:text-lg lg:text-xl text-[#404941] leading-relaxed max-w-2xl font-normal">
              {isAr
                ? "منصة ذكية تربط المتاجر بالمستهلكين والجمعيات الخيرية. نعتمد على الذكاء الاصطناعي لمراقبة المخزون، وتقديم خصومات ديناميكية لإنقاذ الطعام الطازج بذكاء وفعالية."
                : "A smart platform connecting stores with consumers and charities. Powered by AI to monitor inventory and deliver dynamic discounts to rescue fresh food efficiently."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary Button for Merchants */}
              <Link
                href="/register"
                className="group inline-flex items-center gap-3 px-8 py-3.5 bg-[#00381a] hover:bg-[#005129] text-white text-base font-semibold rounded-full shadow-lg shadow-[#00381a]/20 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>
                  {isAr ? "انضم كمتجر شريك" : "Join as Partner Store"}
                </span>
                <ArrowForwardIcon
                  className={`w-5 h-5 transition-transform duration-200 ${isAr ? "group-hover:-translate-x-1" : "rotate-180 group-hover:translate-x-1"}`}
                />
              </Link>

              {/* Secondary Button for Consumers / Charities */}
              <a
                href="#consumers"
                onClick={(e) => {
                  e.preventDefault();
                  const targetElement = document.querySelector("#consumers");
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 border-2 border-[#005129] text-[#005129] hover:bg-[#005129]/10 text-base font-semibold rounded-full transition-all duration-200 cursor-pointer"
              >
                <span>
                  {isAr ? "تصفح العروض المتاحة" : "Browse Available Deals"}
                </span>
              </a>

              {/* Optional Demo Video Trigger */}
              {onWatchDemo && (
                <button
                  type="button"
                  onClick={onWatchDemo}
                  className="group inline-flex items-center gap-2 px-5 py-3.5 text-[#005129] hover:text-[#00381a] text-base font-semibold transition-colors cursor-pointer"
                >
                  <PlayCircleIcon className="w-6 h-6 text-[#005129] group-hover:scale-110 transition-transform" />
                  <span>{isAr ? "عرض التوضيح" : "Watch Demo"}</span>
                </button>
              )}
            </div>

            {/* Hero Counter Stats */}
            <div className="pt-6 sm:pt-8 border-t border-gray-200/80 flex items-center gap-8 sm:gap-12">
              {/* Stat 1 */}
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-[#1a1c19] font-sans tracking-tight">
                  +12K
                </div>
                <div className="text-xs sm:text-sm text-[#5a605a] font-medium mt-0.5">
                  {isAr ? "وجبة تم إنقاذها" : "Meals Saved"}
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="h-10 w-[1px] bg-gray-300/80" />

              {/* Stat 2 */}
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-[#1a1c19] font-sans tracking-tight">
                  +300
                </div>
                <div className="text-xs sm:text-sm text-[#5a605a] font-medium mt-0.5">
                  {isAr ? "متجر شريك" : "Partner Stores"}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Phone Display Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <MobileAppShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}
