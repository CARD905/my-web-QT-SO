
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarLayout } from "@/components/SidebarLayout";

type Quotation = {
  quotation_id: string;
  quotation_no: string;
  customer_name: string;
  customer_company: string;
  issue_date: string;
  status: string;
  total: number;
  products: string;
};

export default function Page() {
  const [data, setData] = useState<Quotation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    if (!API) return;
    fetch(`${API}/quotations`)
      .then(res => { if (!res.ok) throw new Error("API error"); return res.json(); })
      .then(d => setData(d || []))
      .catch(() => setData([]))
      .finally(() => setLoaded(true));
  }, [API]);

  const money = (n: number) =>
    n?.toLocaleString("en-US", { style: "currency", currency: "USD" }) ?? "—";

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const filtered = data.filter(q => {
    const matchSearch =
      (q.quotation_no || "").toLowerCase().includes(search.toLowerCase()) ||
      (q.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (q.customer_company || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "draft" && (!q.status || q.status === "draft")) ||
      q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this quotation?")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`${API}/quotations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setData(prev => prev.filter(q => q.quotation_id !== id));
    } catch { alert("Delete failed ❌"); }
    finally { setDeletingId(null); }
  };

  const statusConfig: Record<string, { label: string; bg: string; color: string; dot: string }> = {
    confirmed: { label: "Approved", bg: "rgba(34,197,94,0.12)", color: "#22c55e", dot: "#22c55e" },
    sent:      { label: "Sent",     bg: "rgba(99,102,241,0.12)", color: "#818cf8", dot: "#818cf8" },
    cancel:    { label: "Cancelled",bg: "rgba(239,68,68,0.12)", color: "#f87171", dot: "#f87171" },
    draft:     { label: "Draft",    bg: "rgba(148,163,184,0.1)", color: "#94a3b8", dot: "#94a3b8" },
  };
  const getStatus = (q: Quotation) => statusConfig[q.status] ?? statusConfig["draft"];

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "confirmed", label: "Approved" },
    { value: "cancel", label: "Cancelled" },
  ];

  return (
    <SidebarLayout>
      <div style={{ padding: "36px 36px 60px", minHeight: "calc(100vh - 56px)" }}>

        {/* ---- HEADER ---- */}
        <div className="fade-up" style={{ marginBottom: "32px" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "3px 10px 3px 8px",
              borderRadius: "20px",
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.2)",
              fontSize: "11px", fontWeight: 600,
              color: "var(--accent)", letterSpacing: "0.04em",
            }}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
              </svg>
              QUOTATIONS
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px", fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
                lineHeight: 1,
                marginBottom: "6px",
              }}>All Quotations</h1>
              <p style={{ fontSize: "13.5px", color: "var(--text-muted)", fontWeight: 500 }}>
                {filtered.length} document{filtered.length !== 1 ? "s" : ""} in your pipeline
              </p>
            </div>

            <button
              onClick={() => router.push("/create")}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "11px 22px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
                color: "white",
                fontSize: "14px", fontWeight: 700,
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.01em",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(124,58,237,0.4), 0 1px 0 rgba(255,255,255,0.15) inset",
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(124,58,237,0.5), 0 1px 0 rgba(255,255,255,0.15) inset";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(124,58,237,0.4), 0 1px 0 rgba(255,255,255,0.15) inset";
              }}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Quotation
            </button>
          </div>
        </div>

        {/* ---- FILTERS ---- */}
        <div className="fade-up fade-up-1" style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
              width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by customer, company or doc number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", paddingLeft: "42px", paddingRight: "16px",
                paddingTop: "10px", paddingBottom: "10px",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                fontSize: "13.5px",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                outline: "none",
                fontFamily: "var(--font-body)",
                backdropFilter: "blur(10px)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={e => {
                e.target.style.borderColor = "var(--border-hover)";
                e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Status */}
          <div style={{ position: "relative" }}>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                appearance: "none",
                padding: "10px 38px 10px 16px",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                fontSize: "13.5px",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                cursor: "pointer",
                outline: "none",
                fontFamily: "var(--font-body)",
                minWidth: "160px",
                backdropFilter: "blur(10px)",
                transition: "border-color 0.2s",
              }}
              onFocus={e => { e.target.style.borderColor = "var(--border-hover)"; }}
              onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
            >
              {statusOptions.map(o => (
                <option key={o.value} value={o.value} style={{ background: "var(--bg-base)" }}>{o.label}</option>
              ))}
            </select>
            <svg style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}
              width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* ---- TABLE CARD ---- */}
        <div className="fade-up fade-up-2" style={{
          background: "var(--bg-card)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          overflow: "hidden",
          backdropFilter: "blur(16px)",
          boxShadow: "var(--shadow-card)",
        }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "190px 1fr 155px 145px 160px 44px",
            padding: "12px 24px",
            borderBottom: "1px solid var(--border)",
          }}>
            {["DOCUMENT", "CUSTOMER", "PRODUCT", "DATE", "STATUS", "TOTAL", ""].map((h, i) => (
              <div key={i} style={{
                fontSize: "10.5px", fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: "0.08em",
                textAlign: i >= 4 ? "right" : "left",
              }}>{h}</div>
            ))}
          </div>

          {/* Empty */}
          {loaded && filtered.length === 0 && (
            <div style={{ padding: "64px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>📄</div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No quotations found.</p>
            </div>
          )}

          {/* Rows */}
          {filtered.map((q, idx) => {
            const st = getStatus(q);
            const isHovered = hoveredRow === q.quotation_id;
            return (
              <div
                key={q.quotation_id}
                className="fade-up"
                onClick={() => router.push(`/detail/${q.quotation_id}`)}
                onMouseEnter={() => setHoveredRow(q.quotation_id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "190px 1fr 1fr 155px 145px 160px 44px",
                  padding: "16px 24px", 
                  borderBottom: idx < filtered.length - 1 ? "1px solid var(--border)" : "none",
                  cursor: "pointer",
                  alignItems: "center",
                  transition: "background 0.15s",
                  background: isHovered ? "var(--bg-card-hover)" : "transparent",
                  animationDelay: `${0.1 + idx * 0.04}s`,
                  position: "relative",
                }}
              >
                {/* Hover accent line */}
                {isHovered && (
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: "3px",
                    background: "linear-gradient(to bottom, var(--accent), var(--accent-2))",
                    borderRadius: "0 2px 2px 0",
                  }} />
                )}

                {/* Doc number */}
                <div style={{
                  color: "var(--accent)", fontWeight: 700, fontSize: "13px",
                  fontFamily: "var(--font-mono)", letterSpacing: "0.01em",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <div style={{
                    width: "30px", height: "30px", borderRadius: "8px",
                    background: "rgba(124,58,237,0.1)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "var(--accent)" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  {q.quotation_no}
                </div>

                {/* Customer */}
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    {q.customer_name || "—"}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {q.customer_company || ""}
                  </div>
                </div>
                {/* Product */}
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    {q.products || "—"}
                  </div>
                </div>
                {/* Date */}
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  {formatDate(q.issue_date)}
                </div>

                {/* Status */}
                <div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    background: st.bg, color: st.color,
                    padding: "4px 10px", borderRadius: "20px",
                    fontSize: "11.5px", fontWeight: 700,
                    letterSpacing: "0.03em",
                    border: `1px solid ${st.color}30`,
                  }}>
                    <span style={{
                      width: "5px", height: "5px", borderRadius: "50%",
                      background: st.dot, display: "inline-block",
                      boxShadow: `0 0 6px ${st.dot}`,
                    }} />
                    {st.label}
                  </span>
                </div>

                {/* Total */}
                <div style={{
                  textAlign: "right", fontSize: "14px", fontWeight: 800,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "-0.02em",
                }}>
                  {money(q.total)}
                </div>

                {/* Delete */}
                <div style={{ textAlign: "right" }}>
                  <button
                    onClick={e => handleDelete(e, q.quotation_id)}
                    disabled={deletingId === q.quotation_id}
                    style={{
                      background: "none", border: "none",
                      color: "var(--text-muted)", cursor: "pointer",
                      padding: "6px", borderRadius: "8px",
                      display: "inline-flex", alignItems: "center",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = "#f87171";
                      (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                      (e.currentTarget as HTMLElement).style.background = "none";
                    }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <button
                    onClick={e => { e.stopPropagation(); router.push(`/detail/${q.quotation_id}`); }}
                    style={{
                      background: "none", border: "none",
                      color: "var(--text-muted)", cursor: "pointer",
                      padding: "6px", borderRadius: "8px",
                      display: "inline-flex", alignItems: "center",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                      (e.currentTarget as HTMLElement).style.background = "var(--accent-glow)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                      (e.currentTarget as HTMLElement).style.background = "none";
                    }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </SidebarLayout>
  );
}