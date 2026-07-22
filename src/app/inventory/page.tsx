"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { ProductCard, Product } from "@/components/inventory/ProductCard";

export default function InventoryPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const products: Product[] = [
    {
      id: "1",
      sku: "PROD-42901",
      name: "مزيج طماطم موروثة عضوية",
      category: "Produce",
      quantity: 42,
      price: 85.0,
      status: "Published",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDEAnGLAbGf12zT2EtNl6h8RQbU1yyyOP9MPKft_V1MkKF61lagMFAN-a1DpqLJJCXtIv9NnQAnEL-B6xWG0Jzj9WXPxvoZeEJztOCU0NeO61FjlTkX0hkXY8_ZmiEkmXzhCf3m_ILlrosvwBytYAxXMaq-50lBwunlMxtGTVqHqPDUsSz9vhXSzNKr8wn0rs3Dm04YdvSZGLFj72k3xBTHlQzM2mvn9OPqO6WqCjEeA5am9hHlJ0xbBte0Z6gb2XIwTW6QWf9pu0g",
    },
    {
      id: "2",
      sku: "DAIR-8821",
      name: "جبن شيدر معتق حرفي",
      category: "Dairy",
      quantity: 12,
      price: 145.0,
      status: "Pending",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBFOMDYMe_zlD-fqblViZDSaue7PBZweMDMOH6iKU1K4-jbukMgsupi9xSyU9lq0BwCNonaEQq-GUJcmbtMWFrhtKUn41nyPd-dgbuPPS7dI3yIOiLLCbX9_5g6MvFITbi85nV1WJM99FmqrfXXML5V_8S1iaWOkasOntpOyHQgQeGVSkkOnsYKiKYLaIJAPkM6jt3yHyh7E7lUNyRDWKlC3MbMQN6zA90EmzPvJzt_Lf1bT01JUGJWsPeogCNKS-uejjTWToWyTrw",
    },
    {
      id: "3",
      sku: "BAKE-1120",
      name: "رغيف خبز عجين مخمر ريفي",
      category: "Bakery",
      quantity: 0,
      price: 60.0,
      status: "Out of Stock",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB473NxorKS0PLtB2mH9eA8VE2ubrx6owKfTgEo9rWAefPnNTrB_5zQoDpH_vcnmwi6ywJ18l7PiTCngZM1OXWjc0n4w51OChPGfn3xxMA49RO5tZJMK4ZzcGeHN8pxmfw_5XzJ8zTwpjPOoH0Wrl1OMZQDje3SX-3t4m_RKjCJX4u64wm1KtFydvAqZYIcKEBPuDoaAydJO7It0VoEhJcUok5qwFBmIWBELY4m2Kdo2xn0YjkJU_bBK-d1XbMsrFVsxdldZS4X_vI",
    },
    {
      id: "4",
      sku: "PANT-5541",
      name: "عسل برسيم خام طبيعي",
      category: "Pantry",
      quantity: null,
      price: 120.0,
      status: "Draft",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDlJSTg3z3fHzUht4U2OdF7-cd1oZc8ADdTlu-Rmf2eGNqitnff_wGeHYZq6cWQOmPDKv59OD5ZI4AmreiJ7MOz3ueypRP-0Rn3_eIyNZ-8H3hg-fvsjBpgz3CwgvjNyPhmJYqtRVqT9bG5ahJal-Xu-9s_Gy4QWlk6hMoKycSj9NZEo-pQuyxvn5TnkqeFhaJ6_YpJH322FeM4JqAkMUIOAuRE2SBq1zCudz0zOh2Y2KpwqYCbsZ9ySdbnAm-dDg99VTGrdLguLtE",
    },
    {
      id: "5",
      sku: "DAIR-9912",
      name: "بيض بلدي تربية حرة طازج",
      category: "Dairy",
      quantity: 120,
      price: 110.0,
      status: "Published",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCoNNJju4uC-gHDB8j9EWDQFkHdgnuzq86cY_ystCjcsAFnjVrTmFyhLsQeHP-TgVTgDeweY6ygEktGIMoQaTCgrADeaL8cqAlvK5SvaibxQY_H-d9egqZk4f-GDqjII0elSvzXBcVuWon8b4csSmi6UTB1tj_qcZrfzb9lDSV_vThfXKGsdwYPsdRfn9FwsEniVc8P2-wVUY7t1j66_iuZCGXW0vNGHNvfiisBA0Emi2JGJsKdG4W0V4LJazeKb0cjcC4mJtNsMCM",
    },
    {
      id: "6",
      sku: "PROD-3301",
      name: "كرنب مجعد عضوي طازج",
      category: "Produce",
      quantity: 50,
      price: 35.0,
      status: "Published",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCoTM03Kt9vutkx7grYqNVXMl-eq1bBaU-h9xI4lmeMpgS7nYYF8VeI4Q8pRV_EKPcFQJnZG3xzFFbuL_XIzJRhWa7cqd3q9L7vybuAGmjco3QCF3qcdmPnM8aewVP5mHrVjDknFJmpt2j0RMiXpe6PxeMrzOAj7dS-EIFHgN6Qj5Cyr12IW27-T4lIaChsKWAzZ5pljCSF_YhtE7Rdk1DC7uQ_DNwnbB17My4Gs6g3YpKInftfe--d3OIQDY7ogIiybPGMkSgvAD4",
    },
  ];

  // Filter products based on selected options
  const filteredProducts = products.filter((product) => {
    const statusMatch =
      statusFilter === "All" || product.status === statusFilter;
    const categoryMatch =
      categoryFilter === "All" || product.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  return (
    <div
      className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen flex font-sans"
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
        {/* Top Header */}
        <header className="h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full bg-[#f2f5ee] border-b border-[#bfc9be] sticky top-0 z-40">
          <div className="flex items-center gap-md flex-1">
            {/* Hamburger menu to toggle sidebar drawer on mobile */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-[#e0e3dd] transition-colors flex items-center justify-center cursor-pointer"
            >
              <Icon name="menu" className="h-5 w-5 text-[#00381a]" />
            </button>

            {/* Search Input (Responsive layout) */}
            <div className="relative max-w-md w-full hidden md:block">
              <Icon
                name="search"
                className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#404940]"
              />
              <input
                className="w-full bg-[#e6e9e3] border-none rounded-full py-2 pr-11 pl-4 font-body-md text-body-md focus:ring-2 focus:ring-[#00381a] transition-all outline-none"
                placeholder="البحث في المخزون، أو الفئات..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-md">
            <div className="flex items-center gap-sm">
              <button className="p-2 hover:bg-[#e0e3dd] rounded-full transition-colors relative flex items-center justify-center cursor-pointer">
                <Icon name="notifications" className="h-5 w-5 text-[#404940]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-[#e0e3dd] rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon name="help" className="h-5 w-5 text-[#404940]" />
              </button>
              <button className="p-2 hover:bg-[#e0e3dd] rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon name="language" className="h-5 w-5 text-[#404940]" />
              </button>
            </div>
            <div className="h-8 w-px bg-[#bfc9be]"></div>

            {/* User Profile */}
            <div className="flex items-center gap-sm cursor-pointer hover:bg-[#e0e3dd] p-1 pl-3 pr-1 rounded-full transition-all">
              <Image
                className="w-8 h-8 rounded-full border border-[#bfc9be] object-cover"
                alt="صورة التاجر"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7EfrRn1_xXKbgGL1H277hYXnto2yQu2WUDblQdGokRMfxKC3QuIg8BZRSTkCVRtFkktTzioSzyIv9V1fmiUZsycopkgtblQWbk7BxfAadXoJGs4fT8u7z06cOJ3czQH29Sj0lI3k7GS7ARi4YhC6ykzWcS7DkBJDCcW-efZPz_RcSg9qFdhw7aL2cyC4Pwkhv7g6hjxcRfTGRenfXQYwcMRLaI5ws9Cn-mYRJ3rWzetGk3PoCnTyfCDoRSLg_lTxngOjG63LE7h4"
                width={32}
                height={32}
                unoptimized
              />
              <span className="font-label-caps text-label-caps text-[#00381a] font-bold hidden md:block">
                سوبرماركت النيل
              </span>
            </div>
          </div>
        </header>

        {/* Live Inventory Content */}
        <section className="px-margin-mobile md:px-margin-desktop py-lg">
          <InventoryHeader />

          <InventoryFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        </section>

        {/* Product Grid Section */}
        <section className="px-margin-mobile md:px-margin-desktop pb-xl flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {/* Empty Add New Product Card */}
            <Link
              href="/products/add"
              className="bg-[#e6e9e3]/30 rounded-xl border-2 border-dashed border-[#bfc9be] flex flex-col items-center justify-center p-lg text-[#404940] hover:border-[#00381a] hover:bg-[#f2f5ee] transition-all cursor-pointer group min-h-[300px] text-center"
            >
              <Icon
                name="add_circle"
                className="h-10 w-10 mb-4 group-hover:scale-110 transition-transform text-[#00381a]"
              />
              <p className="font-bold text-body-md">إضافة منتج جديد للكتالوج</p>
              <p className="text-xs text-[#404940] opacity-75 mt-1">
                تعبئة البيانات والأسعار يدوياً
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
