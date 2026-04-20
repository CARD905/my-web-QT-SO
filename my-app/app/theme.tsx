// theme.tsx — shared theme provider + global CSS
// วิธีใช้: ครอบ <ThemeProvider> รอบ layout ทั้งหมด
// แล้ว import useTheme() ในแต่ละหน้าเพื่อได้ isDark + toggleTheme

"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeCtx = { isDark: boolean; toggleTheme: () => void };
const ThemeContext = createContext<ThemeCtx>({ isDark: true, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("qf-theme");
    if (saved) setIsDark(saved === "dark");
  }, []);

  const toggleTheme = () => {
    setIsDark(v => {
      localStorage.setItem("qf-theme", !v ? "dark" : "light");
      return !v;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div data-theme={isDark ? "dark" : "light"} style={{ minHeight: "100vh" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// ─── Global CSS (ใส่ใน globals.css หรือ layout.tsx) ───────────────────────
export const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* ─── TOKENS ─── */
[data-theme="dark"] {
  --bg-base:      #0d0d14;
  --bg-surface:   #13131e;
  --bg-elevated:  #1a1a28;
  --bg-overlay:   #20202f;
  --bg-muted:     rgba(255,255,255,0.04);
  --bg-muted-hover: rgba(255,255,255,0.07);

  --text-primary:   #eeeeff;
  --text-secondary: #9090b0;
  --text-tertiary:  #555570;
  --text-placeholder: #444460;

  --border-subtle:  rgba(255,255,255,0.06);
  --border-default: rgba(255,255,255,0.10);
  --border-strong:  rgba(255,255,255,0.16);

  --accent:         #9d7cf8;
  --accent-soft:    rgba(157,124,248,0.14);
  --accent-glow:    rgba(157,124,248,0.25);

  --green:    #2ecc9a;  --green-soft:  rgba(46,204,154,0.12);
  --blue:     #5aabf8;  --blue-soft:   rgba(90,171,248,0.12);
  --amber:    #f5a623;  --amber-soft:  rgba(245,166,35,0.12);
  --red:      #f06a6a;  --red-soft:    rgba(240,106,106,0.12);
  --slate:    #8888a8;  --slate-soft:  rgba(136,136,168,0.12);

  --sidebar-bg:   #0f0f18;
  --sidebar-w:    220px;

  --shadow-card: 0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3);
  --shadow-btn:  0 4px 20px rgba(157,124,248,0.35);
}

[data-theme="light"] {
  --bg-base:      #f4f2ff;
  --bg-surface:   #ffffff;
  --bg-elevated:  #faf8ff;
  --bg-overlay:   #f0eeff;
  --bg-muted:     rgba(109,40,217,0.04);
  --bg-muted-hover: rgba(109,40,217,0.07);

  --text-primary:   #1c1840;
  --text-secondary: #4e4878;
  --text-tertiary:  #9088bb;
  --text-placeholder: #b0a8d8;

  --border-subtle:  rgba(109,40,217,0.08);
  --border-default: rgba(109,40,217,0.13);
  --border-strong:  rgba(109,40,217,0.22);

  --accent:       #7c3aed;
  --accent-soft:  rgba(124,58,237,0.10);
  --accent-glow:  rgba(124,58,237,0.20);

  --green:    #0a9e74;  --green-soft:  rgba(10,158,116,0.10);
  --blue:     #2563eb;  --blue-soft:   rgba(37,99,235,0.10);
  --amber:    #c47d0e;  --amber-soft:  rgba(196,125,14,0.10);
  --red:      #dc2626;  --red-soft:    rgba(220,38,38,0.10);
  --slate:    #6b6b8a;  --slate-soft:  rgba(107,107,138,0.10);

  --sidebar-bg:   #faf9ff;
  --sidebar-w:    220px;

  --shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
  --shadow-btn:  0 4px 20px rgba(124,58,237,0.25);
}

/* ─── RESET & BASE ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 14px; }
body {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  background: var(--bg-base);
  color: var(--text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
input, select, textarea, button { font-family: inherit; }

/* ─── SCROLLBAR ─── */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }

/* ─── LAYOUT ─── */
.qf-layout { display: flex; min-height: 100vh; }

/* ─── SIDEBAR ─── */
.qf-sidebar {
  width: var(--sidebar-w);
  min-height: 100vh;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  padding: 0;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 50;
  transition: background 0.3s;
}
.qf-sidebar-logo {
  display: flex; align-items: center; gap: 10px;
  padding: 18px 20px 16px;
  border-bottom: 1px solid var(--border-subtle);
}
.qf-sidebar-logo-icon {
  width: 30px; height: 30px; border-radius: 8px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.qf-sidebar-logo-icon svg { width: 15px; height: 15px; stroke: white; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.qf-sidebar-logo-text { font-size: 15px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; }
.qf-sidebar-section { padding: 14px 12px 4px; }
.qf-sidebar-section-label { font-size: 10px; font-weight: 600; color: var(--text-tertiary); letter-spacing: 0.08em; text-transform: uppercase; padding: 0 8px; margin-bottom: 4px; }
.qf-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 8px;
  font-size: 13.5px; font-weight: 500; color: var(--text-secondary);
  cursor: pointer; text-decoration: none;
  transition: background 0.15s, color 0.15s;
  margin-bottom: 2px;
}
.qf-nav-item:hover { background: var(--bg-muted-hover); color: var(--text-primary); }
.qf-nav-item.active { background: var(--accent-soft); color: var(--accent); }
.qf-nav-item svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
.qf-sidebar-footer {
  margin-top: auto;
  padding: 14px 16px;
  border-top: 1px solid var(--border-subtle);
  font-size: 11.5px; color: var(--text-tertiary);
}
.qf-sidebar-footer strong { color: var(--accent); }

/* ─── TOPBAR ─── */
.qf-topbar {
  height: 52px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
  position: sticky; top: 0; z-index: 40;
}
.qf-topbar-left { display: flex; align-items: center; gap: 8px; }
.qf-topbar-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.qf-topbar-sep { color: var(--text-tertiary); font-size: 14px; }
.qf-topbar-right { display: flex; align-items: center; gap: 10px; }
.qf-live-pill {
  display: flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 20px;
  background: var(--green-soft); border: 1px solid rgba(46,204,154,0.2);
  font-size: 11px; font-weight: 700; color: var(--green); letter-spacing: 0.06em;
}
.qf-live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); animation: livepulse 2s infinite; }
@keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
.qf-icon-btn {
  width: 34px; height: 34px; border-radius: 8px;
  border: 1px solid var(--border-default); background: var(--bg-muted);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-secondary);
  transition: background 0.15s, color 0.15s;
}
.qf-icon-btn:hover { background: var(--bg-muted-hover); color: var(--text-primary); }
.qf-icon-btn svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.qf-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: white; cursor: pointer;
}

