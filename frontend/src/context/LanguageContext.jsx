/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import { translations } from "../locales";
import { autoTranslateText } from "../services/autoTranslate";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("pacific_lang") || "vi";
  });

  // Dynamic Auto-translated texts memory state
  const [dynamicTranslations, setDynamicTranslations] = useState({});

  const changeLanguage = (lang) => {
    if (lang === "vi" || lang === "en" || translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem("pacific_lang", lang);
    }
  };

  // Auto translate missing strings on the fly
  const translateDynamic = useCallback(async (text, targetLang) => {
    if (!text || targetLang === "vi") return;
    const cacheKey = `${targetLang}:${text}`;

    if (!dynamicTranslations[cacheKey]) {
      const translated = await autoTranslateText(text, targetLang);
      setDynamicTranslations((prev) => ({
        ...prev,
        [cacheKey]: translated,
      }));
    }
  }, [dynamicTranslations]);

  
  const t = (pathOrText) => {
    if (!pathOrText) return "";

    // 1. Try finding in dictionary by path key (e.g., "nav.explore")
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

    // 2. If path key not found, treat pathOrText as a raw string to auto-translate
    if (language === "vi") {
      return pathOrText;
    }

    const dynamicKey = `${language}:${pathOrText}`;
    if (dynamicTranslations[dynamicKey]) {
      return dynamicTranslations[dynamicKey];
    }

    // Trigger background auto translation
    translateDynamic(pathOrText, language);

    // Fallback to original text while translating
    return pathOrText;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
