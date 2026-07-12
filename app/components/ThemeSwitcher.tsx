"use client";

import { useState } from "react";

export const THEME_STORAGE_KEY = "focus-protocol-theme";

export const THEMES: { id: string; label: string }[] = [
  { id: "default", label: "Indigo Night" },
  { id: "hackertype", label: "Hackertype" },
  { id: "sakura", label: "Sakura" },
  { id: "minimal", label: "Minimal" },
  { id: "sunset", label: "Sunset" },
  { id: "forest", label: "Forest" },
  { id: "ocean", label: "Ocean" },
  { id: "dracula", label: "Dracula" },
  { id: "crimson", label: "Crimson" },
  { id: "mono", label: "Mono" },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "default";
    return window.localStorage.getItem(THEME_STORAGE_KEY) ?? "default";
  });

  function applyTheme(id: string) {
    setTheme(id);
    window.localStorage.setItem(THEME_STORAGE_KEY, id);

    if (id === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", id);
    }
  }

  return (
    <div className="card themeSwitcherCard">
      <div className="chartHeaderRow">
        <h2>Theme</h2>

        <div className="themeSelectWrap">
          <span className="themeDot" style={{ background: "var(--accent)" }} />
          <select
            className="themeSelect"
            value={theme}
            onChange={(e) => applyTheme(e.target.value)}
          >
            {THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
