"use client";

import Link from "next/link";
import { useState } from "react";
import { LeafIcon, GlobeIcon, MenuIcon, CloseIcon } from "@/components/icons";
import { useAppLang } from "@/store/use-app-lang";

interface LandingHeaderProps {
  activeTab?: string;
  onNavigate?: (sectionId: string) => void;
}

export function LandingHeader({
  activeTab = "home",
  onNavigate,
}: LandingHeaderProps) {
  const { lang, setLang } = useAppLang();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = lang === "ar";

  const navItems = [
    { id: "home", label: isAr ? "الرئيسية" : "Home", href: "#hero" },
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
      id: "consumers",
      label: isAr ? "للمستهلكين" : "For Consumers",
      href: "#consumers",
    },
    {
      id: "charities",
      label: isAr ? "للجمعيات" : "For Charities",
      href: "#charities",
    },
  ];

  const handleNavClick = (id: string, href?: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
    if (href) {
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
    <header className="sticky top-0 z-50 bg-[#fafaf4]/90 backdrop-blur-md border-b border-gray-200/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
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

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id, item.href);
                }}
                className={`relative py-2 text-base font-medium transition-colors ${
                  isActive
                    ? "text-[#00381a] font-bold"
                    : "text-[#404941] hover:text-[#00381a]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#005129] rounded-full animate-in fade-in zoom-in-75 duration-200" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher Selector */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="p-2 text-[#404941] bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-2xs active:scale-95"
            aria-label={isAr ? "Switch to English" : "التحويل للغة العربية"}
            title={isAr ? "Switch to English" : "التحويل للغة العربية"}
          >
            <GlobeIcon className="w-5 h-5 text-[#005129]" />
          </button>

          {/* Login Link */}
          <Link
            href="/login"
            className="text-[#1a1c19] hover:text-[#00381a] text-sm font-semibold px-3 py-2 transition-colors"
          >
            {isAr ? "تسجيل الدخول" : "Log In"}
          </Link>

          {/* Start Now CTA Button */}
          <Link
            href="/register"
            className="bg-[#00381a] hover:bg-[#005129] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isAr ? "ابدأ الآن" : "Get Started"}
          </Link>
        </div>

        {/* Mobile Buttons */}
        <div className="flex md:hidden items-center gap-3">
          <button
            type="button"
            onClick={toggleLanguage}
            className="p-2 text-[#404941] bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors cursor-pointer active:scale-95"
            aria-label={isAr ? "Switch to English" : "التحويل للغة العربية"}
            title={isAr ? "Switch to English" : "التحويل للغة العربية"}
          >
            <GlobeIcon className="w-5 h-5 text-[#005129]" />
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
        <div className="md:hidden bg-[#fafaf4] border-b border-gray-200 px-4 pt-2 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id, item.href);
                }}
                className={`py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-[#005129]/10 text-[#00381a] font-bold"
                    : "text-[#404941] hover:bg-gray-100"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-gray-200/80 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full text-center py-2.5 text-sm font-semibold text-[#1a1c19] border border-gray-300 rounded-full hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isAr ? "تسجيل الدخول" : "Log In"}
            </Link>
            <Link
              href="/register"
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-[#00381a] rounded-full hover:bg-[#005129] shadow-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isAr ? "ابدأ الآن" : "Get Started"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
