"use client";

import { useState } from "react";

export const THEME_STORAGE_KEY = "focus-protocol-theme";

export const THEMES: {
  id: string;
  label: string;
  preview: string; // small css gradient used for the swatch preview
}[] = [
  { id: "default", label: "Indigo Night", preview: "linear-gradient(135deg,#05070d,#6366f1)" },
  { id: "hackertype", label: "Hackertype", preview: "linear-gradient(135deg,#000000,#00ff66)" },
  { id: "sakura", label: "Sakura", preview: "linear-gradient(135deg,#fff3f6,#f472b6)" },
  { id: "minimal", label: "Minimal", preview: "linear-gradient(135deg,#f6f6f8,#4f46e5)" },
  { id: "sunset", label: "Sunset", preview: "linear-gradient(135deg,#150806,#f97316)" },
  { id: "forest", label: "Forest", preview: "linear-gradient(135deg,#051209,#22c55e)" },
  { id: "ocean", label: "Ocean", preview: "linear-gradient(135deg,#020c16,#0ea5e9)" },
  { id: "dracula", label: "Dracula", preview: "linear-gradient(135deg,#0e0a17,#bd93f9)" },
  { id: "crimson", label: "Crimson", preview: "linear-gradient(135deg,#130405,#ef4444)" },
  { id: "mono", label: "Mono", preview: "linear-gradient(135deg,#0a0a0a,#e5e5e5)" },
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
      <h2>Themes</h2>

      <div className="themeSwitcherRow">
        {THEMES.map((t) => (
          <button
            key={t.id}
            className={`themeSwatch ${theme === t.id ? "themeSwatchActive" : ""}`}
            onClick={() => applyTheme(t.id)}
            aria-label={`Switch to ${t.label} theme`}
          >
            <span
              className="themeSwatchPreview"
              style={{ background: t.preview }}
            />
            <span className="themeSwatchLabel">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
