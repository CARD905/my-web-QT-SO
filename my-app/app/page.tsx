// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type Quotation = {
//   quotation_id: string;
//   quotation_no: string;
//   customer_name: string;
//   customer_company: string;
//   issue_date: string;
//   status: string;
//   total: number;
// };

// export default function Page() {
//   const [data, setData] = useState<Quotation[]>([]);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [loaded, setLoaded] = useState(false);
//   const router = useRouter();

//   // ✅ FIX: กัน API ว่าง
//   const API = process.env.NEXT_PUBLIC_API_URL || "";

//   useEffect(() => {
//     if (!API) {
//       console.error("API URL missing");
//       return;
//     }

//     fetch(`${API}/quotations`)
//       .then(res => {
//         if (!res.ok) throw new Error("API error");
//         return res.json();
//       })
//       .then(d => setData(d || [])) // ✅ FIX กัน undefined
//       .catch(err => {
//         console.error("Fetch error:", err);
//         setData([]);
//       })
//       .finally(() => setLoaded(true));
//   }, [API]); // ✅ FIX dependency

//   const money = (n: number) =>
//     n?.toLocaleString("en-US", { style: "currency", currency: "USD" }) ?? "—";

//   const formatDate = (d: string) => {
//     if (!d) return "—";
//     return new Date(d).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const filtered = data.filter(q => {
//     // ✅ FIX กัน undefined crash
//     const matchSearch =
//       (q.quotation_no || "").toLowerCase().includes(search.toLowerCase()) ||
//       (q.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
//       (q.customer_company || "").toLowerCase().includes(search.toLowerCase());

//     const matchStatus =
//       statusFilter === "all" ||
//       (statusFilter === "draft" && (!q.status || q.status === "draft")) ||
//       q.status === statusFilter;

//     return matchSearch && matchStatus;
//   });

//   const handleDelete = async (e: React.MouseEvent, id: string) => {
//     e.stopPropagation();

//     if (!confirm("Delete this quotation?")) return;

//     try {
//       setDeletingId(id);

//       const res = await fetch(`${API}/quotations/${id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) {
//         const text = await res.text(); // ✅ debug เพิ่ม
//         throw new Error(text || "Delete failed");
//       }

//       setData(prev => prev.filter(q => q.quotation_id !== id));
//     } catch (err) {
//       console.error("Delete error:", err);
//       alert("Delete failed ❌");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const statusConfig: Record<
//     string,
//     { label: string; bg: string; color: string; dot: string }
//   > = {
//     confirmed: {
//       label: "Approved",
//       bg: "#dcfce7",
//       color: "#15803d",
//       dot: "#22c55e",
//     },
//     sent: {
//       label: "Sent",
//       bg: "#dbeafe",
//       color: "#1d4ed8",
//       dot: "#3b82f6",
//     },
//     cancel: {
//       label: "Cancelled",
//       bg: "#fee2e2",
//       color: "#b91c1c",
//       dot: "#ef4444",
//     },
//     draft: {
//       label: "Draft",
//       bg: "#f1f5f9",
//       color: "#475569",
//       dot: "#94a3b8",
//     },
//   };

//   const getStatus = (q: Quotation) =>
//     statusConfig[q.status] ?? statusConfig["draft"];

//   const statusOptions = [
//     { value: "all", label: "All Statuses" },
//     { value: "draft", label: "Draft" },
//     { value: "sent", label: "Sent" },
//     { value: "confirmed", label: "Approved" },
//     { value: "cancel", label: "Cancelled" },
//   ];

//   return (
//     <div style={{ padding: "36px 40px", minHeight: "100vh" }}>
//       {/* 🔥 UI ทุกบรรทัดด้านล่าง = ของเดิม 100% */}

//       {/* HEADER */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}
//         className="fade-up">
//         <div>
//           <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
//             Quotations
//           </h1>
//           <p style={{ color: "#94a3b8", fontSize: "13.5px", marginTop: "4px" }}>
//             {filtered.length} document{filtered.length !== 1 ? "s" : ""}
//           </p>
//         </div>

