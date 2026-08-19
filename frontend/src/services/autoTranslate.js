/**
 * Free Auto Translation Service using Google Translate Public API Endpoint
 * Caches translated text into localStorage to minimize API requests and boost speed.
 */

const CACHE_KEY = "pacific_translation_cache";

// Load translation cache from localStorage
const getCache = () => {
  try {
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Cache error:", error);
    return {};
  }
};

// Save to cache
const setCache = (sourceText, targetLang, translatedText) => {
  try {
    const cache = getCache();
    const key = `${targetLang}:${sourceText}`;
    cache[key] = translatedText;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error("Cache error:", e);
  }
};

/**
 * Translate a Vietnamese text string to target language (e.g. 'en') automatically
 */
export async function autoTranslateText(text, targetLang = "en") {
  if (!text || typeof text !== "string" || targetLang === "vi") {
    return text;
  }

  // 1. Check local cache first
  const cache = getCache();
  const cacheKey = `${targetLang}:${text}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // 2. Call Google Translate Free API Endpoint
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      text,
    )}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data[0] && Array.isArray(data[0])) {
      const translated = data[0].map((item) => item[0]).join("");
      if (translated) {
        setCache(text, targetLang, translated);
        return translated;
      }
    }
  } catch (error) {
    console.warn("Auto translate error, fallback to original:", error);
  }

  return text;
}
