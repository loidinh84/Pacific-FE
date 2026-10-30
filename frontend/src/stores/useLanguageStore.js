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
  t: (pathOrText, fallback) => {
    if (!pathOrText) return fallback || "";
    const { language, dynamicTranslations, translateDynamic } = get();

    // Tìm kiếm theo khóa trong từ điển ngôn ngữ
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

    // 1b. If not found in current language, try other language dictionary as fallback
    const altLang = language === "vi" ? "en" : "vi";
    if (translations[altLang]) {
      let altCurrent = translations[altLang];
      for (const key of keys) {
        if (altCurrent && altCurrent[key] !== undefined) {
          altCurrent = altCurrent[key];
        } else {
          altCurrent = null;
          break;
        }
      }
      if (altCurrent && typeof altCurrent === "string") {
        return altCurrent;
      }
    }

    // If explicit fallback provided
    if (fallback !== undefined) {
      return fallback;
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
