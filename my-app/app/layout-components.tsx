// layout-components.tsx — Sidebar, Topbar ใช้ร่วมกันทุกหน้า
"use client";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "./theme";

/* ─────────────── SIDEBAR ─────────────── */
export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const nav = [
    {
      section: "WORKSPACE",
      items: [
        { label: "Dashboard", path: "/dashboard", icon: <IconGrid /> },
        { label: "Quotations", path: "/", icon: <IconDoc /> },
        { label: "Sales Orders", path: "/orders", icon: <IconCart /> },
      ],
    },
  ];

  return (
    <aside className="qf-sidebar">
      {/* Logo */}
      <div className="qf-sidebar-logo">
        <div className="qf-sidebar-logo-icon">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <span className="qf-sidebar-logo-text">SalesPro</span>
      </div>

      {/* Nav */}
      {nav.map(group => (
        <div className="qf-sidebar-section" key={group.section}>
          <div className="qf-sidebar-section-label">{group.section}</div>
          {group.items.map(item => (
            <div
              key={item.path}
              className={`qf-nav-item ${pathname === item.path || (item.path !== "/" && pathname?.startsWith(item.path)) ? "active" : ""}`}
              onClick={() => router.push(item.path)}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      ))}

      {/* Footer tip */}
      <div className="qf-sidebar-footer">
        <strong>Pro Tip 💡</strong>
        <br />Convert quotes to orders in one click.
      </div>
    </aside>
  );
}

/* ─────────────── TOPBAR ─────────────── */
export function Topbar({ breadcrumbs }: { breadcrumbs: string[] }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="qf-topbar">
      <div className="qf-topbar-left">
        {breadcrumbs.map((b, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {i > 0 && <span className="qf-topbar-sep">/</span>}
            <span className={`qf-topbar-title ${i < breadcrumbs.length - 1 ? "text-secondary" : ""}`}
              style={{ color: i < breadcrumbs.length - 1 ? "var(--text-tertiary)" : "var(--text-primary)" }}>
              {b}
            </span>
          </span>
        ))}
      </div>
      <div className="qf-topbar-right">
        <div className="qf-live-pill">
          <span className="qf-live-dot" />
          LIVE
        </div>
        <button className="qf-icon-btn" onClick={toggleTheme} title="Toggle theme">
          {isDark ? <IconSun /> : <IconMoon />}
        </button>
        <div className="qf-avatar">S</div>
      </div>
    </header>
  );
}

/* ─────────────── ICONS ─────────────── */
function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}
function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
    </svg>
  );
}
function IconCart() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}
function IconSun() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}