//         <button
//           onClick={() => router.push("/create")}
//           style={{
//             display: "flex", alignItems: "center", gap: "7px",
//             background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
//             color: "white", border: "none",
//             padding: "10px 20px", borderRadius: "10px",
//             fontSize: "13.5px", fontWeight: 600,
//             cursor: "pointer",
//             boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
//             transition: "transform 0.15s, box-shadow 0.15s",
//           }}
//           onMouseEnter={e => {
//             (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
//             (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(59,130,246,0.45)";
//           }}
//           onMouseLeave={e => {
//             (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
//             (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(59,130,246,0.35)";
//           }}
//         >
//           <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
//           </svg>
//           New Quotation
//         </button>
//       </div>

//       {/* FILTERS */}
//       <div style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "center" }}
//         className="fade-up fade-up-1">

//         {/* Search */}
//         <div style={{ position: "relative", flex: 1, maxWidth: "380px" }}>
//           <svg style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
//             width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//               d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
//           </svg>
//           <input
//             type="text"
//             placeholder="Search customer or document..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             style={{
//               width: "100%", paddingLeft: "38px", paddingRight: "14px",
//               paddingTop: "9px", paddingBottom: "9px",
//               border: "1.5px solid #e2e8f0",
//               borderRadius: "10px", fontSize: "13.5px",
//               background: "white", color: "#0f172a",
//               outline: "none",
//               transition: "border-color 0.2s, box-shadow 0.2s",
//               fontFamily: "inherit",
//             }}
//             onFocus={e => {
//               e.target.style.borderColor = "#3b82f6";
//               e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
//             }}
//             onBlur={e => {
//               e.target.style.borderColor = "#e2e8f0";
//               e.target.style.boxShadow = "none";
//             }}
//           />
//         </div>

//         {/* Status filter */}
//         <div style={{ position: "relative" }}>
//           <select
//             value={statusFilter}
//             onChange={e => setStatusFilter(e.target.value)}
//             style={{
//               appearance: "none",
//               padding: "9px 36px 9px 14px",
//               border: "1.5px solid #e2e8f0",
//               borderRadius: "10px",
//               fontSize: "13.5px",
//               background: "white",
//               color: "#374151",
//               cursor: "pointer",
//               outline: "none",
//               fontFamily: "inherit",
//               minWidth: "150px",
//             }}
//           >
//             {statusOptions.map(o => (
//               <option key={o.value} value={o.value}>{o.label}</option>
//             ))}
//           </select>
//           <svg style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }}
//             width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//           </svg>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div
//         className="fade-up fade-up-2"
//         style={{
//           background: "white",
//           borderRadius: "14px",
//           border: "1px solid #e8ecf0",
//           overflow: "hidden",
//           boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.04)",
//         }}
//       >
//         {/* Table header */}
//         <div style={{
//           display: "grid",
//           gridTemplateColumns: "200px 1fr 160px 140px 160px 52px",
//           padding: "10px 24px",
//           borderBottom: "1px solid #f1f5f9",
//           background: "#fafbfc",
//         }}>
//           {["Doc Number", "Customer", "Date", "Status", "Total", ""].map((h, i) => (
//             <div key={i} style={{
//               fontSize: "11.5px", fontWeight: 600, color: "#3b82f6",
//               letterSpacing: "0.04em", textTransform: "uppercase",
//               textAlign: i >= 4 ? "right" : "left",
//             }}>{h}</div>
//           ))}
//         </div>

//         {/* Rows */}
//         {loaded && filtered.length === 0 && (
//           <div style={{ padding: "60px 24px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
//             No quotations found.
//           </div>
//         )}

//         {filtered.map((q, idx) => {
//           const st = getStatus(q);
//           return (
//             <div
//               key={q.quotation_id}
//               onClick={() => router.push(`/detail/${q.quotation_id}`)}
//               className="fade-up"
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "200px 1fr 160px 140px 160px 52px",
//                 padding: "16px 24px",
//                 borderBottom: idx < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
//                 cursor: "pointer",
//                 alignItems: "center",
//                 transition: "background 0.15s",
//                 animationDelay: `${0.15 + idx * 0.04}s`,
//               }}
//               onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#f8faff"}
//               onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
//             >
//               {/* Doc number */}
//               <div style={{
//                 color: "#3b82f6", fontWeight: 600, fontSize: "13.5px",
//                 fontFamily: "'DM Mono', monospace", letterSpacing: "0.01em"
//               }}>
//                 {q.quotation_no}
//               </div>

