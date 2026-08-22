"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LeafIcon,
  MenuIcon,
  CloseIcon,
  DownloadIcon,
  MapPinIcon,
} from "@/components/icons";
import { useAppLang } from "@/store/use-app-lang";

interface LandingHeaderProps {
  activeTab?: string;
  onNavigate?: (sectionId: string) => void;
}

export function LandingHeader({
  activeTab = "hero",
  onNavigate,
}: LandingHeaderProps) {
  const { lang, setLang } = useAppLang();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = lang === "ar";

  const navItems = [
    {
      id: "consumers",
      label: isAr ? "عروض قريبة" : "Food Nearby",
      href: "#consumers",
      icon: MapPinIcon,
    },
    {
      id: "how-it-works",
      label: isAr ? "كيف يعمل؟" : "How it Works",
      href: "#how-it-works",
    },
    {
      id: "business",
      label: isAr ? "لأصحاب الأعمال" : "For Business",
      href: "#business",
    },
    {
      id: "charities",
      label: isAr ? "للجمعيات" : "For Charities",
      href: "#charities",
    },
    {
      id: "faq",
      label: isAr ? "الأسئلة الشائعة" : "FAQ",
      href: "#faq",
    },
  ];

  const handleNavClick = (id: string, href?: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else if (href) {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLang(isAr ? "en" : "ar");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf4]/95 backdrop-blur-md border-b border-gray-200/60 transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">
        {/* Left Section: Navigation Items */}
        <nav className="hidden lg:flex items-center gap-6 flex-1 justify-start">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id, item.href);
                }}
                className={`relative py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "text-[#00381a] font-bold"
                    : "text-[#404941] hover:text-[#00381a]"
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-[#005129]" />}
                <span>{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeLandingNavUnderline"
                    className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#005129] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Center Section: Brand Logo */}
        <div className="flex items-center justify-center shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#00381a] group focus:outline-hidden"
          >
            <LeafIcon className="w-8 h-8 text-[#005129] group-hover:scale-110 transition-transform duration-300 shrink-0" />
            <span className="text-2xl sm:text-3xl font-bold font-brand tracking-tight text-[#00381a]">
              FoodLoop
            </span>
          </Link>
        </div>

        {/* Right Section: Actions & Buttons */}
        <div className="hidden lg:flex items-center gap-3.5 flex-1 justify-end">
          {/* Sign up as Business */}
          <Link
            href="/register"
            className="text-xs sm:text-sm font-semibold text-[#404941] hover:text-[#00381a] transition-colors whitespace-nowrap"
          >
            {isAr ? "سجّل كمتجر" : "Sign up as Business"}
          </Link>

          <span className="text-gray-300 font-light">|</span>

          {/* Store Login */}
          <Link
            href="/login"
            className="text-xs sm:text-sm font-semibold text-[#404941] hover:text-[#00381a] transition-colors whitespace-nowrap"
          >
            {isAr ? "دخول المتاجر" : "MyStore Login"}
          </Link>

          {/* Download App CTA Button */}
          <a
            href="#consumers"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("consumers", "#consumers");
            }}
            className="inline-flex items-center gap-1.5 bg-[#00381a] hover:bg-[#005129] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <DownloadIcon className="w-4 h-4 shrink-0" />
            <span>{isAr ? "تحميل التطبيق" : "Download App"}</span>
          </a>

          {/* Language Switcher Selector */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3 py-1.5 text-xs font-bold text-[#005129] bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-2xs active:scale-95 whitespace-nowrap"
            aria-label={isAr ? "Switch to English" : "التحويل للغة العربية"}
            title={isAr ? "Switch to English" : "التحويل للغة العربية"}
          >
            {isAr ? "EN" : "عربي"}
          </button>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1 text-xs font-bold text-[#005129] bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors cursor-pointer active:scale-95"
          >
            {isAr ? "EN" : "عربي"}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1a1c19] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <CloseIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fafaf4] border-b border-gray-200 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id, item.href);
                  }}
                  className={`py-2 px-3 rounded-lg text-base font-medium transition-colors flex items-center gap-2 ${
                    activeTab === item.id
                      ? "bg-[#005129]/10 text-[#00381a] font-bold"
                      : "text-[#404941] hover:bg-gray-100"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-[#005129]" />}
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-gray-200/80 flex flex-col gap-2.5">
            <a
              href="#consumers"
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-[#00381a] rounded-full hover:bg-[#005129] shadow-md flex items-center justify-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("consumers", "#consumers");
              }}
            >
              <DownloadIcon className="w-4 h-4 shrink-0" />
              <span>{isAr ? "تحميل التطبيق" : "Download App"}</span>
            </a>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/register"
                className="text-center py-2 text-xs font-semibold text-[#00381a] bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAr ? "سجّل كمتجر" : "Sign up as Business"}
              </Link>
              <Link
                href="/login"
                className="text-center py-2 text-xs font-semibold text-[#1a1c19] border border-gray-300 rounded-full hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAr ? "دخول المتاجر" : "MyStore Login"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
