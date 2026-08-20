"use client";

import { useState } from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { HowItWorksModal } from "@/components/landing/HowItWorksModal";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("home");
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleNavigate = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
