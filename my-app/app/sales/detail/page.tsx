// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { SidebarLayout } from "@/components/SidebarLayout";

// const inputStyle: React.CSSProperties = {
//   padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "10px",
//   fontSize: "13.5px", background: "var(--input-bg)", color: "var(--text-primary)",
//   outline: "none", fontFamily: "var(--font-body)", transition: "border-color 0.2s, box-shadow 0.2s",
// };
// const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
//   e.target.style.borderColor = "var(--border-hover)";
//   e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
// };
// const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
//   e.target.style.borderColor = "var(--border)";
//   e.target.style.boxShadow = "none";
// };

// function InfoField({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div>
//       <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: "4px" }}>{label}</p>
//       <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{children}</p>
//     </div>
//   );
// }

// function Card({ children, className }: { children: React.ReactNode; className?: string }) {
//   return (
//     <div className={className} style={{
//       background: "var(--bg-card)", borderRadius: "14px",
//       border: "1px solid var(--border)", padding: "24px",
//       backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)",
//     }}>
//       {children}
//     </div>
//   );
// }

// function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
//   return (
//     <h2 style={{
//       fontFamily: "var(--font-display)", fontSize: "10.5px", fontWeight: 700,
//       color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "20px",
//       display: "flex", alignItems: "center", gap: "8px",
//     }}>
//       {icon}
//       {children}
//     </h2>
//   );
// }

// export default function DetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const API = process.env.NEXT_PUBLIC_API_URL || "";
//   const [data, setData] = useState<any>(null);
//   const [editing, setEditing] = useState(false);

//   useEffect(() => {
//     if (!id) return;
//     fetch(`${API}/quotations/${id}`)
//       .then(res => { if (!res.ok) throw new Error("API error"); return res.json(); })
//       .then(setData)
//       .catch(() => setData(null));
//   }, [id]);

//   if (!data) return (
//     <SidebarLayout>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
//         <div style={{ textAlign: "center" }}>
//           <div style={{
//             width: "40px", height: "40px", margin: "0 auto 16px",
//             border: "3px solid var(--border)",
//             borderTopColor: "var(--accent)",
//             borderRadius: "50%",
//             animation: "spin-slow 0.8s linear infinite",
//           }} />
//           <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading...</p>
//         </div>
//       </div>
//     </SidebarLayout>
//   );

//   const disabled = data.status === "cancel";

//   const subtotal = data.items.reduce((s: number, i: any) => {
//     let line = i.qty * i.unit_price;

//     if (data.discount_type === "amount") {
//       line -= i.discount_percent;
//     } else {
//       line *= (1 - i.discount_percent / 100);
//     }

//     return s + line;
//   }, 0);
//   const totalDiscount = data.items.reduce((s: number, i: any) => {
//     if (data.discount_type === "amount") {
//       return s + i.discount_percent;
//     } else {
//       return s + i.qty * i.unit_price * (i.discount_percent / 100);
//     }
//   }, 0);
//   const vat = data.vat_enabled ? subtotal * 0.07 : 0;
//   const total = subtotal + vat;

//   const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

//   const statusMap: Record<string, { label: string; bg: string; color: string; dot: string }> = {
//     draft: {
//       label: "Draft",
//       bg: "rgba(148,163,184,0.1)",
//       color: "#94a3b8",
//       dot: "#94a3b8"
//     },
//     sent: {
//       label: "Sent",
//       bg: "rgba(99,102,241,0.12)",
//       color: "#818cf8",
//       dot: "#818cf8"
//     },
//     approved: {
//       label: "Approved",
//       bg: "rgba(34,197,94,0.12)",
//       color: "#22c55e",
//       dot: "#22c55e"
//     },
//     cancel: {
//       label: "Cancelled",
//       bg: "rgba(239,68,68,0.12)",
//       color: "#f87171",
//       dot: "#f87171"
//     },
//     converted: {
//       label: "Converted",
//       bg: "rgba(6,182,212,0.12)",
//       color: "#06b6d4",
//       dot: "#06b6d4"
//     }
//   };
//   const st = statusMap[data.status] ?? statusMap["draft"];

//   const saveEdit = async () => {
//     await fetch(`${API}/quotations/${id}`, {
//       method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
//     });
//     setEditing(false);
//   };

