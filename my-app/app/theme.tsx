"use client";
import { createContext, useContext, useEffect, useState } from "react";

/* ============================================================
   THEME CONTEXT  –  import this in every page / layout
   ============================================================ */

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

/* ---- Provider (wrap inside root layout) ---- */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("wisdom-theme") as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("wisdom-theme", theme);
  }, [theme]);

  const toggle = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ============================================================
   GLOBAL CSS  –  paste into globals.css
   ============================================================

@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

:root {
  --font-display: 'Outfit', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'DM Mono', monospace;
}

[data-theme="dark"] {
  --bg-base: #0a0a12;
  --bg-card: rgba(255,255,255,0.04);
  --bg-card-hover: rgba(255,255,255,0.07);
  --bg-sidebar: rgba(10,10,20,0.95);
  --border: rgba(255,255,255,0.08);
  --border-hover: rgba(139,92,246,0.4);
  --text-primary: #f1f0ff;
  --text-secondary: #9b92c8;
  --text-muted: #5e5880;
  --accent: #a78bfa;
  --accent-2: #f472b6;
  --accent-glow: rgba(167,139,250,0.25);
  --gradient-mesh: radial-gradient(ellipse 80% 60% at 50% -20%, rgba(139,92,246,0.25) 0%, transparent 70%),
                   radial-gradient(ellipse 40% 40% at 80% 80%, rgba(244,114,182,0.12) 0%, transparent 60%),
                   radial-gradient(ellipse 60% 50% at 0% 100%, rgba(99,102,241,0.1) 0%, transparent 60%);
  --shadow-card: 0 1px 3px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3);
  --shadow-glow: 0 0 40px rgba(167,139,250,0.15);
  --input-bg: rgba(255,255,255,0.06);
  --scrollbar-thumb: rgba(139,92,246,0.3);
}

[data-theme="light"] {
  --bg-base: #f4f2ff;
  --bg-card: rgba(255,255,255,0.85);
  --bg-card-hover: rgba(255,255,255,0.98);
  --bg-sidebar: rgba(248,247,255,0.97);
  --border: rgba(139,92,246,0.12);
  --border-hover: rgba(139,92,246,0.4);
  --text-primary: #1a1630;
  --text-secondary: #6b5f9e;
  --text-muted: #a89ecc;
  --accent: #7c3aed;
  --accent-2: #db2777;
  --accent-glow: rgba(124,58,237,0.15);
  --gradient-mesh: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(167,139,250,0.3) 0%, transparent 70%),
                   radial-gradient(ellipse 40% 40% at 85% 85%, rgba(244,114,182,0.2) 0%, transparent 60%),
                   radial-gradient(ellipse 60% 50% at 0% 100%, rgba(99,102,241,0.15) 0%, transparent 60%);
  --shadow-card: 0 1px 3px rgba(139,92,246,0.08), 0 8px 32px rgba(139,92,246,0.12);
  --shadow-glow: 0 0 40px rgba(124,58,237,0.1);
  --input-bg: rgba(139,92,246,0.05);
  --scrollbar-thumb: rgba(139,92,246,0.25);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-body);
  background: var(--bg-base);
  color: var(--text-primary);
  transition: background 0.4s ease, color 0.3s ease;
  min-height: 100vh;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes pulse-ring {
  0%   { transform: scale(0.9); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-8px) rotate(1deg); }
  66%       { transform: translateY(4px) rotate(-1deg); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.fade-up { animation: fadeUp 0.5s ease both; }
.fade-up-1 { animation-delay: 0.08s; }
.fade-up-2 { animation-delay: 0.16s; }
.fade-up-3 { animation-delay: 0.24s; }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 8px; }

============================================================ */