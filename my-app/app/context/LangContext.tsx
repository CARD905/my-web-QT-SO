"use client";
import { createContext, useContext, useState } from "react";

type Lang = "th" | "en";

type LangContextType = {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextType | null>(null);

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>("th");

  const toggleLang = () => {
    setLang(l => (l === "th" ? "en" : "th"));
  };

  const translations = {
    th: {
      customers: "ลูกค้า",
      allCustomers: "ลูกค้าทั้งหมด",
      newCustomer: "เพิ่มลูกค้า",
      cancel: "ยกเลิก",
      save: "บันทึก",
    },
    en: {
      customers: "Customers",
      allCustomers: "All Customers",
      newCustomer: "New Customer",
      cancel: "Cancel",
      save: "Save",
    },
  };

  const t = (key: string) => {
    return translations[lang][key as keyof typeof translations["th"]] || key;
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error("useLang must be used inside LangProvider");
  }
  return ctx;
};