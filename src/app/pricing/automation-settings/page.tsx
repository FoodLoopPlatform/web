"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
import {
  automationModeOptions,
  automationSettings,
  type AutomationMode,
} from "@/app/pricing/lib/mock-data";
import { withAuth } from "@/lib/auth/with-auth";

function PricingAutomationSettingsPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMode, setSelectedMode] = useState<AutomationMode>(
    automationSettings.selectedMode,
  );
  const [priceFloorPercent, setPriceFloorPercent] = useState(
    automationSettings.priceFloorPercent,
  );
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const handleSave = () => {
    if (saveState !== "idle") return;
    setSaveState("saving");
    // Mocked: no backend endpoint yet for automation settings persistence.
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1800);
    }, 700);
  };

  return (
    <div
      className="bg-surface-container-lowest text-on-surface min-h-screen flex font-sans"
      dir="rtl"
    >
      {/* Sidebar for Desktop */}
      <aside
        className={`fixed right-0 top-0 h-screen hidden lg:block z-50 transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"}`}
      >
        <MerchantSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <aside className="relative z-50 flex flex-col h-full w-64 animate-in slide-in-from-right duration-250">
            <div className="absolute top-4 left-4 z-50">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-full bg-light-green border border-outline-variant text-primary hover:bg-surface-container-highest transition-all cursor-pointer flex items-center justify-center"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <MerchantSidebar onClose={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 mr-0 ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
      >
        {/* Top Header */}
        <header className="h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full bg-light-green border-b border-outline-variant sticky top-0 z-40">
          <div className="flex items-center gap-md flex-1">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center cursor-pointer"
            >
              <Icon name="menu" className="h-5 w-5 text-primary" />
            </button>

            <div className="relative max-w-md w-full hidden md:block">
              <Icon
                name="search"
                className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                className="w-full bg-surface-container-high border-none rounded-full py-2 pr-11 pl-4 font-body-md text-body-md focus:ring-2 focus:ring-primary transition-all outline-none"
                placeholder="ابحث عن منتجات، طلبات..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-md">
            <div className="flex items-center gap-sm">
              <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors relative flex items-center justify-center cursor-pointer">
                <Icon
                  name="notifications"
                  className="h-5 w-5 text-on-surface-variant"
                />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon name="help" className="h-5 w-5 text-on-surface-variant" />
              </button>
              <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon
                  name="language"
                  className="h-5 w-5 text-on-surface-variant"
                />
              </button>
            </div>
            <div className="h-8 w-px bg-outline-variant"></div>

            <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-highest p-1 pl-3 pr-1 rounded-full transition-all">
              <Image
                className="w-8 h-8 rounded-full border border-outline-variant object-cover"
                alt="صورة التاجر"
                src="/pricing/avatar.jpg"
                width={32}
                height={32}
              />
              <span className="font-label-caps text-label-caps text-primary font-bold hidden md:block">
                سوبرماركت النيل
              </span>
            </div>
          </div>
        </header>

        {/* Automation Settings Content */}
        <div className="px-margin-mobile md:px-margin-desktop py-lg flex flex-col gap-10">
          {/* Header Section */}
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Link
                  href="/pricing"
                  className="text-xs font-bold tracking-wide text-on-surface-variant hover:text-primary transition-colors"
                >
                  التسعير
                </Link>
                <Icon
                  name="chevron_left"
                  className="h-3 w-3 text-on-surface-variant"
                />
                <span className="text-xs font-bold tracking-wide text-primary">
                  الأتمتة
                </span>
              </div>
              <h1 className="font-sans text-3xl font-bold text-primary">
                أتمتة التسعير بالذكاء الاصطناعي
              </h1>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveState !== "idle"}
              className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl text-body-md font-bold hover:opacity-90 transition-opacity cursor-pointer shrink-0 disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {saveState === "saving" && (
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              )}
              {saveState === "saved" && (
                <Icon name="check_circle" className="h-4 w-4" fill />
              )}
              {saveState === "idle" && "حفظ إعدادات الأتمتة"}
              {saveState === "saving" && "جارٍ الحفظ..."}
              {saveState === "saved" && "تم الحفظ"}
            </button>
          </div>

          {/* Automation Mode Selector */}
          <section className="flex flex-col gap-6">
            <h2 className="font-sans text-2xl font-semibold text-on-surface">
              وضع الأتمتة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {automationModeOptions.map((option) => {
                const isSelected = selectedMode === option.mode;
                return (
                  <label
                    key={option.mode}
                    className={`flex flex-col items-start gap-4 rounded-2xl p-10 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#f7faf4] border-2 border-primary-container"
                        : "bg-light-green border border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <div
                      className={`h-12 w-12 flex items-center justify-center rounded-xl shrink-0 ${
                        isSelected
                          ? "bg-[#98f3b0]"
                          : "bg-surface-container-high"
                      }`}
                    >
                      <Icon
                        name={option.icon}
                        className={`h-5 w-5 ${isSelected ? "text-[#0b723c]" : "text-on-surface-variant"}`}
                        fill={isSelected}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-lg font-bold text-on-surface">
                        {option.title}
                      </span>
                      <span className="text-sm text-on-surface-variant">
                        {option.description}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="automationMode"
                      checked={isSelected}
                      onChange={() => setSelectedMode(option.mode)}
                      className="h-5 w-5 accent-primary cursor-pointer mt-2"
                    />
                  </label>
                );
              })}
            </div>
          </section>

          {/* Safety Controls & AI Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
            {/* Safety Limits & Floor */}
            <div className="lg:col-span-3 bg-white border border-outline-variant rounded-2xl p-10 flex flex-col gap-10">
              <div className="flex items-center gap-2">
                <h3 className="font-sans text-2xl font-semibold text-on-surface">
                  حدود الأمان والحد الأدنى
                </h3>
                <Icon name="info" className="h-5 w-5 text-on-surface-variant" />
              </div>

              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold tracking-wide text-on-surface-variant">
                    الحد الأدنى للسعر (كنسبة % من السعر الأصلي){" "}
                    <span className="text-error">*</span>
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={priceFloorPercent}
                      onChange={(event) =>
                        setPriceFloorPercent(Number(event.target.value))
                      }
                      className="w-full bg-light-green border border-outline-variant rounded-xl h-14 px-6 pe-11 font-data-mono text-lg text-on-surface outline-none focus:border-primary transition-colors"
                    />
                    <span className="absolute inset-y-0 end-6 flex items-center text-body-md font-bold text-outline-variant pointer-events-none">
                      %
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-6">
                  <div className="flex items-center gap-4">
                    <Icon
                      name="info"
                      className="h-5 w-5 text-on-surface-variant shrink-0"
                    />
                    <span className="text-body-md font-medium text-on-surface-variant">
                      الحد الأقصى للتغيير في السعر لكل دورة
                    </span>
                  </div>
                  <span
                    dir="ltr"
                    className="font-data-mono text-body-md font-bold text-primary shrink-0"
                  >
                    ±{automationSettings.maxChangePerCycle}%
                  </span>
                </div>
              </div>
            </div>

            {/* AI Impact Estimate */}
            <div className="lg:col-span-2 bg-primary rounded-2xl p-10 flex flex-col justify-between gap-10 relative overflow-hidden">
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#9bf6b3]/10 blur-2xl" />
              <div className="flex flex-col gap-4 relative">
                <h3 className="font-sans text-2xl font-semibold text-white">
                  تقدير أثر الذكاء الاصطناعي
                </h3>
                <p className="text-sm text-[#9ae9ae] leading-relaxed">
                  استنادًا إلى مبيعاتك السابقة، قد يؤدي التحويل إلى وضع{" "}
                  <span className="underline decoration-[#9bf6b3]">
                    بمساعدة
                  </span>{" "}
                  إلى خفض هدر الطعام بنسبة تصل إلى{" "}
                  <bdi>{automationSettings.impactWasteReductionPercent}%</bdi>{" "}
                  وزيادة الإيرادات بنسبة{" "}
                  <bdi>{automationSettings.impactRevenueIncreasePercent}%</bdi>{" "}
                  من خلال الخصومات المسائية الديناميكية.
                </p>
              </div>
              <div className="flex flex-col gap-6 relative">
                <div className="flex gap-2 items-end justify-center">
                  {automationSettings.impactBars.map((height, index) => {
                    const isPeak =
                      height === Math.max(...automationSettings.impactBars);
                    return (
                      <div
                        key={index}
                        className={`w-8 rounded-t-lg ${isPeak ? "bg-[#9bf6b3]" : "bg-white/20"}`}
                        style={{ height: `${height}px` }}
                      />
                    );
                  })}
                </div>
                <span className="text-xs font-bold tracking-wide text-white/60 text-center">
                  تقدير الارتفاع في الإيرادات
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(PricingAutomationSettingsPage);