//   const cancel = async () => {
//     await fetch(`${API}/quotations/${id}/status`, {
//       method: "PUT", headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status: "cancel" }),
//     });
//     router.push("/");
//   };

//   const confirm = async () => {
//   await fetch(`${API}/quotations/${id}/convert`, {
//     method: "POST"
//   });

//   router.push(`/sale/${id}`);
// };

//   return (
//     <SidebarLayout>
//       <div style={{ padding: "32px 36px 60px", maxWidth: "960px" }}>

//         {/* Breadcrumb */}
//         <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px", fontSize: "12.5px", color: "var(--text-muted)" }}>
//           <button onClick={() => router.push("/quotations")} style={{
//             background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
//             fontFamily: "var(--font-body)", fontSize: "12.5px",
//             display: "flex", alignItems: "center", gap: "4px", padding: 0,
//             transition: "color 0.2s",
//           }}
//             onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
//             onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
//           >
//             <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//             </svg>
//             Quotations
//           </button>
//           <span style={{ color: "var(--border)" }}>/</span>
//           <span style={{ color: "var(--text-secondary)" }}>{data.quotation_no}</span>
//           <span style={{ color: "var(--border)" }}>/</span>
//           <span>Detail</span>
//         </div>

//         {/* ---- HEADER CARD ---- */}
//         <Card className="fade-up">
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
//               <div style={{
//                 width: "44px", height: "44px", borderRadius: "12px",
//                 background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(219,39,119,0.15))",
//                 border: "1px solid rgba(124,58,237,0.3)",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//               }}>
//                 <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={1.8}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                   <h1 style={{
//                     fontFamily: "var(--font-mono)", fontSize: "18px", fontWeight: 700,
//                     color: "var(--text-primary)", letterSpacing: "0.01em",
//                   }}>{data.quotation_no}</h1>
//                   <span style={{
//                     display: "inline-flex", alignItems: "center", gap: "5px",
//                     background: st.bg, color: st.color,
//                     padding: "4px 11px", borderRadius: "20px",
//                     fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.04em",
//                     border: `1px solid ${st.color}30`,
//                   }}>
//                     <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.dot, boxShadow: `0 0 6px ${st.dot}` }} />
//                     {st.label}
//                   </span>
//                 </div>
//                 <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>Quotation Details</p>
//               </div>
//             </div>

//             {!disabled && (
//               <div style={{ display: "flex", gap: "8px" }}>
//                 {!editing ? (
//                   <ActionBtn onClick={() => setEditing(true)} variant="outline">
//                     <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z" />
//                     </svg>
//                     Edit
//                   </ActionBtn>
//                 ) : (
//                   <ActionBtn onClick={saveEdit} variant="success">
//                     <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                     </svg>
//                     Save
//                   </ActionBtn>
//                 )}
//                 <ActionBtn onClick={cancel} variant="danger">
//                   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                   Cancel
//                 </ActionBtn>
//                 <ActionBtn onClick={confirm} variant="primary">
//                   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                   </svg>
//                   Confirm Order
//                 </ActionBtn>
//               </div>
//             )}
//           </div>
//         </Card>

//         {/* ---- DOCUMENT DETAILS ---- */}
//         <div className="fade-up fade-up-1" style={{ marginTop: "16px" }}>
//           <Card>
//             <SectionTitle icon={<DocIcon />}>DOCUMENT DETAILS</SectionTitle>
//             {editing ? (
//               <div style={{ display: "flex", gap: "20px" }}>
//                 {[
//                   { label: "Issue Date", key: "issue_date" as const },
//                   { label: "Expiry Date", key: "expiry_date" as const },
//                 ].map(f => (
//                   <div key={f.key}>
//                     <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "5px", letterSpacing: "0.04em" }}>{f.label.toUpperCase()}</label>
//                     <input type="date" value={data[f.key]}
//                       onChange={e => setData({ ...data, [f.key]: e.target.value })}
//                       style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
//                 <InfoField label="DOCUMENT NUMBER">{data.quotation_no}</InfoField>
//                 <InfoField label="DATE">{data.issue_date}</InfoField>
//                 <InfoField label="EXPIRY DATE">{data.expiry_date}</InfoField>
//                 <div>
//                   <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: "6px" }}>STATUS</p>
//                   <span style={{
//                     display: "inline-flex", alignItems: "center", gap: "5px",
//                     background: st.bg, color: st.color,
//                     padding: "4px 10px", borderRadius: "20px",
//                     fontSize: "11.5px", fontWeight: 700,
//                     border: `1px solid ${st.color}30`,
//                   }}>
//                     <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.dot, boxShadow: `0 0 6px ${st.dot}` }} />
//                     {st.label}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </Card>
//         </div>

