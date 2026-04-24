"use client";
/* ================================================================
   app/login/page.tsx
   - Works for BOTH sale and approver roles
   - POST /auth/login → { token, user: { role, ... } }
   - Stores token in localStorage + redirects by role
   ================================================================ */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // redirect if already logged in
    const token = localStorage.getItem("wisdom-token");
    const role  = localStorage.getItem("wisdom-role");
    if (token) {
      router.replace(role === "approver" ? "/approver" : "/");
    }
  }, []);

  /* floating particles */
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.4 + 0.1,
    }));
    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${p.a})`; ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  const login = async () => {
    if (!username || !password) { setError("Please enter username and password"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      // store auth
      localStorage.setItem("wisdom-token", data.token);
      localStorage.setItem("wisdom-role",  data.user.role);
      localStorage.setItem("wisdom-user",  JSON.stringify(data.user));
      // redirect by role
      if (data.user.role === "approver") router.replace("/approver");
      else router.replace("/");
    } catch { setError("Cannot connect to server"); }
    finally { setLoading(false); }
  };

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#f0eeff", fontSize: "14px",
    fontFamily: "'DM Sans',sans-serif",
    outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const demoAccounts = [
    { role: "sale",     username: "sale1",     label: "Sale Account",    color: "#7c3aed", icon: "💼" },
    { role: "approver", username: "approver1", label: "Approver Account",color: "#059669", icon: "✅" },
  ];

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: "#080810" }}>

      {/* BG gradient mesh */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 80% 70% at 50% -10%, rgba(124,58,237,0.3) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 85% 85%, rgba(219,39,119,0.15) 0%, transparent 55%)" }} />
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none" }} />

      {/* Card */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "420px", margin: "0 20px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg,#7c3aed,#db2777)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 8px 32px rgba(124,58,237,0.4)", position: "relative" }}>
            <div style={{ position: "absolute", inset: "-3px", borderRadius: "19px", border: "1.5px solid transparent", borderTopColor: "rgba(167,139,250,0.6)", borderRightColor: "rgba(244,114,182,0.4)", animation: "spin-slow 4s linear infinite" }} />
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "28px", fontWeight: 900, letterSpacing: "-0.04em", background: "linear-gradient(135deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "4px" }}>
            Wisdom Sales Pro
          </h1>
          <p style={{ fontSize: "13.5px", color: "rgba(155,147,200,0.8)" }}>Sign in to your account</p>
        </div>

        {/* Form card */}
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", padding: "32px", backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: "20px", padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", fontSize: "13.5px", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
              {error}
            </div>
          )}

          {/* Username */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgba(155,147,200,0.9)", marginBottom: "7px", letterSpacing: "0.04em" }}>USERNAME</label>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(155,147,200,0.5)" }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="e.g. sale1 or approver1"
                style={{ ...inputBase, paddingLeft: "42px" }}
                onFocus={e => { e.target.style.borderColor = "rgba(167,139,250,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
                onKeyDown={e => e.key === "Enter" && login()}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgba(155,147,200,0.9)", marginBottom: "7px", letterSpacing: "0.04em" }}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(155,147,200,0.5)" }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" /></svg>
              <input
                type={showPass ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="password123"
                style={{ ...inputBase, paddingLeft: "42px", paddingRight: "44px" }}
                onFocus={e => { e.target.style.borderColor = "rgba(167,139,250,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
                onKeyDown={e => e.key === "Enter" && login()}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(155,147,200,0.5)", padding: "4px", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(167,139,250,0.9)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(155,147,200,0.5)"}
              >
                {showPass
                  ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                }
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button onClick={login} disabled={loading}
            style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: loading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg,#7c3aed,#db2777)", color: "white", fontSize: "15px", fontWeight: 800, fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.01em", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 24px rgba(124,58,237,0.45)", transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(124,58,237,0.55)"; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(124,58,237,0.45)"; }}
          >
            {loading ? (
              <><div style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin-slow 0.7s linear infinite" }} /> Signing in...</>
            ) : "✦ Sign In"}
          </button>
        </div>

        {/* Demo accounts */}
        <div style={{ marginTop: "20px", padding: "20px", borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(155,147,200,0.6)", letterSpacing: "0.08em", marginBottom: "12px" }}>DEMO ACCOUNTS (password: password123)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {demoAccounts.map(acc => (
              <button key={acc.username}
                onClick={() => { setUsername(acc.username); setPassword("password123"); }}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", border: `1px solid ${acc.color}30`, background: `${acc.color}10`, cursor: "pointer", textAlign: "left", transition: "all 0.2s", fontFamily: "'DM Sans',sans-serif" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${acc.color}20`; (e.currentTarget as HTMLElement).style.borderColor = `${acc.color}50`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${acc.color}10`; (e.currentTarget as HTMLElement).style.borderColor = `${acc.color}30`; }}
              >
                <span style={{ fontSize: "18px" }}>{acc.icon}</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: acc.color }}>{acc.label}</div>
                  <div style={{ fontSize: "11.5px", color: "rgba(155,147,200,0.7)" }}>{acc.username}</div>
                </div>
                <svg style={{ marginLeft: "auto", color: `${acc.color}80` }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}