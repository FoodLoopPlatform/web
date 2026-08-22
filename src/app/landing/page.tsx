"use client";

import { useState, useEffect, useRef } from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingFaqSection } from "@/components/landing/LandingFaqSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { HowItWorksModal } from "@/components/landing/HowItWorksModal";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const isManualScrollRef = useRef(false);

  const handleNavigate = (sectionId: string) => {
    setActiveTab(sectionId);
    isManualScrollRef.current = true;

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    setTimeout(() => {
      isManualScrollRef.current = false;
    }, 800);
  };

  useEffect(() => {
    const sectionIds = [
      "hero",
      "how-it-works",
      "business",
      "consumers",
      "charities",
      "faq",
    ];

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-20% 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (isManualScrollRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    }, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf4] text-[#1a1c19] selection:bg-[#005129]/20 selection:text-[#00381a]">
      {/* Top Navbar */}
      <LandingHeader activeTab={activeTab} onNavigate={handleNavigate} />

      {/* Main Content Flow */}
      <main>
        {/* Hero Section with Mobile Mockup */}
        <LandingHero onWatchDemo={() => setIsDemoModalOpen(true)} />

        {/* Detailed Feature Sections */}
        <LandingFeatures />

        {/* FAQ Interactive Accordion Section */}
        <LandingFaqSection />
      </main>

      {/* Footer matching design */}
      <LandingFooter />

      {/* Interactive Demo Video Modal */}
      <HowItWorksModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
}