//         {/* ---- CUSTOMER INFO ---- */}
//         <div className="fade-up fade-up-2" style={{ marginTop: "16px" }}>
//           <Card>
//             <SectionTitle icon={<UserIcon />}>CUSTOMER INFORMATION</SectionTitle>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 48px" }}>
//               {[
//                 { label: "NAME", value: data.customer_name },
//                 { label: "COMPANY", value: data.customer_company },
//                 { label: "EMAIL", value: data.customer_email },
//                 { label: "PHONE", value: data.customer_phone },
//                 { label: "BILLING ADDRESS", value: data.customer_address },
//                 { label: "SHIPPING ADDRESS", value: data.customer_address },
//               ].map(f => (
//                 <InfoField key={f.label} label={f.label}>{f.value || "—"}</InfoField>
//               ))}
//             </div>
//           </Card>
//         </div>

//         {/* ---- ITEMS ---- */}
//         <div className="fade-up fade-up-2" style={{ marginTop: "16px" }}>
//           <Card>
//             <SectionTitle icon={<BoxIcon />}>ITEMS</SectionTitle>
//             <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
//               <thead>
//                 <tr style={{ borderBottom: "1px solid var(--border)" }}>
//                   {["Product", "Description", "Qty", "Unit Price", "Discount", "Line Total"].map((h, i) => (
//                     <th key={h} style={{
//                       padding: "8px 12px", textAlign: i >= 2 ? "right" : "left",
//                       fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)",
//                       letterSpacing: "0.06em", paddingBottom: "12px",
//                     }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.items.map((item: any, idx: number) => {
//                   let lineTotal = item.qty * item.unit_price;
//                   let discountAmt = 0;

//                   if (data.discount_type === "amount") {
//                     discountAmt = item.discount_percent;
//                     lineTotal -= discountAmt;
//                   } else {
//                     discountAmt = item.qty * item.unit_price * (item.discount_percent / 100);
//                     lineTotal -= discountAmt;
//                   }
//                   return (
//                     <tr key={idx} style={{ borderBottom: idx < data.items.length - 1 ? "1px solid var(--border)" : "none" }}>
//                       <td style={{ padding: "14px 12px", fontWeight: 600, color: "var(--text-primary)" }}>{item.product_name}</td>
//                       <td style={{ padding: "14px 12px", color: "var(--text-muted)", fontSize: "13px" }}>{item.description || "—"}</td>
//                       <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-secondary)" }}>{item.qty}</td>
//                       <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{money(item.unit_price)}</td>
//                       <td style={{ padding: "14px 12px", textAlign: "right", color: "#f87171", fontWeight: 600 }}>
//                         {data.discount_type === "amount"
//                           ? `-${money(item.discount_percent)}`
//                           : `-${item.discount_percent}%`
// }
//                       </td>
//                       <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{money(lineTotal)}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </Card>
//         </div>

//         {/* ---- SUMMARY ---- */}
//         <div className="fade-up fade-up-3" style={{ marginTop: "16px" }}>
//           <Card>
//             <SectionTitle icon={<ChartIcon />}>SUMMARY</SectionTitle>
//             <div style={{ display: "flex", justifyContent: "flex-end" }}>
//               <div style={{ width: "280px" }}>
//                 {[
//                   { label: "Subtotal", value: money(subtotal + totalDiscount), color: "var(--text-secondary)" },
//                   { label: "Discount", value: `-${money(totalDiscount)}`, color: "#f87171" },
//                   { label: "VAT (7%)", value: money(vat), color: "var(--text-secondary)" },
//                 ].map(row => (
//                   <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
//                     <span style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>{row.label}</span>
//                     <span style={{ fontSize: "13.5px", color: row.color, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{row.value}</span>
//                   </div>
//                 ))}
//                 <div style={{
//                   borderTop: "1px solid var(--border)", paddingTop: "12px",
//                   display: "flex", justifyContent: "space-between", alignItems: "center",
//                 }}>
//                   <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Grand Total</span>
//                   <span style={{
//                     fontSize: "20px", fontWeight: 900, fontFamily: "var(--font-mono)",
//                     background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
//                     WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//                   }}>{money(total)}</span>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>

