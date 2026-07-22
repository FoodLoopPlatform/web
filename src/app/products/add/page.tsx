"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
import { ImageUpload } from "@/components/products/ImageUpload";
import { ClassificationSelect } from "@/components/products/ClassificationSelect";
import { ProductInfoForm } from "@/components/products/ProductInfoForm";
import { ExpiryDateSelector } from "@/components/products/ExpiryDateSelector";

export default function AddProductPage() {
  const [expiryTab, setExpiryTab] = useState<"manual" | "scan">("manual");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [expiryDate, setExpiryDate] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Dairy");

  // Simulated image upload
  const handleSimulateUpload = () => {
    const mockImages = [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEAnGLAbGf12zT2EtNl6h8RQbU1yyyOP9MPKft_V1MkKF61lagMFAN-a1DpqLJJCXtIv9NnQAnEL-B6xWG0Jzj9WXPxvoZeEJztOCU0NeO61FjlTkX0hkXY8_ZmiEkmXzhCf3m_ILlrosvwBytYAxXMaq-50lBwunlMxtGTVqHqPDUsSz9vhXSzNKr8wn0rs3Dm04YdvSZGLFj72k3xBTHlQzM2mvn9OPqO6WqCjEeA5am9hHlJ0xbBte0Z6gb2XIwTW6QWf9pu0g",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFOMDYMe_zlD-fqblViZDSaue7PBZweMDMOH6iKU1K4-jbukMgsupi9xSyU9lq0BwCNonaEQq-GUJcmbtMWFrhtKUn41nyPd-dgbuPPS7dI3yIOiLLCbX9_5g6MvFITbi85nV1WJM99FmqrfXXML5V_8S1iaWOkasOntpOyHQgQeGVSkkOnsYKiKYLaIJAPkM6jt3yHyh7E7lUNyRDWKlC3MbMQN6zA90EmzPvJzt_Lf1bT01JUGJWsPeogCNKS-uejjTWToWyTrw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB473NxorKS0PLtB2mH9eA8VE2ubrx6owKfTgEo9rWAefPnNTrB_5zQoDpH_vcnmwi6ywJ18l7PiTCngZM1OXWjc0n4w51OChPGfn3xxMA49RO5tZJMK4ZzcGeHN8pxmfw_5XzJ8zTwpjPOoH0Wrl1OMZQDje3SX-3t4m_RKjCJX4u64wm1KtFydvAqZYIcKEBPuDoaAydJO7It0VoEhJcUok5qwFBmIWBELY4m2Kdo2xn0YjkJU_bBK-d1XbMsrFVsxdldZS4X_vI",
    ];
    const randomImg = mockImages[Math.floor(Math.random() * mockImages.length)];
    setThumbnailUrl(randomImg);
  };

  // Simulated OCR Scanning
  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanSuccess(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      const threeDaysAhead = new Date();
      threeDaysAhead.setDate(threeDaysAhead.getDate() + 3);
      setExpiryDate(threeDaysAhead.toISOString().split("T")[0]);
    }, 2000);
  };

  return (
    <div
      className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen flex font-sans"
      dir="rtl"
    >
      {/* Permanent SideNavBar on Desktop */}
      <aside
        className={`fixed right-0 top-0 h-screen hidden lg:block z-50 transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"}`}
      >
        <MerchantSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Mobile Drawer SideNavBar */}
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
                className="p-1 rounded-full bg-[#f2f5ee] border border-[#bfc9be] text-[#00381a] hover:bg-[#e0e3dd] transition-all cursor-pointer flex items-center justify-center"
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
        {/* Header */}
        <header className="w-full h-16 sticky top-0 bg-[#fdf9f2] border-b border-[#bfc9be] flex justify-between items-center px-margin-mobile md:px-margin-desktop z-40">
          <div className="flex items-center gap-4">
            {/* Hamburger menu button for opening drawer on mobile */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-[#e0e3dd] transition-colors flex items-center justify-center cursor-pointer"
            >
              <Icon name="menu" className="h-5 w-5 text-[#00381a]" />
            </button>

            {/* Back button */}
            <Link
              href="/inventory"
              className="flex items-center justify-center hover:bg-[#e0e3dd] p-2 rounded-full transition-colors cursor-pointer"
            >
              <Icon name="arrow_forward" className="h-5 w-5 text-[#00381a]" />
            </Link>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#00381a]">
              إضافة منتج جديد
            </h2>
          </div>

          <div className="flex items-center gap-gutter">
            {/* Search orders */}
            <div className="hidden md:flex items-center bg-[#f2f5ee] px-4 py-2 rounded-full border border-[#bfc9be] w-64">
              <Icon name="search" className="h-5 w-5 text-[#404940]" />
              <input
                className="bg-transparent border-none focus:ring-0 text-body-md w-full mr-2 outline-none font-sans"
                placeholder="البحث عن طلبات التوصيل..."
                type="text"
              />
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-4 text-[#00381a]">
              <button className="p-2 hover:bg-[#e0e3dd] rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon name="notifications" className="h-5 w-5 text-[#404940]" />
              </button>
              <button className="p-2 hover:bg-[#e0e3dd] rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon name="help" className="h-5 w-5 text-[#404940]" />
              </button>
              <button className="p-2 hover:bg-[#e0e3dd] rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon name="language" className="h-5 w-5 text-[#404940]" />
              </button>

              <div className="flex items-center gap-2 cursor-pointer mr-2">
                <div className="w-8 h-8 rounded-full bg-[#e6e9e3] flex items-center justify-center overflow-hidden border border-[#bfc9be]">
                  <Image
                    className="w-full h-full object-cover"
                    alt="الملف الشخصي"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlGzOnf-OY5iX3UruQhQF-VbMthZ34BNrvQC242ReI5YVPIyMiVsKSJNLNgm_i3kJBrFK3heJTqkFd3JxL8EoQwX4flTwQ9YGh4A3lVPWrDb32pBi1kdvsd2ZZW1Ym9nv633gdXJUAcemP0QAWxBsQK6p4Nhlf8dMM8GpBpDmes_7HDUk8Lnjz5GH0P_PhukYA0nMdnzemjFK-y_N2yIjP1m9JEZFxylLfi4MS6UJagX2jxtLvl6LmeYFteKAnXfRHNHTUQsob5BY"
                    width={32}
                    height={32}
                    unoptimized
                  />
                </div>
                <span className="font-label-caps text-label-caps font-bold hidden lg:block text-[#404940] mr-1">
                  التاجر
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Form Container */}
        <section className="flex-1 p-margin-mobile md:p-margin-desktop bg-[#fdf9f2] overflow-y-auto">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-lg">
            {/* Left Column: Image & Category */}
            <div className="md:col-span-5 flex flex-col gap-md">
              <ImageUpload
                thumbnailUrl={thumbnailUrl}
                onUploadSimulated={handleSimulateUpload}
              />
              <ClassificationSelect
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>

            {/* Right Column: Details & Expiry */}
            <div className="md:col-span-7 flex flex-col gap-md">
              <ProductInfoForm
                productName={productName}
                setProductName={setProductName}
                price={price}
                setPrice={setPrice}
                quantity={quantity}
                setQuantity={setQuantity}
              />

              <ExpiryDateSelector
                expiryTab={expiryTab}
                setExpiryTab={setExpiryTab}
                expiryDate={expiryDate}
                setExpiryDate={setExpiryDate}
                isScanning={isScanning}
                setIsScanning={setIsScanning}
                scanSuccess={scanSuccess}
                setScanSuccess={setScanSuccess}
                onSimulateScan={handleSimulateScan}
              />

              {/* Form Action Buttons */}
              <div className="flex items-center gap-md pt-4 flex-col sm:flex-row">
                <Link href="/inventory" className="w-full sm:flex-1">
                  <button
                    type="button"
                    className="w-full py-4 px-6 border-2 border-[#bfc9be] rounded-xl font-bold text-[#404940] hover:bg-[#e6e9e3] transition-all active:scale-95 text-label-md font-sans cursor-pointer"
                  >
                    حفظ كمسودة
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    alert("تم حفظ المنتج ونشره بنجاح في سوق المنتجات!");
                    window.location.href = "/inventory";
                  }}
                  className="w-full sm:flex-[2] py-4 px-6 bg-[#00381a] text-white rounded-xl font-bold hover:opacity-90 shadow-md shadow-[#00381a]/20 transition-all active:scale-95 text-label-md flex items-center justify-center gap-2 font-sans cursor-pointer"
                >
                  <svg
                    className="h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <span>نشر واعتماد المنتج فوراً</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative Watermark logo */}
        <div className="fixed bottom-0 left-0 p-margin-desktop opacity-5 pointer-events-none select-none">
          <span className="font-display-lg text-display-lg text-[#00381a] -rotate-12 block">
            FoodLoop
          </span>
        </div>
      </main>
    </div>
  );
}
