import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SupportedLanguage = "ar" | "en";

interface AppLangState {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
}

/**
 * Global website language store used across all portals (Store, Merchant, Consumer, Admin).
 * Persists selected language in localStorage under 'foodloop-language'.
 */
export const useAppLang = create<AppLangState>()(
  persist(
    (set) => ({
      lang: "ar",
      setLang: (lang) => {
        if (typeof document !== "undefined") {
          document.documentElement.lang = lang;
          document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        }
        set({ lang });
      },
    }),
    {
      name: "foodloop-language",
    },
  ),
);