/* ─── PAGE CONTENT ─── */
.qf-content { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
.qf-page { flex: 1; padding: 24px; }

/* ─── SECTION CARD ─── */
.qf-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 20px 22px;
  box-shadow: var(--shadow-card);
  transition: background 0.3s, border-color 0.3s;
}
.qf-card-title {
  font-size: 13px; font-weight: 600; color: var(--text-primary);
  margin-bottom: 16px; padding-bottom: 12px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex; align-items: center; gap: 8px;
}
.qf-card-title svg { width: 15px; height: 15px; stroke: var(--accent); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* ─── FORM ELEMENTS ─── */
.qf-label { font-size: 11.5px; font-weight: 600; color: var(--text-tertiary); letter-spacing: 0.03em; display: block; margin-bottom: 5px; }
.qf-input, .qf-select {
  width: 100%; padding: 8px 11px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  color: var(--text-primary); font-size: 13.5px;
  outline: none; transition: border 0.18s, box-shadow 0.18s;
}
.qf-input::placeholder { color: var(--text-placeholder); }
.qf-input:focus, .qf-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.qf-select { appearance: none; cursor: pointer; }
.qf-input[disabled], .qf-input[readonly] {
  opacity: 0.6; cursor: default;
  background: var(--bg-overlay);
}
.qf-form-row { display: grid; gap: 14px; margin-bottom: 14px; }
.qf-form-row.cols-2 { grid-template-columns: 1fr 1fr; }
.qf-form-row.cols-4 { grid-template-columns: repeat(4, 1fr); }

/* ─── BADGES ─── */
.qf-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
}
.qf-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.badge-confirmed { background: var(--green-soft); color: var(--green); }
.badge-confirmed .qf-badge-dot { background: var(--green); }
.badge-sent { background: var(--blue-soft); color: var(--blue); }
.badge-sent .qf-badge-dot { background: var(--blue); }
.badge-draft { background: var(--slate-soft); color: var(--slate); }
.badge-draft .qf-badge-dot { background: var(--slate); }
.badge-cancel { background: var(--red-soft); color: var(--red); }
.badge-cancel .qf-badge-dot { background: var(--red); }

/* ─── BUTTONS ─── */
.qf-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px; border-radius: 9px; border: none;
  font-size: 13px; font-weight: 600; cursor: pointer;
  font-family: inherit; transition: transform 0.15s, opacity 0.15s, box-shadow 0.15s;
  white-space: nowrap;
}
.qf-btn:hover { transform: translateY(-1px); opacity: 0.92; }
.qf-btn:active { transform: scale(0.97); opacity: 1; }
.qf-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.qf-btn svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }

.btn-primary {
  position: relative; overflow: hidden; color: white;
  background: linear-gradient(115deg, #a855f7 0%, #ec4899 55%, #60a5fa 100%);
  background-size: 200% 200%;
  animation: gradShift 5s ease infinite;
  box-shadow: var(--shadow-btn);
}
@keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
.btn-primary::before { content:''; position:absolute; inset:0; background:linear-gradient(120deg,rgba(255,255,255,0.18) 0%,transparent 55%); pointer-events:none; }
.btn-primary:hover { box-shadow: 0 6px 28px rgba(168,85,247,0.5); opacity: 1; }
.btn-primary .btn-arrow { display:inline-block; transition:transform 0.2s; }
.btn-primary:hover .btn-arrow { transform:translate(2px,-2px); }

.btn-secondary { background: var(--bg-muted); border: 1px solid var(--border-default); color: var(--text-secondary); }
.btn-secondary:hover { background: var(--bg-muted-hover); color: var(--text-primary); opacity: 1; }

.btn-ghost { background: none; border: 1px solid var(--border-default); color: var(--text-secondary); }
.btn-ghost:hover { background: var(--bg-muted); color: var(--text-primary); opacity: 1; }

.btn-danger { background: var(--red-soft); border: 1px solid rgba(240,106,106,0.2); color: var(--red); }
.btn-danger:hover { opacity: 0.85; }

.btn-success { background: var(--green-soft); border: 1px solid rgba(46,204,154,0.2); color: var(--green); }
.btn-success:hover { opacity: 0.85; }

/* ─── TABLE ─── */
.qf-table-wrap { overflow-x: auto; }
.qf-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.qf-table thead tr { border-bottom: 1px solid var(--border-default); }
.qf-table th { padding: 8px 14px; text-align: left; font-size: 11px; font-weight: 700; color: var(--text-tertiary); letter-spacing: 0.07em; text-transform: uppercase; white-space: nowrap; }
.qf-table th.r { text-align: right; }
.qf-table tbody tr { border-bottom: 1px solid var(--border-subtle); transition: background 0.12s; }
.qf-table tbody tr:last-child { border-bottom: none; }
.qf-table tbody tr:hover { background: var(--bg-muted); }
.qf-table td { padding: 13px 14px; color: var(--text-secondary); vertical-align: middle; }
.qf-table td.r { text-align: right; }
.qf-table td.primary { color: var(--text-primary); font-weight: 500; }
.qf-table td.mono { font-family: 'JetBrains Mono', monospace; font-size: 13px; }

/* ─── TOGGLE ─── */
.qf-toggle-wrap { display: flex; align-items: center; gap: 8px; }
.qf-toggle {
  width: 38px; height: 21px; border-radius: 11px;
  background: var(--border-strong); cursor: pointer;
  position: relative; transition: background 0.2s; border: none;
  flex-shrink: 0;
}
.qf-toggle.on { background: var(--accent); }
.qf-toggle-knob {
  position: absolute; top: 2.5px; left: 2.5px;
  width: 16px; height: 16px; border-radius: 50%;
  background: white; transition: transform 0.2s cubic-bezier(.34,1.56,.64,1);
}
.qf-toggle.on .qf-toggle-knob { transform: translateX(17px); }

/* ─── SUMMARY BOX ─── */
.qf-summary-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 13.5px; color: var(--text-secondary); border-bottom: 1px solid var(--border-subtle); }
.qf-summary-row:last-of-type { border-bottom: none; }
.qf-summary-val { font-family: 'JetBrains Mono', monospace; font-size: 13px; }
.qf-summary-total { display: flex; justify-content: space-between; align-items: center; padding: 12px 0 0; margin-top: 4px; border-top: 1px solid var(--border-strong); }
.qf-summary-total-label { font-size: 14px; font-weight: 700; color: var(--text-primary); letter-spacing: 0.04em; text-transform: uppercase; }
.qf-summary-total-val { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 700; color: var(--accent); }

/* ─── ANIMATIONS ─── */
@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
.anim-0 { animation: fadeUp 0.35s ease both; }
.anim-1 { animation: fadeUp 0.35s 0.06s ease both; }
.anim-2 { animation: fadeUp 0.35s 0.12s ease both; }
.anim-3 { animation: fadeUp 0.35s 0.18s ease both; }
.anim-4 { animation: fadeUp 0.35s 0.24s ease both; }
.anim-5 { animation: fadeUp 0.35s 0.30s ease both; }
`;