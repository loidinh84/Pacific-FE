import { create } from "zustand";
import { translations } from "../locales";
import { autoTranslateText } from "../services/autoTranslate";

export const useLanguageStore = create((set, get) => ({
  language: localStorage.getItem("pacific_lang") || "vi",
  dynamicTranslations: {},

  changeLanguage: (lang) => {
    if (lang === "vi" || lang === "en" || translations[lang]) {
      localStorage.setItem("pacific_lang", lang);
      set({ language: lang });
    }
  },

  // Trigger background auto-translation for missing texts
  translateDynamic: async (text, targetLang) => {
    if (!text || targetLang === "vi") return;
    const cacheKey = `${targetLang}:${text}`;
    const { dynamicTranslations } = get();

    if (!dynamicTranslations[cacheKey]) {
      const translated = await autoTranslateText(text, targetLang);
      set((state) => ({
        dynamicTranslations: {
          ...state.dynamicTranslations,
          [cacheKey]: translated,
        },
      }));
    }
  },

  // Translation helper function
  t: (pathOrText) => {
    if (!pathOrText) return "";
    const { language, dynamicTranslations, translateDynamic } = get();

    // 1. Try finding in fixed dictionary by path key (e.g. "nav.explore")
    const keys = pathOrText.split(".");
    let current = translations[language];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        current = null;
        break;
      }
    }

    if (current && typeof current === "string") {
      return current;
    }

    // 2. If path key not found, fallback to raw text auto-translation
    if (language === "vi") {
      return pathOrText;
    }

    const dynamicKey = `${language}:${pathOrText}`;
    if (dynamicTranslations[dynamicKey]) {
      return dynamicTranslations[dynamicKey];
    }

    // Trigger auto translation in background
    translateDynamic(pathOrText, language);

    return pathOrText;
  },
}));
