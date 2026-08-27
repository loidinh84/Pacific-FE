import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("pacific-admin-theme") || "dark";
  });

  useEffect(() => {
    const syncThemeToDom = (t) => {
      const root = document.documentElement;
      if (t === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
      }
    };

    // Initial DOM sync
    syncThemeToDom(theme);

    const handleThemeChange = () => {
      const current = localStorage.getItem("pacific-admin-theme") || "dark";
      setThemeState(current);
      syncThemeToDom(current);
    };

    window.addEventListener("pacific_theme_change", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);

    return () => {
      window.removeEventListener("pacific_theme_change", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, [theme]);

  const setTheme = (newTheme) => {
    localStorage.setItem("pacific-admin-theme", newTheme);
    setThemeState(newTheme);
    window.dispatchEvent(new Event("pacific_theme_change"));
  };

  const toggleTheme = () => {
    const current = localStorage.getItem("pacific-admin-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return { theme, toggleTheme, setTheme, isDark: theme === "dark" };
}