//               {/* Customer */}
//               <div>
//                 <div style={{ fontSize: "13.5px", fontWeight: 500, color: "#0f172a" }}>
//                   {q.customer_name || "—"}
//                 </div>
//                 <div style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>
//                   {q.customer_company || ""}
//                 </div>
//               </div>

//               {/* Date */}
//               <div style={{ fontSize: "13px", color: "#64748b" }}>
//                 {formatDate(q.issue_date)}
//               </div>

//               {/* Status badge */}
//               <div>
//                 <span style={{
//                   display: "inline-flex", alignItems: "center", gap: "5px",
//                   background: st.bg, color: st.color,
//                   padding: "3px 10px", borderRadius: "20px",
//                   fontSize: "12px", fontWeight: 600,
//                 }}>
//                   <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.dot, display: "inline-block" }} />
//                   {st.label}
//                 </span>
//               </div>

//               {/* Total */}
//               <div style={{ textAlign: "right", fontSize: "14px", fontWeight: 700, color: "#0f172a", fontFamily: "'DM Mono', monospace" }}>
//                 {money(q.total)}
//               </div>

//               {/* Delete */}
//               <div style={{ textAlign: "right" }}>
//                 <button
//                   onClick={e => handleDelete(e, q.quotation_id)}
//                   disabled={deletingId === q.quotation_id}
//                   style={{
//                     background: "none", border: "none",
//                     color: "#cbd5e1", cursor: "pointer",
//                     padding: "6px", borderRadius: "6px",
//                     display: "inline-flex", alignItems: "center",
//                     transition: "color 0.15s, background 0.15s",
//                   }}
//                   onMouseEnter={e => {
//                     (e.currentTarget as HTMLElement).style.color = "#ef4444";
//                     (e.currentTarget as HTMLElement).style.background = "#fee2e2";
//                   }}
//                   onMouseLeave={e => {
//                     (e.currentTarget as HTMLElement).style.color = "#cbd5e1";
//                     (e.currentTarget as HTMLElement).style.background = "none";
//                   }}
//                 >
//                   <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
//                       d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//     </div>
//   );
// }
// page1-list.tsx  →  app/page.tsx  (หน้า All Quotations)
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, Topbar } from "./layout-components";

type Quotation = {
  quotation_id: string;
  quotation_no: string;
  customer_name: string;
  customer_company: string;
  issue_date: string;
  status: string;
  total: number;
};

