import { useEffect, useState } from "react";

export const getThemeMode = () => {
  if (typeof window === "undefined") {
    return "light"; // Default for SSR
  }
  const storageKey = "theme";
  const saved = localStorage?.getItem(storageKey);
  const query = "(prefers-color-scheme: dark)";
  const prefersDark = window?.matchMedia(query).matches;
  const prefers = prefersDark ? "dark" : "light";
  return saved ?? prefers;
};

export function useDocusaurusTheme() {
  const [theme, setTheme] = useState(getThemeMode());

  useEffect(() => {
    if (typeof document === "undefined") return;

    const html = document.documentElement;
    const config = { attributes: true, attributeFilter: ["data-theme"] };

    const setThemeMode = () => {
      const value = html.getAttribute("data-theme");
      const themeMode = value === "dark" ? "dark" : "light";
      setTheme(themeMode);
    };

    const observer = new MutationObserver(setThemeMode);
    observer.observe(html, config);

    return () => observer.disconnect();
  }, []);

  return theme;
}
