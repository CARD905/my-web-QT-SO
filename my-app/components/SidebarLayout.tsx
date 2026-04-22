"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "../app/theme";
import { useEffect, useRef } from "react";

/* ============================================================
   SIDEBAR LAYOUT  –  wrap all pages with this
   Usage:
     <SidebarLayout>
       <YourPageContent />
     </SidebarLayout>
   ============================================================ */

const navItems = [
  {
    label: "Dashboard",
    href: "/quotations",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Quotations",
    href: "/",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: "Sales Orders",
    href: "/sale-order",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ---- floating particles ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);

    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.35 + 0.1,
    }));

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = theme === "dark"
          ? `rgba(167,139,250,0.004${p.alpha})`
          : `rgba(124,58,237,0.004${p.alpha * 0.6})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, [theme]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>

      {/* ---- BG mesh ---- */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "var(--gradient-mesh)",
        transition: "background 0.5s ease",
      }} />

      {/* ---- particles ---- */}
      <canvas ref={canvasRef} style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        width: "100%", height: "100%",
      }} />

      {/* ================= SIDEBAR ================= */}
      <aside style={{
        width: "220px",
        minHeight: "100vh",
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "background 0.4s, border-color 0.4s",
      }}>

        {/* Logo */}
        <div style={{
          padding: "24px 20px 20px",
          display: "flex", alignItems: "center", gap: "11px",
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #3dceef, #0396e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
            flexShrink: 0,
            position: "relative",
            overflow: "visible",
          }}>
            {/* spin ring */}
            <div style={{
              position: "absolute", inset: "-3px",
              borderRadius: "13px",
              border: "1.5px solid transparent",
              borderTopColor: "rgba(167,139,250,0.6)",
              borderRightColor: "rgba(244,114,182,0.4)",
              animation: "spin-slow 8s linear infinite",
            }} />
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <span style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "18px",
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Wisdom</span>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.06em", fontWeight: 500 }}>SALES PRO</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ margin: "0 16px 16px", height: "1px", background: "var(--border)" }} />

        {/* Label */}
        <div style={{
          padding: "0 20px 8px",
          fontSize: "10px", fontWeight: 600,
          color: "var(--text-muted)",
          letterSpacing: "0.1em",
        }}>WORKSPACE</div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: "3px" }}>
          {navItems.map(item => {
            const active = isActive(item.href);
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                style={{
                  display: "flex", alignItems: "center", gap: "11px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: "13.5px",
                  fontWeight: active ? 600 : 500,
                  letterSpacing: "-0.01em",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.2s ease",
                  background: active
                    ? "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(219,39,119,0.12))"
                    : "transparent",
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  boxShadow: active ? "inset 0 0 0 1px rgba(124,58,237,0.25)" : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  }
                }}
              >
                {/* active indicator */}
                {active && (
                  <span style={{
                    position: "absolute", left: 0, top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px", height: "20px",
                    borderRadius: "0 4px 4px 0",
                    background: "linear-gradient(to bottom, var(--accent), var(--accent-2))",
                  }} />
                )}
                <span style={{ opacity: active ? 1 : 0.7 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Pro tip */}
        <div style={{
          margin: "16px",
          padding: "14px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(219,39,119,0.08))",
          border: "1px solid rgba(124,58,237,0.2)",
        }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", marginBottom: "4px", letterSpacing: "0.02em" }}>
            ✦ Pro Tip
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Convert quotes to orders in one click.
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div style={{ flex: 1, marginLeft: "220px", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>

        {/* TOP BAR */}
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          height: "56px",
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          padding: "0 28px",
          background: "var(--bg-sidebar)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          gap: "12px",
          transition: "background 0.4s, border-color 0.4s",
        }}>
          {/* Live badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "5px 12px",
            borderRadius: "20px",
            border: "1px solid rgba(34,197,94,0.3)",
            background: "rgba(34,197,94,0.1)",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 0 0 rgba(34,197,94,0.5)",
              animation: "pulse-ring 1.5s ease-out infinite",
              display: "inline-block",
            }} />
            <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#22c55e", letterSpacing: "0.04em" }}>LIVE</span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            style={{
              width: "36px", height: "36px", borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-secondary)",
              transition: "all 0.25s ease",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
              (e.currentTarget as HTMLElement).style.color = "var(--accent)";
              (e.currentTarget as HTMLElement).style.transform = "rotate(20deg) scale(1.05)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              (e.currentTarget as HTMLElement).style.transform = "rotate(0) scale(1)";
            }}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Avatar */}
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #db2777)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: 700, color: "white",
            boxShadow: "0 0 0 2px var(--bg-sidebar), 0 0 0 3px rgba(124,58,237,0.4)",
            cursor: "pointer",
          }}>W</div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}