export default function QuotationsPage() {
  const [data, setData]         = useState<Quotation[]>([]);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");
  const [deletingId, setDel]    = useState<string | null>(null);
  const [loaded, setLoaded]     = useState(false);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    fetch(`${API}/quotations`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setData(d || []))
      .catch(() => setData([]))
      .finally(() => setLoaded(true));
  }, [API]);

  const fmt = (n: number) =>
    n?.toLocaleString("en-US", { style: "currency", currency: "USD" }) ?? "—";
  const fmtDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const filtered = data.filter(q => {
    const s = search.toLowerCase();
    const match = (q.quotation_no + q.customer_name + q.customer_company).toLowerCase().includes(s);
    const st = filter === "all" || q.status === filter || (filter === "draft" && !q.status);
    return match && st;
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this quotation?")) return;
    try {
      setDel(id);
      const res = await fetch(`${API}/quotations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setData(p => p.filter(q => q.quotation_id !== id));
    } catch { alert("Delete failed"); } finally { setDel(null); }
  };

  const statusMap: Record<string, { label: string; cls: string }> = {
    confirmed: { label: "APPROVED", cls: "badge-confirmed" },
    sent:      { label: "SENT",     cls: "badge-sent" },
    draft:     { label: "DRAFT",    cls: "badge-draft" },
    cancel:    { label: "CANCELLED",cls: "badge-cancel" },
  };
  const getS = (q: Quotation) => statusMap[q.status] ?? statusMap.draft;

  return (
    <div className="qf-layout">
      <Sidebar />
      <div className="qf-content">
        <Topbar breadcrumbs={["Quotations"]} />
        <div className="qf-page">

          {/* ── PAGE HEADER ── */}
          <div className="anim-0" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                {/* Tag pill */}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  padding: "3px 10px", borderRadius: "20px",
                  background: "var(--accent-soft)", border: "1px solid rgba(157,124,248,0.2)",
                  fontSize: "11px", fontWeight: 700, color: "var(--accent)",
                  letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px",
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Quotations
                </span>
                <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
                  All Quotations
                </h1>
                <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {filtered.length} document{filtered.length !== 1 ? "s" : ""} in your pipeline
                </p>
              </div>

              {/* New Quotation Button */}
              <button
                className="qf-btn btn-primary"
                style={{ padding: "10px 20px", fontSize: "13.5px" }}
                onClick={() => router.push("/create")}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Quotation
                <span className="btn-arrow">↗</span>
              </button>
            </div>
          </div>

          {/* ── FILTERS ── */}
          <div className="anim-1" style={{ display: "flex", gap: "10px", marginBottom: "16px", alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: 1, maxWidth: "420px" }}>
              <svg style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)", pointerEvents: "none", width: "14px", height: "14px" }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="qf-input"
                style={{ paddingLeft: "34px" }}
                placeholder="Search by customer, company or doc number..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Status filter */}
            <div style={{ position: "relative", minWidth: "160px" }}>
              <select
                className="qf-input qf-select"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="confirmed">Approved</option>
                <option value="cancel">Cancelled</option>
              </select>
              <svg style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-tertiary)", width: "13px", height: "13px" }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>

          {/* ── TABLE CARD ── */}
          <div className="qf-card anim-2" style={{ padding: 0 }}>
            {/* Table head */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "44px 180px 1fr 140px 130px 140px 48px",
              padding: "8px 16px",
              borderBottom: "1px solid var(--border-default)",
              background: "var(--bg-elevated)",
              borderRadius: "12px 12px 0 0",
            }}>
              {["", "DOCUMENT", "CUSTOMER", "DATE", "STATUS", "TOTAL", ""].map((h, i) => (
                <div key={i} style={{
                  fontSize: "10.5px", fontWeight: 700, color: "var(--text-tertiary)",
                  letterSpacing: "0.07em", textAlign: i >= 5 ? "right" : "left",
                }}>{h}</div>
              ))}
            </div>

            {/* Empty */}
            {loaded && filtered.length === 0 && (
              <div style={{ padding: "56px", textAlign: "center", color: "var(--text-tertiary)", fontSize: "13.5px" }}>
                No quotations found.
              </div>
            )}

            {/* Rows */}
            {filtered.map((q, idx) => {
              const st = getS(q);
              return (
                <div
                  key={q.quotation_id}
                  onClick={() => router.push(`/detail/${q.quotation_id}`)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 180px 1fr 140px 130px 140px 48px",
                    padding: "0 16px",
                    borderBottom: idx < filtered.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    cursor: "pointer", alignItems: "center", minHeight: "64px",
                    transition: "background 0.12s",
                    animation: `fadeUp 0.35s ${0.05 * idx}s ease both`,
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-muted)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  {/* Icon */}
                  <div>
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "9px",
                      background: "var(--accent-soft)", border: "1px solid rgba(157,124,248,0.18)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                  </div>
                  {/* Doc no */}
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", fontWeight: 500, color: "var(--accent)" }}>
                    {q.quotation_no}
                  </div>
                  {/* Customer */}
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: 500, color: "var(--text-primary)" }}>{q.customer_name || "—"}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "2px" }}>{q.customer_company}</div>
                  </div>
                  {/* Date */}
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{fmtDate(q.issue_date)}</div>
                  {/* Status */}
                  <div>
                    <span className={`qf-badge ${st.cls}`}>
                      <span className="qf-badge-dot" />{st.label}
                    </span>
                  </div>
                  {/* Total */}
                  <div style={{ textAlign: "right", fontFamily: "'JetBrains Mono',monospace", fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {fmt(q.total)}
                  </div>
                  {/* Actions */}
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <button
                      onClick={e => handleDelete(e, q.quotation_id)}
                      disabled={deletingId === q.quotation_id}
                      style={{
                        background: "none", border: "none", color: "var(--text-tertiary)",
                        cursor: "pointer", padding: "5px", borderRadius: "7px",
                        display: "flex", alignItems: "center",
                        transition: "color 0.15s, background 0.15s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.color = "var(--red)";
                        (e.currentTarget as HTMLElement).style.background = "var(--red-soft)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
                        (e.currentTarget as HTMLElement).style.background = "none";
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                    <svg style={{ color: "var(--text-tertiary)", marginLeft: "2px" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}