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
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Quotation = {
  quotation_id: string;
  quotation_no: string;
  customer_name: string;
  customer_company: string;
  issue_date: string;
  status: string;
  total: number;
};

export default function Page() {
  const [data, setData] = useState<Quotation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [btnHover, setBtnHover] = useState(false);
  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    if (!API) { console.error("API URL missing"); return; }
    fetch(`${API}/quotations`)
      .then(res => { if (!res.ok) throw new Error("API error"); return res.json(); })
      .then(d => setData(d || []))
      .catch(err => { console.error("Fetch error:", err); setData([]); })
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
      if (!res.ok) { const text = await res.text(); throw new Error(text || "Delete failed"); }
      setData(prev => prev.filter(q => q.quotation_id !== id));
    } catch (err) { console.error("Delete error:", err); alert("Delete failed ❌"); }
    finally { setDeletingId(null); }
  };

  const statusConfig: Record<string, { label: string; cls: string }> = {
    confirmed: { label: "Approved", cls: "badge-confirmed" },
    sent: { label: "Sent", cls: "badge-sent" },
    cancel: { label: "Cancelled", cls: "badge-cancel" },
    draft: { label: "Draft", cls: "badge-draft" },
  };

  const getStatus = (q: Quotation) => statusConfig[q.status] ?? statusConfig["draft"];

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "confirmed", label: "Approved" },
    { value: "cancel", label: "Cancelled" },
  ];

  const approvedCount = data.filter(q => q.status === "confirmed").length;
  const sentCount = data.filter(q => q.status === "sent").length;
  const pipelineValue = data.reduce((sum, q) => sum + (q.total || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

        :root.dark {
          --bg0: #07070f;
          --bg1: #0f0f1a;
          --bg2: #15151f;
          --bg3: #1c1c2a;
          --text1: #f0eeff;
          --text2: #9896b8;
          --text3: #555570;
          --border: rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.12);
          --card: rgba(255,255,255,0.04);
          --card-hover: rgba(255,255,255,0.07);
          --accent: #a78bfa;
          --accent-dim: rgba(167,139,250,0.15);
          --green: #34d399;
          --green-bg: rgba(52,211,153,0.1);
          --blue: #60a5fa;
          --blue-bg: rgba(96,165,250,0.1);
          --red: #f87171;
          --red-bg: rgba(248,113,113,0.1);
          --gray-bg: rgba(148,163,184,0.1);
          --gray-text: #94a3b8;
        }
        :root.light {
          --bg0: #f0eeff;
          --bg1: #ffffff;
          --bg2: #f7f5ff;
          --bg3: #ede9fe;
          --text1: #1e1b4b;
          --text2: #4c4577;
          --text3: #9088bb;
          --border: rgba(109,40,217,0.1);
          --border2: rgba(109,40,217,0.18);
          --card: rgba(109,40,217,0.04);
          --card-hover: rgba(109,40,217,0.07);
          --accent: #7c3aed;
          --accent-dim: rgba(124,58,237,0.1);
          --green: #059669;
          --green-bg: rgba(5,150,105,0.08);
          --blue: #2563eb;
          --blue-bg: rgba(37,99,235,0.08);
          --red: #dc2626;
          --red-bg: rgba(220,38,38,0.08);
          --gray-bg: rgba(100,116,139,0.08);
          --gray-text: #64748b;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .qf-app {
          background: var(--bg0);
          color: var(--text1);
          min-height: 100vh;
          font-family: 'Outfit', sans-serif;
          transition: background 0.3s, color 0.3s;
        }

        /* ── TOPBAR ── */
        .qf-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 32px;
          border-bottom: 1px solid var(--border);
          background: var(--bg1);
          position: sticky; top: 0; z-index: 100;
        }
        .qf-logo { display: flex; align-items: center; gap: 10px; }
        .qf-logo-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, #a78bfa, #ec4899);
          display: flex; align-items: center; justify-content: center;
        }
        .qf-logo-icon svg { width: 17px; height: 17px; stroke: white; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .qf-logo-text { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: -0.02em; color: var(--text1); }
        .qf-topbar-right { display: flex; align-items: center; gap: 12px; }
        .qf-live {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 20px;
          background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2);
          font-size: 11px; font-weight: 600; color: #34d399; letter-spacing: .06em;
        }
        .qf-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; animation: livepulse 2s infinite; }
        @keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .qf-theme-btn {
          width: 52px; height: 28px; border-radius: 14px;
          border: 1px solid var(--border2); background: var(--bg3);
          cursor: pointer; position: relative; padding: 3px;
          display: flex; align-items: center; transition: background .3s;
        }
        .qf-theme-knob {
          width: 22px; height: 22px; border-radius: 50%;
          background: linear-gradient(135deg, #a78bfa, #ec4899);
          transition: transform .35s cubic-bezier(.34,1.56,.64,1);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
        }
        .light .qf-theme-knob { transform: translateX(24px); }

        /* ── MAIN ── */
        .qf-main { padding: 32px; max-width: 1200px; margin: 0 auto; }

        /* ── HERO ── */
        .qf-hero {
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px 32px 24px;
          margin-bottom: 24px;
          background: var(--bg1);
          position: relative; overflow: hidden;
        }
        .qf-hero::before {
          content: ''; position: absolute; top: -60px; right: -60px;
          width: 240px; height: 240px; border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .qf-hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600; letter-spacing: .1em;
          color: var(--accent); text-transform: uppercase;
          margin-bottom: 8px;
        }
        .qf-hero-tag::before { content: '◆'; font-size: 8px; }
        .qf-hero h1 {
          font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800;
          letter-spacing: -0.03em; color: var(--text1); margin-bottom: 4px;
        }
        .qf-hero p { font-size: 14px; color: var(--text2); }
        .qf-stats { display: flex; gap: 16px; margin-top: 20px; flex-wrap: wrap; }
        .qf-stat {
          padding: 12px 18px; background: var(--card); border: 1px solid var(--border);
          border-radius: 14px;
        }
        .qf-stat-val { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: var(--text1); }
        .qf-stat-val.green { color: var(--green); }
        .qf-stat-val.blue { color: var(--blue); }
        .qf-stat-label { font-size: 11px; color: var(--text3); margin-top: 2px; }

        /* ── CONTROLS ── */
        .qf-controls { display: flex; gap: 12px; margin-bottom: 18px; align-items: center; flex-wrap: wrap; }
        .qf-search-wrap { flex: 1; max-width: 420px; position: relative; }
        .qf-search-wrap svg {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--text3); width: 15px; height: 15px; pointer-events: none;
          stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
        }
        .qf-search-wrap input {
          width: 100%; padding: 11px 14px 11px 42px;
          background: var(--bg1); border: 1px solid var(--border);
          border-radius: 12px; color: var(--text1); font-size: 13.5px;
          outline: none; font-family: 'Outfit', sans-serif;
          transition: border .2s, box-shadow .2s;
        }
        .qf-search-wrap input::placeholder { color: var(--text3); }
        .qf-search-wrap input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }
        .qf-filter {
          padding: 11px 36px 11px 14px; background: var(--bg1);
          border: 1px solid var(--border); border-radius: 12px;
          color: var(--text2); font-size: 13.5px; cursor: pointer;
          outline: none; min-width: 150px; appearance: none;
          font-family: 'Outfit', sans-serif;
        }
        .qf-filter-wrap { position: relative; }
        .qf-filter-wrap svg {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          pointer-events: none; width: 14px; height: 14px;
          stroke: var(--text3); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
        }

        /* ── WOW BUTTON ── */
        .qf-new-btn-wrap { margin-left: auto; position: relative; }
        .qf-new-btn {
          position: relative; display: flex; align-items: center; gap: 8px;
          padding: 11px 22px; border: none; border-radius: 14px;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; overflow: hidden; z-index: 1;
          color: white; letter-spacing: 0.01em;
          transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
          background: linear-gradient(120deg, #a855f7 0%, #ec4899 50%, #60a5fa 100%);
          background-size: 200% 200%;
          animation: btnShimmer 4s ease infinite;
        }
        @keyframes btnShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .qf-new-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 30px rgba(168,85,247,0.5), 0 4px 12px rgba(236,72,153,0.3);
        }
        .qf-new-btn:active { transform: scale(0.97); }
        .qf-new-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0.2) 0%, transparent 60%);
          pointer-events: none;
        }
        .qf-new-btn .btn-glow {
          position: absolute; inset: -2px; border-radius: 16px; z-index: -1;
          background: linear-gradient(120deg, #a855f7, #ec4899, #60a5fa);
          background-size: 200% 200%;
          animation: btnShimmer 4s ease infinite;
          opacity: 0; filter: blur(8px);
          transition: opacity .2s;
        }
        .qf-new-btn:hover .btn-glow { opacity: 0.8; }
        .qf-new-btn svg { width: 15px; height: 15px; stroke: white; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
        .qf-new-btn .btn-arrow {
          display: inline-block; font-size: 13px; font-style: normal;
          transition: transform .2s;
        }
        .qf-new-btn:hover .btn-arrow { transform: translate(2px, -2px); }

        /* ── TABLE ── */
        .qf-table-wrap {
          background: var(--bg1); border: 1px solid var(--border);
          border-radius: 18px; overflow: hidden;
        }
        .qf-thead {
          display: grid;
          grid-template-columns: 56px 190px 1fr 155px 135px 155px 56px;
          padding: 10px 20px;
          border-bottom: 1px solid var(--border);
          background: var(--bg2);
        }
        .qf-th {
          font-size: 10.5px; font-weight: 600; color: var(--accent);
          letter-spacing: .08em; text-transform: uppercase;
        }
        .qf-th.r { text-align: right; }
        .qf-row {
          display: grid;
          grid-template-columns: 56px 190px 1fr 155px 135px 155px 56px;
          padding: 0 20px; border-bottom: 1px solid var(--border);
          cursor: pointer; align-items: center; min-height: 70px;
          transition: background .15s;
          animation: rowIn .35s ease both;
        }
        @keyframes rowIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: none; } }
        .qf-row:last-child { border-bottom: none; }
        .qf-row:hover { background: var(--card-hover); }
        .qf-doc-icon {
          width: 38px; height: 38px; border-radius: 11px;
          background: var(--accent-dim); border: 1px solid rgba(167,139,250,.2);
          display: flex; align-items: center; justify-content: center;
        }
        .qf-doc-icon svg { width: 17px; height: 17px; stroke: var(--accent); fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .qf-doc-no {
          font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500;
          color: var(--accent); letter-spacing: .01em;
        }
        .qf-cust-name { font-size: 14px; font-weight: 500; color: var(--text1); }
        .qf-cust-co { font-size: 11.5px; color: var(--text3); margin-top: 2px; }
        .qf-date { font-size: 13px; color: var(--text2); }
        .qf-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 20px;
          font-size: 11.5px; font-weight: 600;
        }
        .qf-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .badge-confirmed { background: var(--green-bg); color: var(--green); }
        .badge-confirmed .qf-badge-dot { background: var(--green); }
        .badge-sent { background: var(--blue-bg); color: var(--blue); }
        .badge-sent .qf-badge-dot { background: var(--blue); }
        .badge-draft { background: var(--gray-bg); color: var(--gray-text); }
        .badge-draft .qf-badge-dot { background: var(--gray-text); }
        .badge-cancel { background: var(--red-bg); color: var(--red); }
        .badge-cancel .qf-badge-dot { background: var(--red); }
        .qf-total {
          text-align: right; font-family: 'DM Mono', monospace;
          font-size: 14px; font-weight: 500; color: var(--text1);
        }
        .qf-actions { display: flex; align-items: center; justify-content: flex-end; gap: 4px; }
        .qf-del-btn {
          background: none; border: none; color: var(--text3); cursor: pointer;
          padding: 6px; border-radius: 8px;
          display: inline-flex; align-items: center;
          transition: color .15s, background .15s;
        }
        .qf-del-btn:hover { color: var(--red); background: var(--red-bg); }
        .qf-del-btn svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .qf-arrow { color: var(--text3); font-size: 18px; opacity: 0; transition: opacity .15s, transform .15s; }
        .qf-row:hover .qf-arrow { opacity: 1; transform: translateX(2px); }
        .qf-empty { padding: 64px; text-align: center; color: var(--text3); font-size: 14px; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        .fade-up { animation: fadeUp .4s ease both; }
        .fade-up-1 { animation-delay: .08s; }
        .fade-up-2 { animation-delay: .16s; }
      `}</style>

      <div className={`qf-app ${isDark ? "dark" : "light"}`}>

        {/* TOPBAR */}
        <div className="qf-topbar">
          <div className="qf-logo">
            <div className="qf-logo-icon">
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <span className="qf-logo-text">QuoteFlow</span>
          </div>
          <div className="qf-topbar-right">
            <div className="qf-live"><span className="qf-live-dot" />LIVE</div>
            <button className="qf-theme-btn" onClick={() => setIsDark(!isDark)}>
              <div className="qf-theme-knob">{isDark ? "☀" : "🌙"}</div>
            </button>
          </div>
        </div>

        <div className="qf-main">

          {/* HERO */}
          <div className="qf-hero fade-up">
            <div className="qf-hero-tag">Quotations</div>
            <h1>All Quotations</h1>
            <p>{filtered.length} document{filtered.length !== 1 ? "s" : ""} in your pipeline</p>
            <div className="qf-stats">
              <div className="qf-stat">
                <div className="qf-stat-val">{data.length}</div>
                <div className="qf-stat-label">Total Docs</div>
              </div>
              <div className="qf-stat">
                <div className="qf-stat-val green">{approvedCount}</div>
                <div className="qf-stat-label">Approved</div>
              </div>
              <div className="qf-stat">
                <div className="qf-stat-val blue">{sentCount}</div>
                <div className="qf-stat-label">Sent</div>
              </div>
              <div className="qf-stat">
                <div className="qf-stat-val">{money(pipelineValue)}</div>
                <div className="qf-stat-label">Pipeline Value</div>
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="qf-controls fade-up fade-up-1">
            <div className="qf-search-wrap">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Search customer or document..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="qf-filter-wrap">
              <select className="qf-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div className="qf-new-btn-wrap">
              <button className="qf-new-btn" onClick={() => router.push("/create")}>
                <span className="btn-glow" />
                <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Create Quotation
                <span className="btn-arrow">↗</span>
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="qf-table-wrap fade-up fade-up-2">
            <div className="qf-thead">
              {["", "Doc Number", "Customer", "Date", "Status", "Total", ""].map((h, i) => (
                <div key={i} className={`qf-th ${i >= 5 ? "r" : ""}`}>{h}</div>
              ))}
            </div>
            {loaded && filtered.length === 0 && (
              <div className="qf-empty">No quotations found.</div>
            )}
            {filtered.map((q, idx) => {
              const st = getStatus(q);
              return (
                <div
                  key={q.quotation_id}
                  className="qf-row"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  onClick={() => router.push(`/detail/${q.quotation_id}`)}
                >
                  <div>
                    <div className="qf-doc-icon">
                      <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                  </div>
                  <div><div className="qf-doc-no">{q.quotation_no}</div></div>
                  <div>
                    <div className="qf-cust-name">{q.customer_name || "—"}</div>
                    <div className="qf-cust-co">{q.customer_company || ""}</div>
                  </div>
                  <div className="qf-date">{formatDate(q.issue_date)}</div>
                  <div>
                    <span className={`qf-badge ${st.cls}`}>
                      <span className="qf-badge-dot" />
                      {st.label}
                    </span>
                  </div>
                  <div className="qf-total">{money(q.total)}</div>
                  <div className="qf-actions">
                    <button
                      className="qf-del-btn"
                      disabled={deletingId === q.quotation_id}
                      onClick={e => handleDelete(e, q.quotation_id)}
                    >
                      <svg viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                    <span className="qf-arrow">›</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}