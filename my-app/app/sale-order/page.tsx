/* ================================================================
   FILE 1: app/sale/page.tsx  (Sales Orders list)
   ================================================================ */

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarLayout } from "@/components/SidebarLayout";

export default function SaleOrdersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    fetch(`${API}/quotations`)
      .then(res => { if (!res.ok) throw new Error("API error"); return res.json(); })
      .then(res => setData(res.filter((q: any) => q.status === "confirmed")))
      .catch(() => setData([]))
      .finally(() => setLoaded(true));
  }, []);

  const money = (n: number) =>
    n?.toLocaleString("en-US", { style: "currency", currency: "USD" }) ?? "—";

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <SidebarLayout>
      <div style={{ padding: "36px 36px 60px" }}>

        {/* ---- HEADER ---- */}
        <div className="fade-up" style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "3px 10px 3px 8px",
              borderRadius: "20px",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.25)",
              fontSize: "11px", fontWeight: 600,
              color: "#22c55e", letterSpacing: "0.04em",
            }}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              SALES ORDERS
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px", fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
                lineHeight: 1, marginBottom: "6px",
              }}>Sales Orders</h1>
              <p style={{ fontSize: "13.5px", color: "var(--text-muted)", fontWeight: 500 }}>
                {data.length} confirmed order{data.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={() => router.push("/quotations")}
              style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "10px 20px", borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                fontSize: "13.5px", fontWeight: 600,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
                (e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Quotations
            </button>
          </div>
        </div>

        {/* ---- TABLE ---- */}
        <div className="fade-up fade-up-1" style={{
          background: "var(--bg-card)", borderRadius: "16px",
          border: "1px solid var(--border)", overflow: "hidden",
          backdropFilter: "blur(16px)", boxShadow: "var(--shadow-card)",
        }}>
          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr 160px 150px 170px 44px",
            padding: "12px 24px",
            borderBottom: "1px solid var(--border)",
          }}>
            {["SO NUMBER", "CUSTOMER", "DATE", "STATUS", "TOTAL", ""].map((h, i) => (
              <div key={i} style={{
                fontSize: "10.5px", fontWeight: 700,
                color: "var(--accent)", letterSpacing: "0.08em",
                textAlign: i >= 4 ? "right" : "left",
              }}>{h}</div>
            ))}
          </div>

          {/* Empty state */}
          {loaded && data.length === 0 && (
            <div style={{ padding: "72px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "14px" }}>🛒</div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No confirmed orders yet.</p>
              <p style={{ color: "var(--text-muted)", fontSize: "12.5px", marginTop: "4px" }}>Confirm a quotation to see it here.</p>
            </div>
          )}

          {/* Rows */}
          {data.map((q, idx) => {
            const isHovered = hoveredRow === q.quotation_id;
            return (
              <div
                key={q.quotation_id}
                className="fade-up"
                onClick={() => router.push(`/sale/${q.quotation_id}`)}
                onMouseEnter={() => setHoveredRow(q.quotation_id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr 160px 150px 170px 44px",
                  padding: "16px 24px",
                  borderBottom: idx < data.length - 1 ? "1px solid var(--border)" : "none",
                  cursor: "pointer",
                  alignItems: "center",
                  transition: "background 0.15s",
                  background: isHovered ? "var(--bg-card-hover)" : "transparent",
                  animationDelay: `${0.1 + idx * 0.05}s`,
                  position: "relative",
                }}
              >
                {isHovered && (
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: "3px",
                    background: "linear-gradient(to bottom, #22c55e, #16a34a)",
                    borderRadius: "0 2px 2px 0",
                  }} />
                )}

                {/* SO Number */}
                <div style={{
                  color: "var(--accent)", fontWeight: 700, fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <div style={{
                    width: "30px", height: "30px", borderRadius: "8px",
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  SO-{q.quotation_id}
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

                {/* Date */}
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  {formatDate(q.issue_date)}
                </div>

                {/* Status */}
                <div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    background: "rgba(34,197,94,0.12)", color: "#22c55e",
                    padding: "4px 10px", borderRadius: "20px",
                    fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.03em",
                    border: "1px solid rgba(34,197,94,0.25)",
                  }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                    Confirmed
                  </span>
                </div>

                {/* Total */}
                <div style={{
                  textAlign: "right", fontSize: "14px", fontWeight: 800,
                  color: "var(--text-primary)", fontFamily: "var(--font-mono)", letterSpacing: "-0.02em",
                }}>
                  {money(q.total)}
                </div>

                {/* Arrow */}
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: isHovered ? "var(--accent)" : "var(--text-muted)", transition: "color 0.15s, transform 0.15s", display: "inline-block", transform: isHovered ? "translateX(3px)" : "none" }}>
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SidebarLayout>
  );
}


/* ================================================================
   FILE 2: app/sale/[id]/page.tsx  (Sale Order Detail)
   ================================================================ */

// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { SidebarLayout } from "@/components/SidebarLayout";
//
// export default function SaleOrderDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [data, setData] = useState<any>(null);
//   const API = process.env.NEXT_PUBLIC_API_URL || "";
//
//   useEffect(() => {
//     if (!id) return;
//     fetch(`${API}/quotations/${id}`)
//       .then(res => { if (!res.ok) throw new Error(); return res.json(); })
//       .then(setData)
//       .catch(() => setData(null));
//   }, [id]);
//
//   if (!data) return (
//     <SidebarLayout>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
//         <div style={{ textAlign: "center" }}>
//           <div style={{ width: "40px", height: "40px", margin: "0 auto 16px", border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
//           <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading...</p>
//         </div>
//       </div>
//     </SidebarLayout>
//   );
//
//   const subtotal = data.items.reduce((s: number, i: any) => s + i.qty * i.unit_price * (1 - i.discount_percent / 100), 0);
//   const vat = subtotal * 0.07;
//   const total = subtotal + vat;
//   const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
//
//   return (
//     <SidebarLayout>
//       <div style={{ padding: "32px 36px 60px", maxWidth: "900px" }}>
//         {/* Similar structure to detail-page.tsx but with SO branding */}
//         {/* ... (same Card / InfoField pattern, adapted for Sale Order) */}
//       </div>
//     </SidebarLayout>
//   );
// }