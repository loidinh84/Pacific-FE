import { useLanguageStore } from "../stores/useLanguageStore";

export function useLanguage() {
  const language = useLanguageStore((state) => state.language);
  const changeLanguage = useLanguageStore((state) => state.changeLanguage);
  const t = useLanguageStore((state) => state.t);

  return { language, changeLanguage, t };
}
