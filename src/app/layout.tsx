import type { Metadata } from "next";
import { Cairo, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { AppClientProviders } from "@/components/providers/AppClientProviders";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["system-ui", "Tahoma", "sans-serif"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title: "FoodLoop",
  description:
    "FoodLoop — high-efficiency logistics with the tactile, approachable nature of sustainability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-sans">
        <AppClientProviders>{children}</AppClientProviders>
      </body>
    </html>
  );
}