//       </div>
//     </SidebarLayout>
//   );
// }

// /* ---- Icon helpers ---- */
// function DocIcon() {
//   return <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2.5}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
//   </svg>;
// }
// function UserIcon() {
//   return <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2.5}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>;
// }
// function BoxIcon() {
//   return <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2.5}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//   </svg>;
// }
// function ChartIcon() {
//   return <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2.5}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//   </svg>;
// }

// function ActionBtn({ onClick, variant, children }: { onClick: () => void; variant: string; children: React.ReactNode }) {
//   const styles: Record<string, React.CSSProperties> = {
//     outline: { background: "var(--bg-card-hover)", color: "var(--text-primary)", border: "1px solid var(--border)" },
//     success: { background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" },
//     danger:  { background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" },
//     primary: { background: "linear-gradient(135deg, #7c3aed, #db2777)", color: "white", border: "none", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" },
//   };
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         display: "flex", alignItems: "center", gap: "6px",
//         padding: "8px 16px", borderRadius: "10px",
//         fontSize: "13px", fontWeight: 700,
//         fontFamily: "var(--font-body)", cursor: "pointer",
//         transition: "all 0.2s ease",
//         ...styles[variant],
//       }}
//       onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
//       onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
//     >
//       {children}
//     </button>
//   );
// }
"use client";
/* ================================================================
   app/detail/[id]/page.tsx  (UPDATED for approval workflow)
   New features:
   - "Submit for Approval" button (draft/rejected → submitted)
   - Shows rejection note + reason prominently
   - Shows approval thread comments
   - Status: draft | submitted | approved | rejected | cancelled
   ================================================================ */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SidebarLayout, useLang } from "@/components/SidebarLayout";

type Comment = {
  comment_id: number;
  author_role: "sale" | "approver";
  message: string;
  created_at: string;
  author_name?: string;
};

