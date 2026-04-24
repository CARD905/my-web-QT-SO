"use client";
/* ================================================================
   app/approver/page.tsx  — Approver Dashboard
   Shows: pending approvals, recent decisions, stats
   Protected: redirects to /login if not approver
   ================================================================ */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ApprovalItem = {
  request_id: number;
  quotation_id: number;
  quotation_no: string;
  customer_name: string;
  customer_company: string;
  total: number;
  issue_date: string;
  expiry_date: string;
  submitted_by_name: string;
  submitted_at: string;
  submit_note: string;
  revision: number;
  status: string;
};

type Stats = { pending: number; approved: number; rejected: number; totalValue: number };

function StatCard({ label, value, color, icon, glowColor }: { label: string; value: string | number; color: string; icon: string; glowColor: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "22px", backdropFilter: "blur(12px)", transition: "all 0.25s", transform: hov ? "translateY(-4px)" : "none", boxShadow: hov ? `0 12px 32px ${glowColor}, var(--shadow-card)` : "var(--shadow-card)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", background: `radial-gradient(circle at top right, ${glowColor}, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ fontSize: "28px", marginBottom: "10px" }}>{icon}</div>
      <p style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: "6px" }}>{label}</p>
      <p style={{ fontSize: "28px", fontWeight: 900, fontFamily: "var(--font-mono)", color, letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</p>
    </div>
  );
}

const statusStyle: Record<string, { color: string; bg: string; label: string }> = {
  pending:   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  label: "Pending" },
  approved:  { color: "#22c55e", bg: "rgba(34,197,94,0.12)",   label: "Approved" },
  rejected:  { color: "#f87171", bg: "rgba(239,68,68,0.12)",   label: "Rejected" },
  cancelled: { color: "#94a3b8", bg: "rgba(148,163,184,0.1)",  label: "Cancelled" },
};

export default function ApproverDashboard() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const [user, setUser] = useState<any>(null);
  const [pending, setPending] = useState<ApprovalItem[]>([]);
  const [recent, setRecent] = useState<ApprovalItem[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0, totalValue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("wisdom-token");
    const role  = localStorage.getItem("wisdom-role");
    const u     = localStorage.getItem("wisdom-user");
    if (!token || role !== "approver") { router.replace("/login"); return; }
    setUser(u ? JSON.parse(u) : null);

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API}/approver/pending`,  { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${API}/approver/recent`,   { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${API}/approver/stats`,    { headers }).then(r => r.ok ? r.json() : {}).catch(() => ({})),
    ]).then(([p, r, s]) => {
      setPending(p || []);
      setRecent(r || []);
      //setStats({ pending: s.pending || 0, approved: s.approved || 0, rejected: s.rejected || 0, totalValue: s.total_value || 0 });
      setLoading(false);
    });
  }, []);

  const logout = () => {
    ["wisdom-token","wisdom-role","wisdom-user"].forEach(k => localStorage.removeItem(k));
    router.replace("/login");
  };

  const money = (n: number) => n?.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }) ?? "—";
  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "44px", height: "44px", margin: "0 auto 16px", border: "3px solid var(--border)", borderTopColor: "#059669", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", position: "relative" }}>
      {/* BG */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(5,150,105,0.15) 0%, transparent 60%)", zIndex: 0 }} />

      {/* TOP NAV */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", background: "var(--bg-sidebar)", borderBottom: "1px solid var(--border)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg,#059669,#047857)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "16px", background: "linear-gradient(135deg,#34d399,#059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Approver Portal</span>
            <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "8px", fontWeight: 600 }}>WISDOM SALES PRO</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Live */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.1)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse-ring 1.5s ease-out infinite", display: "inline-block" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#22c55e" }}>LIVE</span>
          </div>
          {/* Pending badge */}
          {stats.pending > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.12)" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#f59e0b" }}>⏳ {stats.pending} Pending</span>
            </div>
          )}
          {/* User */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#059669,#047857)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "white" }}>
              {user?.full_name?.[0] || "A"}
            </div>
            <div style={{ display: "none" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{user?.full_name}</p>
              <p style={{ fontSize: "11px", color: "#059669" }}>Approver</p>
            </div>
          </div>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-muted)", fontSize: "12.5px", fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.3)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </header>

      <div style={{ padding: "32px 36px 60px", position: "relative", zIndex: 1 }}>

        {/* HERO */}
        <div className="fade-up" style={{ marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 12px 3px 8px", borderRadius: "20px", background: "rgba(5,150,105,0.12)", border: "1px solid rgba(5,150,105,0.25)", fontSize: "11px", fontWeight: 600, color: "#059669", marginBottom: "12px" }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            APPROVER DASHBOARD
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--text-primary)", marginBottom: "4px" }}>
            Hello, {user?.full_name?.split(" ")[0] || "Approver"} 👋
          </h1>
          <p style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>
            {stats.pending > 0 ? `You have ${stats.pending} quotation${stats.pending > 1 ? "s" : ""} waiting for your review.` : "All caught up! No pending approvals."}
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="fade-up fade-up-1" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "28px" }}>
          <StatCard label="PENDING REVIEW"  value={stats.pending}  color="#f59e0b" icon="⏳" glowColor="rgba(245,158,11,0.25)" />
          <StatCard label="APPROVED"         value={stats.approved} color="#22c55e" icon="✅" glowColor="rgba(34,197,94,0.2)" />
          <StatCard label="REJECTED"         value={stats.rejected} color="#f87171" icon="❌" glowColor="rgba(239,68,68,0.2)" />
          <StatCard label="TOTAL VALUE APPROVED" value={money(stats.totalValue)} color="var(--accent)" icon="💰" glowColor="rgba(124,58,237,0.2)" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px" }}>

          {/* PENDING LIST */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                Pending Approvals
              </h2>
              {stats.pending > 0 && (
                <span style={{ padding: "3px 10px", borderRadius: "20px", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", fontSize: "12px", fontWeight: 700, color: "#f59e0b" }}>
                  {stats.pending} waiting
                </span>
              )}
            </div>

            {pending.length === 0 ? (
              <div style={{ background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "60px 24px", textAlign: "center", backdropFilter: "blur(12px)" }}>
                <div style={{ fontSize: "44px", marginBottom: "16px" }}>🎉</div>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>All caught up!</p>
                <p style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>No pending quotations to review.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {pending.map((item, idx) => (
                  <div key={item.request_id} className="fade-up"
                    style={{ background: "var(--bg-card)", borderRadius: "16px", border: "1px solid rgba(245,158,11,0.2)", padding: "20px 24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)", cursor: "pointer", transition: "all 0.2s", animationDelay: `${idx * 0.06}s` }}
                    onClick={() => router.push(`/approver/review/${item.quotation_id}`)}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.5)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(245,158,11,0.15), var(--shadow-card)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.2)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {/* Urgency indicator */}
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "var(--accent)" }}>{item.quotation_no}</span>
                            {item.revision > 1 && <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#818cf8", background: "rgba(99,102,241,0.12)", padding: "2px 7px", borderRadius: "8px" }}>Rev.{item.revision}</span>}
                          </div>
                          <p style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>{item.customer_name}</p>
                          <p style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{item.customer_company}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>{money(item.total)}</p>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{timeAgo(item.submitted_at)}</p>
                      </div>
                    </div>

                    {item.submit_note && (
                      <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", marginBottom: "12px" }}>
                        <p style={{ fontSize: "12px", color: "rgba(245,158,11,0.9)", marginBottom: "2px", fontWeight: 600 }}>📝 Note from {item.submitted_by_name}</p>
                        <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.submit_note}</p>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "16px" }}>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>📅 Issued {item.issue_date}</span>
                        {item.expiry_date && <span style={{ fontSize: "12px", color: new Date(item.expiry_date) < new Date() ? "#f87171" : "var(--text-muted)" }}>⚠️ Expires {item.expiry_date}</span>}
                      </div>
                      <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 16px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg,#059669,#047857)", color: "white", fontSize: "12.5px", fontWeight: 700, fontFamily: "var(--font-body)", cursor: "pointer", boxShadow: "0 3px 12px rgba(5,150,105,0.35)" }}
                        onClick={e => { e.stopPropagation(); router.push(`/approver/review/${item.quotation_id}`); }}
                      >
                        Review <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECENT DECISIONS */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "16px" }}>
              Recent Decisions
            </h2>
            <div style={{ background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border)", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)", overflow: "hidden" }}>
              {recent.length === 0 ? (
                <div style={{ padding: "40px 24px", textAlign: "center" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "13.5px" }}>No decisions yet.</p>
                </div>
              ) : (
                recent.map((item, i) => {
                  const st = statusStyle[item.status] ?? statusStyle["pending"];
                  return (
                    <div key={item.request_id}
                      style={{ padding: "16px 20px", borderBottom: i < recent.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", transition: "background 0.15s" }}
                      onClick={() => router.push(`/approver/review/${item.quotation_id}`)}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 700, color: "var(--accent)" }}>{item.quotation_no}</span>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: st.color, background: st.bg, padding: "2px 9px", borderRadius: "10px", border: `1px solid ${st.color}30` }}>{st.label}</span>
                      </div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>{item.customer_name}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{timeAgo(item.submitted_at)}</p>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{money(item.total)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick info */}
            <div style={{ marginTop: "16px", padding: "16px 20px", borderRadius: "14px", background: "linear-gradient(135deg,rgba(5,150,105,0.1),rgba(4,120,87,0.06))", border: "1px solid rgba(5,150,105,0.2)" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#059669", marginBottom: "8px" }}>💡 Quick Guide</p>
              <ul style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.8, paddingLeft: "16px" }}>
                <li>Review quotation details carefully</li>
                <li>Add a comment when rejecting</li>
                <li>Approved → becomes a Sale Order</li>
                <li>Rejected → Sale can revise and resubmit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.45); } 70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-up-1 { animation-delay: 0.07s; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}