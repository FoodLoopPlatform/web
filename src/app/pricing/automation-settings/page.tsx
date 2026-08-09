"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
import {
  automationModeOptions,
  automationSettings,
  pricingTiers,
  type AutomationMode,
} from "@/app/pricing/lib/mock-data";
import { withAuth } from "@/lib/auth/with-auth";

function PricingAutomationSettingsPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMode, setSelectedMode] = useState<AutomationMode>(
    automationSettings.selectedMode,
  );
  const [expiryBufferDays, setExpiryBufferDays] = useState(
    automationSettings.expiryBufferDays,
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
        className={`flex-1 min-h-screen min-w-0 flex flex-col transition-all duration-300 mr-0 ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
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

            <div className="relative max-w-112 w-full hidden md:block">
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
                    className={`flex flex-col gap-3 rounded-2xl p-6 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#f7faf4] border-2 border-primary-container"
                        : "bg-light-green border border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 flex items-center justify-center rounded-lg shrink-0 ${
                            isSelected
                              ? "bg-[#98f3b0]"
                              : "bg-surface-container-high"
                          }`}
                        >
                          <Icon
                            name={option.icon}
                            className={`h-4 w-4 ${isSelected ? "text-[#0b723c]" : "text-on-surface-variant"}`}
                            fill={isSelected}
                          />
                        </div>
                        <span className="text-lg font-bold text-on-surface">
                          {option.title}
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="automationMode"
                        checked={isSelected}
                        onChange={() => setSelectedMode(option.mode)}
                        className="h-5 w-5 accent-primary cursor-pointer shrink-0"
                      />
                    </div>
                    <span className="text-sm text-on-surface-variant">
                      {option.description}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* AI Intelligence Section */}
          <section className="flex flex-col gap-10">
            {/* Tier Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pricingTiers.map((tier) => {
                if (tier.isOptimal) {
                  return (
                    <div
                      key={tier.key}
                      className="relative bg-primary-container border-2 border-primary-fixed rounded-xl p-6"
                    >
                      <span className="absolute -top-3 inset-x-0 mx-auto w-fit bg-primary text-white text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full">
                        الأمثل
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold tracking-wide text-primary-fixed">
                          {tier.label}
                        </span>
                        <span className="font-sans text-2xl font-semibold text-primary-fixed">
                          خصم <bdi>{tier.discountPercent}%</bdi>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-primary-fixed">
                            معدل البيع
                          </span>
                          <span
                            dir="ltr"
                            className="font-data-mono text-xs text-primary-fixed"
                          >
                            {tier.sellThroughPercent}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-on-primary-container overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary-fixed"
                            style={{ width: `${tier.sellThroughPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={tier.key}
                    className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col gap-1.5"
                  >
                    <span className="text-xs font-bold tracking-wide text-on-surface-variant">
                      {tier.label}
                    </span>
                    <span className="font-sans text-2xl font-semibold text-primary">
                      خصم <bdi>{tier.discountPercent}%</bdi>
                    </span>
                    <div className="flex flex-col gap-1 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-on-surface">
                          معدل البيع
                        </span>
                        <span
                          dir="ltr"
                          className="font-data-mono text-xs text-on-surface"
                        >
                          {tier.sellThroughPercent}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${tier.sellThroughPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Expiry Buffer Slider */}
            <div className="flex flex-col gap-4 pt-6 border-t border-outline-variant">
              <div className="flex items-center justify-between">
                <span className="text-body-md font-bold text-primary">
                  هامش انتهاء الصلاحية (بالأيام)
                </span>
                <span
                  dir="ltr"
                  className="font-data-mono text-body-md font-medium text-link"
                >
                  {expiryBufferDays} أيام
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={14}
                value={expiryBufferDays}
                onChange={(event) =>
                  setExpiryBufferDays(Number(event.target.value))
                }
                className="w-full h-2 rounded-lg appearance-none bg-surface-container-high accent-primary cursor-pointer"
              />
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-link text-white py-6 rounded-xl text-body-md font-bold hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Icon name="bolt" className="h-4 w-4" fill />
              تطبيق على كل العناصر عالية الخطورة
            </button>
            <button
              type="button"
              className="flex items-center justify-center border border-outline py-6 rounded-xl text-body-md font-bold text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              معاينة التغييرات لـ {automationSettings.highRiskItemsCount} عناصر
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(PricingAutomationSettingsPage);