/* ---- reusable ---- */
function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return <div className={className} style={{ background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)", padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)", ...style }}>{children}</div>;
}
function InfoField({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: "4px" }}>{label}</p><p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{children}</p></div>;
}
function Sec({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return <h2 style={{ fontFamily: "var(--font-display)", fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>{icon}{children}</h2>;
}

const STATUS_MAP: Record<string, { label_en: string; label_th: string; color: string; bg: string; dot: string }> = {
  draft:     { label_en: "Draft",       label_th: "แบบร่าง",          color: "#94a3b8", bg: "rgba(148,163,184,0.1)", dot: "#94a3b8" },
  submitted: { label_en: "Under Review",label_th: "รอการอนุมัติ",      color: "#f59e0b", bg: "rgba(245,158,11,0.12)", dot: "#f59e0b" },
  approved:  { label_en: "Approved",    label_th: "อนุมัติแล้ว",       color: "#22c55e", bg: "rgba(34,197,94,0.12)",  dot: "#22c55e" },
  rejected:  { label_en: "Rejected",    label_th: "ถูกปฏิเสธ",         color: "#f87171", bg: "rgba(239,68,68,0.12)",  dot: "#f87171" },
  cancelled: { label_en: "Cancelled",   label_th: "ยกเลิก",           color: "#94a3b8", bg: "rgba(148,163,184,0.1)", dot: "#94a3b8" },
};

export default function DetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, lang } = useLang();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  const [data, setData] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitNote, setSubmitNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const token = () => localStorage.getItem("wisdom-token") || "";
  const headers = () => ({ Authorization: `Bearer ${token()}`, "Content-Type": "application/json" });

  const load = () => {
    if (!id) return;
    fetch(`${API}/quotations/${id}`, { headers: headers() })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => {
        setData(d);
        setComments(d.comments || []);
      })
      .catch(() => setData(null));
  };
  useEffect(load, [id]);

  if (!data) return (
    <SidebarLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", margin: "0 auto 16px", border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{t("loading")}</p>
        </div>
      </div>
    </SidebarLayout>
  );

  const st = STATUS_MAP[data.status] ?? STATUS_MAP["draft"];
  const stLabel = lang === "th" ? st.label_th : st.label_en;
  const canEdit    = data.status === "draft" || data.status === "rejected";
  const canSubmit  = data.status === "draft" || data.status === "rejected";
  const isCancelled = data.status === "cancelled";
  const money = (n: number) => n?.toLocaleString("en-US", { style: "currency", currency: "USD" }) ?? "—";

  const subtotal = data.items?.reduce((s: number, i: any) => s + i.qty * i.unit_price * (1 - i.discount_percent / 100), 0) || 0;
  const totalDiscount = data.items?.reduce((s: number, i: any) => s + i.qty * i.unit_price * (i.discount_percent / 100), 0) || 0;
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  const submitForApproval = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/quotations/${id}/submit`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ note: submitNote.trim() }),
      });
      if (!res.ok) throw new Error();
      setShowSubmitModal(false);
      setSubmitNote("");
      load();
    } catch { alert(lang === "th" ? "ส่งไม่สำเร็จ" : "Failed to submit"); }
    finally { setSubmitting(false); }
  };

  const cancelQuotation = async () => {
    if (!confirm(lang === "th" ? "ต้องการยกเลิกใบเสนอราคานี้?" : "Cancel this quotation?")) return;
    await fetch(`${API}/quotations/${id}/status`, { method: "PUT", headers: headers(), body: JSON.stringify({ status: "cancelled" }) });
    router.push("/quotations");
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    setPostingComment(true);
    try {
      const res = await fetch(`${API}/quotations/${id}/comments`, { method: "POST", headers: headers(), body: JSON.stringify({ message: newComment.trim() }) });
      if (!res.ok) throw new Error();
      const added = await res.json();
      const me = JSON.parse(localStorage.getItem("wisdom-user") || "{}");
      setComments(prev => [...prev, { ...added, author_role: "sale", author_name: me.full_name }]);
      setNewComment("");
    } catch { alert("Failed to post comment."); }
    finally { setPostingComment(false); }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "13.5px", background: "var(--input-bg)", color: "var(--text-primary)", outline: "none", fontFamily: "var(--font-body)", transition: "border-color 0.2s, box-shadow 0.2s" };

  function ActionBtn({ onClick, variant, children, disabled }: { onClick: () => void; variant: string; children: React.ReactNode; disabled?: boolean }) {
    const styles: Record<string, React.CSSProperties> = {
      outline:  { background: "var(--bg-card-hover)", color: "var(--text-primary)", border: "1px solid var(--border)" },
      danger:   { background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" },
      primary:  { background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "white", border: "none", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" },
      submit:   { background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "white", border: "none", boxShadow: "0 4px 16px rgba(245,158,11,0.35)" },
    };
    return (
      <button onClick={onClick} disabled={disabled}
        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-body)", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s ease", opacity: disabled ? 0.5 : 1, ...styles[variant] }}
        onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
      >{children}</button>
    );
  }

  return (
    <SidebarLayout>
      <div style={{ padding: "32px 36px 60px", maxWidth: "980px" }}>

        {/* BREADCRUMB */}
        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px", fontSize: "12.5px", color: "var(--text-muted)" }}>
          <button onClick={() => router.push("/quotations")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: "12.5px", display: "flex", alignItems: "center", gap: "4px", padding: 0, transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            {lang === "th" ? "ใบเสนอราคา" : "Quotations"}
          </button>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{data.quotation_no}</span>
          <span style={{ color: "var(--border)" }}>/</span>
          <span>{lang === "th" ? "รายละเอียด" : "Detail"}</span>
        </div>

        {/* REJECTION BANNER */}
        {data.status === "rejected" && data.review_note && (
          <div className="fade-up" style={{ padding: "18px 22px", borderRadius: "14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#f87171", marginBottom: "6px" }}>
                  ❌ {lang === "th" ? "ใบเสนอราคาถูกปฏิเสธ — กรุณาแก้ไขและส่งใหม่" : "Quotation Rejected — Please revise and resubmit"}
                </p>
                <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>
                  <strong>{lang === "th" ? "เหตุผล:" : "Reason:"}</strong> {data.review_note}
                </p>
                <button onClick={() => router.push(`/edit/${id}`)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "9px", border: "none", background: "rgba(239,68,68,0.15)", color: "#f87171", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.22)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.15)"}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z" /></svg>
                  {lang === "th" ? "แก้ไขใบเสนอราคา" : "Edit & Revise"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBMITTED BANNER */}
        {data.status === "submitted" && (
          <div className="fade-up" style={{ padding: "14px 20px", borderRadius: "14px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p style={{ fontSize: "13.5px", color: "#f59e0b", fontWeight: 600 }}>
              {lang === "th" ? "⏳ ส่งไปให้ผู้อนุมัติตรวจสอบแล้ว กรุณารอการตอบกลับ" : "⏳ Submitted for approval — waiting for approver's response."}
            </p>
          </div>
        )}

        {/* APPROVED BANNER */}
        {data.status === "approved" && (
          <div className="fade-up" style={{ padding: "14px 20px", borderRadius: "14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p style={{ fontSize: "13.5px", color: "#22c55e", fontWeight: 600 }}>
                {lang === "th" ? "✅ ได้รับการอนุมัติแล้ว" : "✅ Approved! This quotation has been converted to a Sale Order."}
                {data.review_note && ` — "${data.review_note}"`}
              </p>
            </div>
            <button onClick={() => router.push(`/sale/${id}`)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "9px", border: "none", background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: "12.5px", fontWeight: 700, cursor: "pointer" }}>
              {lang === "th" ? "ดูคำสั่งซื้อ" : "View Sale Order"} →
            </button>
          </div>
        )}

        {/* HEADER CARD */}
        <Card className="fade-up">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(219,39,119,0.15))", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h1 style={{ fontFamily: "var(--font-mono)", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>{data.quotation_no}</h1>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: st.bg, color: st.color, padding: "4px 11px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 700, border: `1px solid ${st.color}30` }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.dot, boxShadow: `0 0 6px ${st.dot}` }} />
                    {stLabel}
                  </span>
                </div>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>{lang === "th" ? "รายละเอียดใบเสนอราคา" : "Quotation Details"}</p>
              </div>
            </div>

            {!isCancelled && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {canEdit && (
                  <ActionBtn onClick={() => router.push(`/edit/${id}`)} variant="outline">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z" /></svg>
                    {lang === "th" ? "แก้ไข" : "Edit"}
                  </ActionBtn>
                )}
                {canSubmit && (
                  <ActionBtn onClick={() => setShowSubmitModal(true)} variant="submit">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    {lang === "th" ? "ส่งขออนุมัติ" : "Submit for Approval"}
                  </ActionBtn>
                )}
                {canEdit && (
                  <ActionBtn onClick={cancelQuotation} variant="danger">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    {lang === "th" ? "ยกเลิก" : "Cancel"}
                  </ActionBtn>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* DOC DETAILS */}
        <div className="fade-up fade-up-1" style={{ marginTop: "16px" }}>
          <Card>
            <Sec icon={<svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" /></svg>}>
              {lang === "th" ? "รายละเอียดเอกสาร" : "DOCUMENT DETAILS"}
            </Sec>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "24px" }}>
              <InfoField label={lang === "th" ? "เลขที่เอกสาร" : "DOCUMENT NUMBER"}>{data.quotation_no}</InfoField>
              <InfoField label={lang === "th" ? "วันที่ออก" : "DATE"}>{data.issue_date}</InfoField>
              <InfoField label={lang === "th" ? "วันหมดอายุ" : "EXPIRY DATE"}>{data.expiry_date || "—"}</InfoField>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: "6px" }}>{lang === "th" ? "สถานะ" : "STATUS"}</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: st.bg, color: st.color, padding: "4px 10px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 700, border: `1px solid ${st.color}30` }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.dot, boxShadow: `0 0 6px ${st.dot}` }} />{stLabel}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* CUSTOMER */}
        <div className="fade-up fade-up-2" style={{ marginTop: "16px" }}>
          <Card>
            <Sec icon={<svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
              {lang === "th" ? "ข้อมูลลูกค้า" : "CUSTOMER INFORMATION"}
            </Sec>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 48px" }}>
              {[
                { label: lang === "th" ? "ชื่อ" : "NAME", value: data.customer_name },
                { label: lang === "th" ? "บริษัท" : "COMPANY", value: data.customer_company },
                { label: lang === "th" ? "อีเมล" : "EMAIL", value: data.customer_email },
                { label: lang === "th" ? "โทรศัพท์" : "PHONE", value: data.customer_phone },
                { label: lang === "th" ? "ที่อยู่" : "BILLING ADDRESS", value: data.customer_address },
              ].map(f => <InfoField key={f.label} label={f.label}>{f.value || "—"}</InfoField>)}
            </div>
          </Card>
        </div>

        {/* ITEMS */}
        <div className="fade-up fade-up-2" style={{ marginTop: "16px" }}>
          <Card>
            <Sec icon={<svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}>
              {lang === "th" ? "รายการสินค้า" : "ITEMS"}
            </Sec>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {[lang==="th"?"สินค้า":"Product", lang==="th"?"รายละเอียด":"Description", lang==="th"?"จำนวน":"Qty", lang==="th"?"ราคาต่อหน่วย":"Unit Price", lang==="th"?"ส่วนลด":"Discount", lang==="th"?"รวม":"Line Total"].map((h, i) => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: i >= 2 ? "right" : "left", fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", paddingBottom: "12px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.items || []).map((item: any, idx: number) => {
                  const lineTotal = item.qty * item.unit_price * (1 - item.discount_percent / 100);
                  return (
                    <tr key={item.item_id || idx} style={{ borderBottom: idx < data.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "14px 12px", fontWeight: 600, color: "var(--text-primary)" }}>{item.product_name}</td>
                      <td style={{ padding: "14px 12px", color: "var(--text-muted)", fontSize: "13px" }}>{item.description || "—"}</td>
                      <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-secondary)" }}>{item.qty}</td>
                      <td style={{ padding: "14px 12px", textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{money(item.unit_price)}</td>
                      <td style={{ padding: "14px 12px", textAlign: "right", color: "#f87171", fontWeight: 600 }}>{item.discount_percent ? `-${item.discount_percent}%` : "—"}</td>
                      <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{money(lineTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>

        {/* SUMMARY */}
        <div className="fade-up fade-up-3" style={{ marginTop: "16px" }}>
          <Card>
            <Sec icon={<svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}>
              {lang === "th" ? "สรุป" : "SUMMARY"}
            </Sec>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: "280px" }}>
                {[
                  { label: lang==="th"?"ยอดก่อนVAT":"Subtotal",    value: money(subtotal+totalDiscount), color:"var(--text-secondary)" },
                  { label: lang==="th"?"ส่วนลด":"Discount",          value: `-${money(totalDiscount)}`,   color:"#f87171" },
                  { label: lang==="th"?"ภาษี 7%":"VAT (7%)",         value: money(vat),                   color:"var(--text-secondary)" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>{r.label}</span>
                    <span style={{ fontSize: "13.5px", color: r.color, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{lang === "th" ? "ยอดรวม" : "Grand Total"}</span>
                  <span style={{ fontSize: "20px", fontWeight: 900, fontFamily: "var(--font-mono)", background: "linear-gradient(135deg,var(--accent),var(--accent-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{money(total)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* COMMENT THREAD (visible after submission) */}
        {(data.status !== "draft") && (
          <div className="fade-up fade-up-3" style={{ marginTop: "16px" }}>
            <Card>
              <Sec icon={<span style={{ fontSize: "12px" }}>💬</span>}>
                {lang === "th" ? "การสนทนา" : "APPROVAL THREAD"} ({comments.length})
              </Sec>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {comments.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", padding: "20px" }}>No comments yet.</p>}
                {comments.map(c => {
                  const isApprover = c.author_role === "approver";
                  return (
                    <div key={c.comment_id} style={{ display: "flex", gap: "10px", justifyContent: isApprover ? "flex-end" : "flex-start" }}>
                      {!isApprover && <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#db2777)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white", flexShrink: 0 }}>{(c.author_name||"S")[0].toUpperCase()}</div>}
                      <div style={{ maxWidth: "65%" }}>
                        <p style={{ fontSize: "10.5px", color: "var(--text-muted)", marginBottom: "4px", textAlign: isApprover ? "right" : "left" }}>
                          {c.author_name || (isApprover ? "Approver" : "Sale")} · {new Date(c.created_at).toLocaleString()}
                        </p>
                        <div style={{ padding: "10px 14px", borderRadius: isApprover ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: isApprover ? "rgba(5,150,105,0.1)" : "var(--input-bg)", border: isApprover ? "1px solid rgba(5,150,105,0.2)" : "1px solid var(--border)" }}>
                          <p style={{ fontSize: "13.5px", color: "var(--text-primary)", lineHeight: 1.5 }}>{c.message}</p>
                        </div>
                      </div>
                      {isApprover && <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg,#059669,#047857)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white", flexShrink: 0 }}>A</div>}
                    </div>
                  );
                })}
              </div>
              {data.status === "submitted" && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder={lang === "th" ? "เพิ่มความคิดเห็น..." : "Add a comment..."} rows={2} style={{ ...inputStyle, flex: 1, resize: "none" }}
                    onFocus={e => { e.target.style.borderColor = "var(--border-hover)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                    onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); postComment(); } }}
                  />
                  <button onClick={postComment} disabled={postingComment || !newComment.trim()} style={{ padding: "10px 16px", borderRadius: "10px", border: "none", background: newComment.trim() ? "linear-gradient(135deg,var(--accent),var(--accent-2))" : "var(--border)", color: "white", fontSize: "13px", fontWeight: 700, cursor: newComment.trim() ? "pointer" : "not-allowed", alignSelf: "flex-end" }}>
                    {postingComment ? "..." : lang === "th" ? "ส่ง" : "Send"}
                  </button>
                </div>
              )}
            </Card>
          </div>
        )}

      </div>

      {/* ═══ SUBMIT FOR APPROVAL MODAL ═══ */}
      {showSubmitModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowSubmitModal(false); }}
        >
          <div style={{ background: "var(--bg-sidebar)", border: "1px solid var(--border)", borderRadius: "20px", padding: "32px", width: "460px", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                  {lang === "th" ? "ส่งขออนุมัติ" : "Submit for Approval"}
                </h2>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{data.quotation_no} · {data.customer_name}</p>
              </div>
              <button onClick={() => setShowSubmitModal(false)} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--border)", background: "var(--input-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div style={{ padding: "14px", borderRadius: "12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: "20px" }}>
              <p style={{ fontSize: "12.5px", color: "#f59e0b", fontWeight: 600, marginBottom: "4px" }}>📋 {lang === "th" ? "สิ่งที่จะเกิดขึ้น:" : "What happens next:"}</p>
              <ul style={{ fontSize: "12px", color: "var(--text-secondary)", paddingLeft: "16px", lineHeight: 1.8 }}>
                <li>{lang === "th" ? "ส่งใบเสนอราคาไปให้ผู้อนุมัติตรวจสอบ" : "Quotation sent to approver for review"}</li>
                <li>{lang === "th" ? "คุณจะได้รับการแจ้งเตือนเมื่อมีการตอบกลับ" : "You'll be notified of the decision"}</li>
                <li>{lang === "th" ? "ถ้าถูกปฏิเสธ คุณสามารถแก้ไขและส่งใหม่ได้" : "If rejected, you can revise and resubmit"}</li>
              </ul>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", marginBottom: "7px" }}>
                {lang === "th" ? "ข้อความถึงผู้อนุมัติ (ไม่บังคับ)" : "NOTE TO APPROVER (OPTIONAL)"}
              </label>
              <textarea value={submitNote} onChange={e => setSubmitNote(e.target.value)} placeholder={lang === "th" ? "เช่น ลูกค้า VIP กรุณาตรวจสอบด่วน..." : "e.g. High-priority client, please review ASAP..."} rows={3}
                style={{ ...inputStyle, resize: "none" }}
                onFocus={e => { e.target.style.borderColor = "var(--border-hover)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowSubmitModal(false)} style={{ flex: 1, padding: "11px", borderRadius: "12px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: "13.5px", fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer" }}>
                {lang === "th" ? "ยกเลิก" : "Cancel"}
              </button>
              <button onClick={submitForApproval} disabled={submitting}
                style={{ flex: 2, padding: "11px", borderRadius: "12px", border: "none", background: submitting ? "var(--border)" : "linear-gradient(135deg,#f59e0b,#d97706)", color: "white", fontSize: "13.5px", fontWeight: 800, fontFamily: "var(--font-display)", cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 4px 16px rgba(245,158,11,0.35)", transition: "all 0.2s" }}
                onMouseEnter={e => { if (!submitting) { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(245,158,11,0.45)"; } }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(245,158,11,0.35)"; }}
              >
                {submitting ? (lang === "th" ? "กำลังส่ง..." : "Submitting...") : (lang === "th" ? "✦ ส่งขออนุมัติ" : "✦ Submit for Approval")}
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}

