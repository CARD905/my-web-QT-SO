"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SidebarLayout, useLang } from "@/components/SidebarLayout";

/* ---- mini sparkline using canvas ---- */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const max = Math.max(...data, 1), min = Math.min(...data, 0);
    const range = max - min || 1;
    const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * W, y: H - ((v - min) / range) * H * 0.8 - H * 0.1 }));
    ctx.clearRect(0, 0, W, H);
    // gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, color + "40");
    grad.addColorStop(1, color + "00");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, H);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, H);
    ctx.fillStyle = grad;
    ctx.fill();
    // line
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [data, color]);
  return <canvas ref={ref} width={120} height={48} style={{ display: "block" }} />;
}

/* ---- Bar chart ---- */
function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const max = Math.max(...data, 1);
    const barW = (W - 40) / data.length - 8;
    ctx.clearRect(0, 0, W, H);
    // grid lines
    for (let i = 0; i <= 4; i++) {
      const y = H - 30 - ((H - 50) / 4) * i;
      ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(W - 10, y);
      ctx.strokeStyle = "rgba(139,92,246,0.1)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "rgba(148,163,184,0.6)"; ctx.font = "10px DM Sans,sans-serif"; ctx.textAlign = "right";
      ctx.fillText(((max / 4) * i / 1000).toFixed(0) + "k", 26, y + 4);
    }
    data.forEach((v, i) => {
      const x = 30 + i * (barW + 8) + 4;
      const h = ((v / max) * (H - 50));
      const y = H - 30 - h;
      // gradient bar
      const grad = ctx.createLinearGradient(0, y, 0, H - 30);
      grad.addColorStop(0, "#7c3aed");
      grad.addColorStop(1, "#db2777");
      ctx.beginPath();
      ctx.roundRect(x, y, barW, h, 4);
      ctx.fillStyle = grad;
      ctx.fill();
      // label
      ctx.fillStyle = "rgba(148,163,184,0.8)"; ctx.font = "9px DM Sans,sans-serif"; ctx.textAlign = "center";
      ctx.fillText(labels[i], x + barW / 2, H - 12);
    });
  }, [data, labels]);
  return <canvas ref={ref} width={580} height={200} style={{ width: "100%", height: "200px" }} />;
}

const statCards = [
  { key: "totalQuotations", icon: "📄", iconBg: "linear-gradient(135deg,#7c3aed,#6d28d9)", glowColor: "rgba(124,58,237,0.3)", href: "/quotations" },
  { key: "salesOrders",     icon: "🛒", iconBg: "linear-gradient(135deg,#0891b2,#0e7490)", glowColor: "rgba(8,145,178,0.3)", href: "/sale" },
  { key: "conversion",      icon: "📈", iconBg: "linear-gradient(135deg,#059669,#047857)", glowColor: "rgba(5,150,105,0.3)", href: "/quotations" },
  { key: "revenue",         icon: "💰", iconBg: "linear-gradient(135deg,#d97706,#b45309)", glowColor: "rgba(217,119,6,0.3)",  href: "/sale" },
];

