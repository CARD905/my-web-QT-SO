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
import { Plus, Search, Filter, Trash2, ChevronRight, FileText, Globe } from "lucide-react";

// --- Types เหมือนเดิม ---
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
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    fetch(`${API}/quotations`)
      .then(res => res.json())
      .then(d => setData(d || []))
      .catch(() => setData([]))
      .finally(() => setLoaded(true));
  }, [API]);

  const money = (n: number) => n?.toLocaleString("en-US", { style: "currency", currency: "USD" }) ?? "—";
  
  const statusConfig: any = {
    confirmed: { label: "Approved", color: "text-emerald-500", bg: "bg-emerald-500/10", dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" },
    sent: { label: "Sent", color: "text-blue-500", bg: "bg-blue-500/10", dot: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" },
    draft: { label: "Draft", color: "text-zinc-400", bg: "bg-zinc-500/10", dot: "bg-zinc-400" },
  };

  const filtered = data.filter(q => {
    const matchSearch = (q.quotation_no + q.customer_name).toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-bold tracking-widest uppercase">
              <FileText size={12} /> Quotations
            </div>
            <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">
              All Quotations
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
              {filtered.length} documents in your pipeline
            </p>
          </div>

          <button 
            onClick={() => router.push("/create")}
            className="group flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-2xl font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Plus size={18} strokeWidth={3} />
            New Quotation
          </button>
        </div>

        {/* SEARCH & FILTERS - BENTO STYLE */}
        <div className="flex gap-4 p-2 bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl backdrop-blur-md">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search customer, company or doc number..."
              className="w-full bg-transparent pl-12 pr-4 py-3 outline-none text-sm font-medium"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="h-10 w-[1px] bg-zinc-200 dark:bg-zinc-800 self-center" />
          <select 
            className="bg-transparent px-4 py-3 outline-none text-sm font-bold text-zinc-600 dark:text-zinc-400 cursor-pointer"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="confirmed">Approved</option>
          </select>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-5 px-8 py-5 border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-400">
            <span>Document</span>
            <span>Customer</span>
            <span>Date</span>
            <span className="text-center">Status</span>
            <span className="text-right">Total</span>
          </div>

          <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {filtered.map((q) => {
              const st = statusConfig[q.status] || statusConfig.draft;
              return (
                <div 
                  key={q.quotation_id}
                  onClick={() => router.push(`/detail/${q.quotation_id}`)}
                  className="grid grid-cols-5 px-8 py-6 items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                      <FileText size={20} />
                    </div>
                    <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">{q.quotation_no}</span>
                  </div>

                  <div>
                    <div className="font-bold text-sm">{q.customer_name}</div>
                    <div className="text-[11px] text-zinc-500">{q.customer_company}</div>
                  </div>

                  <div className="text-sm text-zinc-500 font-medium">
                    {new Date(q.issue_date).toLocaleDateString()}
                  </div>

                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${st.bg} ${st.color} text-[11px] font-bold`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>

                  <div className="text-right flex items-center justify-end gap-4">
                    <span className="font-mono font-bold text-lg tracking-tighter">{money(q.total)}</span>
                    <ChevronRight size={18} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
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