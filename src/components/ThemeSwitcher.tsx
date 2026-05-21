import type { AppearanceMode, DarkPaletteId, ThemeId } from "../hooks/useTheme";

interface Props {
  appearance: AppearanceMode;
  darkPalette: DarkPaletteId;
  resolvedTheme: ThemeId;
  onAppearanceChange: (mode: AppearanceMode) => void;
  onDarkPaletteChange: (palette: DarkPaletteId) => void;
}

function IconMonitor() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export default function ThemeSwitcher({
  appearance,
  darkPalette,
  resolvedTheme,
  onAppearanceChange,
  onDarkPaletteChange,
}: Props) {
  const showDarkStyleToggle = appearance === "dark" || (appearance === "system" && resolvedTheme !== "light");

  return (
    <div className="theme-switcher">
      <span className="theme-switcher-label" id="theme-label">
        Theme
      </span>
      <div
        className="theme-appearance-track"
        role="group"
        aria-labelledby="theme-label"
        aria-label="Color scheme"
      >
        <button
          type="button"
          className={`theme-appearance-btn${appearance === "system" ? " active" : ""}`}
          onClick={() => onAppearanceChange("system")}
          aria-pressed={appearance === "system"}
          title="Use system setting"
        >
          <IconMonitor />
          <span className="visually-hidden">System</span>
        </button>
        <button
          type="button"
          className={`theme-appearance-btn${appearance === "dark" ? " active" : ""}`}
          onClick={() => onAppearanceChange("dark")}
          aria-pressed={appearance === "dark"}
          title="Dark"
        >
          <IconMoon />
          <span className="visually-hidden">Dark</span>
        </button>
        <button
          type="button"
          className={`theme-appearance-btn${appearance === "light" ? " active" : ""}`}
          onClick={() => onAppearanceChange("light")}
          aria-pressed={appearance === "light"}
          title="Light"
        >
          <IconSun />
          <span className="visually-hidden">Light</span>
        </button>
      </div>

      {showDarkStyleToggle && (
        <div className="theme-dark-variant" role="group" aria-label="Dark style">
          <span className="theme-dark-variant-label">Dark style</span>
          <div className="theme-dark-variant-seg">
            <button
              type="button"
              className={`theme-dark-opt${darkPalette === "aurora" ? " active" : ""}`}
              onClick={() => onDarkPaletteChange("aurora")}
              aria-pressed={darkPalette === "aurora"}
              title="Animated glass — recommended"
            >
              Aurora
            </button>
            <button
              type="button"
              className={`theme-dark-opt${darkPalette === "pq" ? " active" : ""}`}
              onClick={() => onDarkPaletteChange("pq")}
              aria-pressed={darkPalette === "pq"}
            >
              PQ dark
            </button>
            <button
              type="button"
              className={`theme-dark-opt${darkPalette === "midnight" ? " active" : ""}`}
              onClick={() => onDarkPaletteChange("midnight")}
              aria-pressed={darkPalette === "midnight"}
            >
              Midnight
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