export default function DashboardPage() {
  const { t, lang } = useLang();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  const [stats, setStats] = useState({ totalQuotations: 0, salesOrders: 0, conversion: 0, revenue: 0 });
  const [recentQuotations, setRecentQuotations] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [awaitingReply, setAwaitingReply] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/quotations`).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([quotations]) => {
      const all: any[] = quotations || [];
      const confirmed = all.filter((q: any) => q.status === "confirmed");
      const revenue = confirmed.reduce((s: number, q: any) => s + (q.total || 0), 0);
      const conversion = all.length ? Math.round((confirmed.length / all.length) * 100) : 0;

      setStats({ totalQuotations: all.length, salesOrders: confirmed.length, conversion, revenue });
      setRecentQuotations(all.slice(0, 4));
      setRecentOrders(confirmed.slice(0, 3));

      // expiring soon (within 7 days)
      const today = new Date();
      const in7 = new Date(); in7.setDate(today.getDate() + 7);
      const expiring = all.filter((q: any) => {
        if (!q.expiry_date) return false;
        const d = new Date(q.expiry_date);
        return d >= today && d <= in7 && q.status !== "confirmed" && q.status !== "cancel";
      });
      setExpiringSoon(expiring.length);
      setAwaitingReply(all.filter((q: any) => q.status === "sent").length);

      // chart: monthly totals (last 6 months)
      const months: number[] = Array(6).fill(0);
      all.forEach((q: any) => {
        if (!q.issue_date) return;
        const d = new Date(q.issue_date);
        const diff = (today.getFullYear() - d.getFullYear()) * 12 + today.getMonth() - d.getMonth();
        if (diff >= 0 && diff < 6) months[5 - diff] += q.total || 0;
      });
      setChartData(months);
    });
  }, []);

  const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const monthLabels = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - 5 + i);
    return d.toLocaleString(lang === "th" ? "th-TH" : "en-US", { month: "short" });
  });

  const statusMap: Record<string, { label_en: string; label_th: string; color: string; bg: string }> = {
    confirmed: { label_en: "Approved", label_th: "อนุมัติ",   color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
    sent:      { label_en: "Sent",     label_th: "ส่งแล้ว",   color: "#818cf8", bg: "rgba(99,102,241,0.12)" },
    cancel:    { label_en: "Cancelled",label_th: "ยกเลิก",    color: "#f87171", bg: "rgba(239,68,68,0.12)" },
    draft:     { label_en: "Draft",    label_th: "แบบร่าง",   color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
  };

  const statValues = [stats.totalQuotations, stats.salesOrders, `${stats.conversion}%`, money(stats.revenue)];
  const statLabels_en = ["TOTAL QUOTATIONS", "SALES ORDERS", "CONVERSION", "REVENUE"];
  const statLabels_th = ["ใบเสนอราคาทั้งหมด", "คำสั่งซื้อ", "อัตราการแปลง", "รายได้"];

  return (
    <SidebarLayout>
      <div style={{ padding: "32px 36px 60px" }}>

        {/* ---- HERO BANNER ---- */}
        <div className="fade-up" style={{ borderRadius: "20px", padding: "36px 40px", marginBottom: "28px", position: "relative", overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border)", backdropFilter: "blur(12px)" }}>
          {/* Decorative orbs */}
          <div style={{ position: "absolute", top: "-40px", right: "80px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-60px", right: "280px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(219,39,119,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "20px", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", fontSize: "11px", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.04em" }}>
              ✦ {lang === "th" ? "ยินดีต้อนรับกลับมา" : "WELCOME BACK"}
            </span>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--text-primary)", marginBottom: "10px", lineHeight: 1.1 }}>
            {lang === "th" ? "ศูนย์บัญชาการ" : "Your sales"}{" "}
            <span style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {lang === "th" ? "การขาย" : "command center"}
            </span>
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px", maxWidth: "500px" }}>
            {lang === "th" ? "ติดตามใบเสนอราคา แปลงเป็นคำสั่งซื้อ และปิดดีลได้เร็วกว่าเดิม" : "Track quotations, convert to orders, and ship deals faster than ever."}
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/create")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 22px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "white", fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-display)", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.4)", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(124,58,237,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)"; }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              {lang === "th" ? "สร้างใบเสนอราคา" : "Create Quotation"} ↗
            </button>
            <button onClick={() => router.push("/sale")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 22px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
            >
              {lang === "th" ? "คำสั่งซื้อใหม่" : "New Sales Order"}
            </button>
          </div>
        </div>

        {/* ---- STAT CARDS ---- */}
        <div className="fade-up fade-up-1" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
          {statCards.map((card, i) => (
            <div key={card.key}
              onClick={() => router.push(card.href)}
              onMouseEnter={() => setHoveredCard(card.key)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "22px", cursor: "pointer", backdropFilter: "blur(12px)", transition: "all 0.25s ease", position: "relative", overflow: "hidden", transform: hoveredCard === card.key ? "translateY(-4px)" : "translateY(0)", boxShadow: hoveredCard === card.key ? `0 12px 32px ${card.glowColor}, var(--shadow-card)` : "var(--shadow-card)", borderColor: hoveredCard === card.key ? "var(--border-hover)" : "var(--border)" }}
            >
              {/* Glow bg */}
              <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", background: `radial-gradient(circle at top right, ${card.glowColor}, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: card.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: `0 4px 14px ${card.glowColor}` }}>
                  {card.icon}
                </div>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" /></svg>
              </div>
              <p style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: "6px" }}>
                {lang === "th" ? statLabels_th[i] : statLabels_en[i]}
              </p>
              <p style={{ fontSize: i === 3 ? "22px" : "28px", fontWeight: 900, fontFamily: "var(--font-mono)", color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {statValues[i]}
              </p>
            </div>
          ))}
        </div>

        {/* ---- CHARTS + ALERTS ---- */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", marginBottom: "24px" }}>

          {/* Sales Trend */}
          <div className="fade-up fade-up-2" style={{ background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>
                  {lang === "th" ? "แนวโน้มการขาย" : "Sales Trend"}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{lang === "th" ? "6 เดือนที่ผ่านมา" : "Last 6 months"}</p>
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }} />
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{lang === "th" ? "รายได้" : "Revenue"}</span>
              </div>
            </div>
            <BarChart data={chartData} labels={monthLabels} />
          </div>

          {/* Alerts */}
          <div className="fade-up fade-up-2" style={{ background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
              {lang === "th" ? "การแจ้งเตือน" : "Alerts"}
            </h3>
            {[
              { icon: "⏰", label_en: "Expiring soon", label_th: "กำลังหมดอายุ", value: expiringSoon, sub_en: "QT expiring in ≤7 days", sub_th: "ใบเสนอราคาหมดอายุใน 7 วัน", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
              { icon: "💬", label_en: "Awaiting reply", label_th: "รอการตอบกลับ", value: awaitingReply, sub_en: "Sent quotations", sub_th: "ใบเสนอราคาที่ส่งแล้ว", color: "#818cf8", bg: "rgba(99,102,241,0.1)" },
            ].map(a => (
              <div key={a.label_en} style={{ borderRadius: "12px", padding: "16px", background: a.bg, border: `1px solid ${a.color}25`, marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "16px" }}>{a.icon}</span>
                  <span style={{ fontSize: "12.5px", fontWeight: 600, color: a.color }}>{lang === "th" ? a.label_th : a.label_en}</span>
                </div>
                <p style={{ fontSize: "28px", fontWeight: 900, fontFamily: "var(--font-mono)", color: a.color, lineHeight: 1, marginBottom: "4px" }}>{a.value}</p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{lang === "th" ? a.sub_th : a.sub_en}</p>
              </div>
            ))}
            <div style={{ borderRadius: "12px", padding: "14px", background: "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(219,39,119,0.08))", border: "1px solid rgba(124,58,237,0.2)", textAlign: "center" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent)" }}>
                {lang === "th" ? "ยินดีต้อนรับกลับ! 👋" : "Welcome back! 👋"}
              </p>
            </div>
          </div>
        </div>

        {/* ---- RECENT TABLES ---- */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

          {/* Recent Quotations */}
          <div className="fade-up fade-up-3" style={{ background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                {lang === "th" ? "ใบเสนอราคาล่าสุด" : "Recent Quotations"}
              </h3>
              <button onClick={() => router.push("/quotations")} style={{ fontSize: "12px", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                {lang === "th" ? "ดูทั้งหมด" : "View all"} ↗
              </button>
            </div>
            {recentQuotations.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>No quotations yet</div>
            ) : (
              recentQuotations.map((q, i) => {
                const st = statusMap[q.status] ?? statusMap["draft"];
                return (
                  <div key={q.quotation_id} onClick={() => router.push(`/detail/${q.quotation_id}`)}
                    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: i < recentQuotations.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", transition: "opacity 0.15s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.75"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                  >
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)", marginBottom: "2px" }}>{q.quotation_no}</p>
                      <p style={{ fontSize: "11.5px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q.customer_company || q.customer_name || "—"}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)", marginBottom: "4px" }}>{(q.total || 0).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 })}</p>
                      <span style={{ fontSize: "10.5px", fontWeight: 700, color: st.color, background: st.bg, padding: "2px 8px", borderRadius: "10px" }}>
                        {lang === "th" ? st.label_th : st.label_en}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Recent Orders */}
          <div className="fade-up fade-up-3" style={{ background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                {lang === "th" ? "คำสั่งซื้อล่าสุด" : "Recent Orders"}
              </h3>
              <button onClick={() => router.push("/sale")} style={{ fontSize: "12px", color: "#22c55e", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                {lang === "th" ? "ดูทั้งหมด" : "View all"} ↗
              </button>
            </div>
            {recentOrders.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>No orders yet</div>
            ) : (
              recentOrders.map((q, i) => (
                <div key={q.quotation_id} onClick={() => router.push(`/sale/${q.quotation_id}`)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: i < recentOrders.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", transition: "opacity 0.15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.75"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                >
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)", marginBottom: "2px" }}>SO-{q.quotation_id}</p>
                    <p style={{ fontSize: "11.5px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q.customer_company || q.customer_name || "—"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)", marginBottom: "4px" }}>{(q.total || 0).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 })}</p>
                    <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.12)", padding: "2px 8px", borderRadius: "10px" }}>
                      ● {lang === "th" ? "ยืนยัน" : "CONFIRMED"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}