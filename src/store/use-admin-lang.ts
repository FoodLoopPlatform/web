import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminLangState {
  lang: "ar" | "en";
  setLang: (lang: "ar" | "en") => void;
}

export const useAdminLang = create<AdminLangState>()(
  persist(
    (set) => ({
      lang: "ar",
      setLang: (lang) => set({ lang }),
    }),
    {
      name: "foodloop-admin-lang",
    }
  )
);
