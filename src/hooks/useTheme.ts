import { useEffect, useMemo, useState } from "react";

/** Legacy single key — kept in sync for boot script and older bookmarks */
export const THEME_STORAGE_KEY = "pq-jwt-debugger-theme";
export const APPEARANCE_KEY = "pq-jwt-debugger-appearance";
export const DARK_PALETTE_KEY = "pq-jwt-debugger-dark-palette";

export type ThemeId = "dark" | "light" | "midnight" | "aurora";
export type AppearanceMode = "system" | "light" | "dark";
export type DarkPaletteId = "pq" | "midnight" | "aurora";

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return true;
  }
}

function paletteToTheme(palette: DarkPaletteId): ThemeId {
  if (palette === "midnight") return "midnight";
  if (palette === "aurora") return "aurora";
  return "dark";
}

export function resolveDataTheme(appearance: AppearanceMode, darkPalette: DarkPaletteId): ThemeId {
  if (appearance === "light") return "light";
  if (appearance === "dark") return paletteToTheme(darkPalette);
  return systemPrefersDark() ? paletteToTheme(darkPalette) : "light";
}

export function applyDataTheme(theme: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

function persistAll(appearance: AppearanceMode, darkPalette: DarkPaletteId, resolved: ThemeId) {
  try {
    localStorage.setItem(APPEARANCE_KEY, appearance);
    localStorage.setItem(DARK_PALETTE_KEY, darkPalette);
    localStorage.setItem(THEME_STORAGE_KEY, resolved);
  } catch {
    /* quota / private mode */
  }
}

function readInitialPrefs(): { appearance: AppearanceMode; darkPalette: DarkPaletteId } {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return { appearance: "dark", darkPalette: "aurora" };
  }
  try {
    const app = localStorage.getItem(APPEARANCE_KEY);
    const palRaw = localStorage.getItem(DARK_PALETTE_KEY);
    const darkPalette: DarkPaletteId =
      palRaw === "midnight" ? "midnight" : palRaw === "aurora" ? "aurora" : palRaw === "pq" ? "pq" : "aurora";

    if (app === "system" || app === "light" || app === "dark") {
      return { appearance: app, darkPalette };
    }

    const legacy = localStorage.getItem(THEME_STORAGE_KEY);
    if (legacy === "light") return { appearance: "light", darkPalette: "pq" };
    if (legacy === "midnight") return { appearance: "dark", darkPalette: "midnight" };
    if (legacy === "aurora") return { appearance: "dark", darkPalette: "aurora" };
    if (legacy === "dark") return { appearance: "dark", darkPalette: "pq" };
  } catch {
    /* ignore */
  }
  return { appearance: "dark", darkPalette: "aurora" };
}

export function useTheme() {
  const [{ appearance, darkPalette }, setPrefs] = useState(readInitialPrefs);

  const resolvedTheme = useMemo(
    () => resolveDataTheme(appearance, darkPalette),
    [appearance, darkPalette],
  );

  useEffect(() => {
    applyDataTheme(resolvedTheme);
    persistAll(appearance, darkPalette, resolvedTheme);
  }, [appearance, darkPalette, resolvedTheme]);

  useEffect(() => {
    if (appearance !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = resolveDataTheme("system", darkPalette);
      applyDataTheme(next);
      persistAll("system", darkPalette, next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [appearance, darkPalette]);

  const setAppearance = (a: AppearanceMode) => setPrefs((p) => ({ ...p, appearance: a }));
  const setDarkPalette = (d: DarkPaletteId) => setPrefs((p) => ({ ...p, darkPalette: d }));

  return {
    appearance,
    setAppearance,
    darkPalette,
    setDarkPalette,
    resolvedTheme,
  };
}
