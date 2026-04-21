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

//   const subtotal = data.items.reduce((s: number, i: any) => s + i.qty * i.unit_price * (1 - i.discount_percent / 100), 0);
//   const totalDiscount = data.items.reduce((s: number, i: any) => s + i.qty * i.unit_price * (i.discount_percent / 100), 0);
//   const vat = subtotal * 0.07;
//   const total = subtotal + vat;

//   const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

//   const statusMap: Record<string, { label: string; bg: string; color: string; dot: string }> = {
//     confirmed: { label: "Approved", bg: "rgba(34,197,94,0.12)", color: "#22c55e", dot: "#22c55e" },
//     cancel:    { label: "Cancelled", bg: "rgba(239,68,68,0.12)", color: "#f87171", dot: "#f87171" },
//     sent:      { label: "Sent", bg: "rgba(99,102,241,0.12)", color: "#818cf8", dot: "#818cf8" },
//     draft:     { label: "Draft", bg: "rgba(148,163,184,0.1)", color: "#94a3b8", dot: "#94a3b8" },
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
//     await fetch(`${API}/quotations/${id}/status`, {
//       method: "PUT", headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status: "confirmed" }),
//     });
//     router.push(`/sale/${id}`);
//   };

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
//                   const lineTotal = item.qty * item.unit_price * (1 - item.discount_percent / 100);
//                   const discountAmt = item.qty * item.unit_price * (item.discount_percent / 100);
//                   return (
//                     <tr key={idx} style={{ borderBottom: idx < data.items.length - 1 ? "1px solid var(--border)" : "none" }}>
//                       <td style={{ padding: "14px 12px", fontWeight: 600, color: "var(--text-primary)" }}>{item.product_name}</td>
//                       <td style={{ padding: "14px 12px", color: "var(--text-muted)", fontSize: "13px" }}>{item.description || "—"}</td>
//                       <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-secondary)" }}>{item.qty}</td>
//                       <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{money(item.unit_price)}</td>
//                       <td style={{ padding: "14px 12px", textAlign: "right", color: "#f87171", fontWeight: 600 }}>
//                         {item.discount_percent ? `-${item.discount_percent}%` : money(discountAmt)}
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
// page3-detail-updated.tsx  →  app/detail/[id]/page.tsx
// ปุ่ม Edit → router.push(`/edit/${id}`)

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
[data-theme="dark"]{--bg-base:#0d0d14;--bg-surface:#13131e;--bg-elevated:#1a1a28;--bg-overlay:#20202f;--bg-muted:rgba(255,255,255,.04);--bg-muted-hover:rgba(255,255,255,.07);--text-primary:#eeeeff;--text-secondary:#9090b0;--text-tertiary:#555570;--text-placeholder:#444460;--border-subtle:rgba(255,255,255,.06);--border-default:rgba(255,255,255,.10);--border-strong:rgba(255,255,255,.16);--accent:#9d7cf8;--accent-soft:rgba(157,124,248,.14);--accent-glow:rgba(157,124,248,.25);--green:#2ecc9a;--green-soft:rgba(46,204,154,.12);--blue:#5aabf8;--blue-soft:rgba(90,171,248,.12);--red:#f06a6a;--red-soft:rgba(240,106,106,.12);--slate:#8888a8;--slate-soft:rgba(136,136,168,.12);--sidebar-bg:#0f0f18;--sidebar-w:220px;--shadow-btn:0 4px 20px rgba(157,124,248,.35);}
[data-theme="light"]{--bg-base:#f4f2ff;--bg-surface:#ffffff;--bg-elevated:#faf8ff;--bg-overlay:#f0eeff;--bg-muted:rgba(109,40,217,.04);--bg-muted-hover:rgba(109,40,217,.07);--text-primary:#1c1840;--text-secondary:#4e4878;--text-tertiary:#9088bb;--text-placeholder:#b0a8d8;--border-subtle:rgba(109,40,217,.08);--border-default:rgba(109,40,217,.13);--border-strong:rgba(109,40,217,.22);--accent:#7c3aed;--accent-soft:rgba(124,58,237,.10);--accent-glow:rgba(124,58,237,.20);--green:#0a9e74;--green-soft:rgba(10,158,116,.10);--blue:#2563eb;--blue-soft:rgba(37,99,235,.10);--red:#dc2626;--red-soft:rgba(220,38,38,.10);--slate:#6b6b8a;--slate-soft:rgba(107,107,138,.10);--sidebar-bg:#faf9ff;--sidebar-w:220px;--shadow-btn:0 4px 20px rgba(124,58,237,.25);}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:14px}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:var(--bg-base);color:var(--text-primary);-webkit-font-smoothing:antialiased}
input,select,textarea,button{font-family:inherit}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border-strong);border-radius:4px}
.dt-layout{display:flex;min-height:100vh}
.dt-sidebar{width:var(--sidebar-w);min-height:100vh;background:var(--sidebar-bg);border-right:1px solid var(--border-subtle);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:50}
.dt-logo{display:flex;align-items:center;gap:10px;padding:18px 20px 16px;border-bottom:1px solid var(--border-subtle)}
.dt-logo-icon{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#a855f7,#ec4899);display:flex;align-items:center;justify-content:center}
.dt-logo-icon svg{width:15px;height:15px;stroke:white;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.dt-logo-text{font-size:15px;font-weight:700;color:var(--text-primary);letter-spacing:-0.02em}
.dt-sidebar-section{padding:14px 12px 4px}
.dt-sidebar-label{font-size:10px;font-weight:600;color:var(--text-tertiary);letter-spacing:.08em;text-transform:uppercase;padding:0 8px;margin-bottom:4px}
.dt-nav-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;font-size:13.5px;font-weight:500;color:var(--text-secondary);cursor:pointer;transition:background .15s,color .15s;margin-bottom:2px}
.dt-nav-item:hover{background:var(--bg-muted-hover);color:var(--text-primary)}
.dt-nav-item.active{background:var(--accent-soft);color:var(--accent)}
.dt-nav-item svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.dt-sidebar-footer{margin-top:auto;padding:14px 16px;border-top:1px solid var(--border-subtle);font-size:11.5px;color:var(--text-tertiary)}
.dt-sidebar-footer strong{color:var(--accent)}
.dt-content{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column}
.dt-topbar{height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:var(--bg-surface);border-bottom:1px solid var(--border-subtle);position:sticky;top:0;z-index:40}
.dt-topbar-left{display:flex;align-items:center;gap:8px;font-size:13.5px;color:var(--text-tertiary)}
.dt-topbar-right{display:flex;align-items:center;gap:10px}
.dt-live{display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;background:rgba(46,204,154,.10);border:1px solid rgba(46,204,154,.2);font-size:11px;font-weight:700;color:var(--green);letter-spacing:.06em}
.dt-live-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:livepulse 2s infinite}
@keyframes livepulse{0%,100%{opacity:1}50%{opacity:.4}}
.dt-icon-btn{width:34px;height:34px;border-radius:8px;border:1px solid var(--border-default);background:var(--bg-muted);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-secondary);transition:background .15s,color .15s}
.dt-icon-btn:hover{background:var(--bg-muted-hover);color:var(--text-primary)}
.dt-icon-btn svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.dt-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#ec4899);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:white;cursor:pointer}
.dt-page{flex:1;padding:24px}
.dt-doc-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px}
.dt-doc-left{display:flex;align-items:center;gap:14px}
.dt-back-btn{background:none;border:none;color:var(--text-secondary);cursor:pointer;padding:4px;display:flex;align-items:center;transition:color .15s}
.dt-back-btn:hover{color:var(--text-primary)}
.dt-back-btn svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.dt-doc-no{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:700;color:var(--text-primary);letter-spacing:-0.01em}
.dt-doc-sub{font-size:12px;color:var(--text-tertiary);margin-top:2px}
.dt-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.dt-badge-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.badge-confirmed{background:var(--green-soft);color:var(--green)}.badge-confirmed .dt-badge-dot{background:var(--green)}
.badge-sent{background:var(--blue-soft);color:var(--blue)}.badge-sent .dt-badge-dot{background:var(--blue)}
.badge-draft{background:var(--slate-soft);color:var(--slate)}.badge-draft .dt-badge-dot{background:var(--slate)}
.badge-cancel{background:var(--red-soft);color:var(--red)}.badge-cancel .dt-badge-dot{background:var(--red)}
.dt-actions{display:flex;gap:10px;flex-wrap:wrap}
.dt-btn{display:inline-flex;align-items:center;gap:7px;padding:8px 16px;border-radius:9px;border:none;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:transform .15s,opacity .15s,box-shadow .15s;white-space:nowrap}
.dt-btn:hover{transform:translateY(-1px);opacity:.92}
.dt-btn:active{transform:scale(.97);opacity:1}
.dt-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.dt-btn svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.btn-primary{position:relative;overflow:hidden;color:white;background:linear-gradient(115deg,#a855f7 0%,#ec4899 55%,#60a5fa 100%);background-size:200% 200%;animation:gradShift 5s ease infinite;box-shadow:var(--shadow-btn)}
@keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(120deg,rgba(255,255,255,.18) 0%,transparent 55%);pointer-events:none}
.btn-primary:hover{box-shadow:0 6px 28px rgba(168,85,247,.5);opacity:1;transform:translateY(-1px)}
.btn-ghost{background:none;border:1px solid var(--border-default);color:var(--text-secondary)}
.btn-ghost:hover{background:var(--bg-muted);color:var(--text-primary);opacity:1}
.btn-danger{background:var(--red-soft);border:1px solid rgba(240,106,106,.2);color:var(--red)}
.btn-success{background:var(--green-soft);border:1px solid rgba(46,204,154,.2);color:var(--green)}
.dt-card{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;padding:20px 22px;box-shadow:0 1px 3px rgba(0,0,0,.08);margin-bottom:14px}
.dt-card-title{font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;gap:8px}
.dt-card-title svg{width:15px;height:15px;stroke:var(--accent);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.dt-field-label{font-size:11px;font-weight:600;color:var(--text-tertiary);letter-spacing:.03em;margin-bottom:5px}
.dt-field-val{font-size:13.5px;font-weight:500;color:var(--text-primary)}
.dt-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.dt-grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px 24px}
.dt-input{width:100%;padding:8px 11px;background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:8px;color:var(--text-primary);font-size:13.5px;outline:none;transition:border .18s,box-shadow .18s}
.dt-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
.dt-select-wrap{position:relative}
.dt-select-wrap svg{position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--text-tertiary);width:13px;height:13px}
.dt-table-wrap{overflow-x:auto}
.dt-table{width:100%;border-collapse:collapse;font-size:13.5px}
.dt-table thead tr{border-bottom:1px solid var(--border-default)}
.dt-table th{padding:8px 12px;text-align:left;font-size:10px;font-weight:700;color:var(--text-tertiary);letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}
.dt-table th.r{text-align:right}
.dt-table tbody tr{border-bottom:1px solid var(--border-subtle);transition:background .12s}
.dt-table tbody tr:last-child{border-bottom:none}
.dt-table tbody tr:hover{background:var(--bg-muted)}
.dt-table td{padding:13px 12px;color:var(--text-secondary);vertical-align:middle}
.dt-table td.r{text-align:right}
.dt-table td.primary{color:var(--text-primary);font-weight:500}
.dt-table td.mono{font-family:'JetBrains Mono',monospace;font-size:13px;text-align:right;color:var(--text-primary);font-weight:500}
.dt-sum-wrap{display:flex;justify-content:flex-end}
.dt-sum-box{width:280px}
.dt-sum-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;font-size:13.5px;color:var(--text-secondary);border-bottom:1px solid var(--border-subtle)}
.dt-sum-row:last-of-type{border-bottom:none}
.dt-sum-val{font-family:'JetBrains Mono',monospace;font-size:13px}
.dt-sum-disc{color:var(--red)}
.dt-sum-total{display:flex;justify-content:space-between;align-items:center;padding:12px 0 0;border-top:1px solid var(--border-strong);margin-top:4px}
.dt-sum-total-label{font-size:13px;font-weight:700;color:var(--text-primary);letter-spacing:.06em;text-transform:uppercase}
.dt-sum-total-val{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:700;color:var(--accent)}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.a0{animation:fadeUp .32s ease both}.a1{animation:fadeUp .32s .05s ease both}.a2{animation:fadeUp .32s .10s ease both}
.a3{animation:fadeUp .32s .15s ease both}.a4{animation:fadeUp .32s .20s ease both}.a5{animation:fadeUp .32s .25s ease both}
`;

export default function DetailPage() {
  const { id }  = useParams();
  const router  = useRouter();
  const API     = process.env.NEXT_PUBLIC_API_URL || "";
  const [data, setData]   = useState<any>(null);
  const [actLoad, setAL]  = useState<string|null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("qf-theme");
    if (saved) setIsDark(saved === "dark");
  }, []);

  const toggleTheme = () => {
    setIsDark(v => { localStorage.setItem("qf-theme", !v ? "dark" : "light"); return !v; });
  };

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/quotations/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setData).catch(() => setData(null));
  }, [id]);

  if (!data) return (
    <>
      <style>{CSS}</style>
      <div data-theme={isDark?"dark":"light"} style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",color:"var(--text-tertiary)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"13.5px"}}>
        Loading...
      </div>
    </>
  );

  const disabled = data.status === "cancel";
  const subtotal   = data.items.reduce((s:number,i:any)=>s+i.qty*i.unit_price*(1-i.discount_percent/100),0);
  const totalDisc  = data.items.reduce((s:number,i:any)=>s+i.qty*i.unit_price*(i.discount_percent/100),0);
  const vat        = subtotal*0.07;
  const total      = subtotal+vat;
  const fmt        = (n:number)=>n.toLocaleString("en-US",{style:"currency",currency:"USD"});

  const statusMap: Record<string,{label:string;cls:string}> = {
    confirmed:{label:"APPROVED",cls:"badge-confirmed"},
    cancel:{label:"CANCELLED",cls:"badge-cancel"},
    sent:{label:"SENT",cls:"badge-sent"},
    draft:{label:"DRAFT",cls:"badge-draft"},
  };
  const st = statusMap[data.status]??statusMap.draft;

  const doCancel = async () => {
    if (!confirm("Cancel this quotation?")) return;
    setAL("cancel");
    try {
      await fetch(`${API}/quotations/${id}/status`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"cancel"})});
      router.push("/");
    } finally { setAL(null); }
  };

  const doConfirm = async () => {
    setAL("confirm");
    try {
      await fetch(`${API}/quotations/${id}/status`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"confirmed"})});
      router.push(`/sale/${id}`);
    } finally { setAL(null); }
  };

  const ICONS = {
    back:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
    edit:<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    cancel:<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    confirm:<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    calendar:<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    user:<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    list:<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    dollar:<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    sun:<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    moon:<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    docNav:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
    grid:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    cart:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  };

  return (
    <>
      <style>{CSS}</style>
      <div data-theme={isDark?"dark":"light"}>
        <div className="dt-layout">

          {/* SIDEBAR */}
          <aside className="dt-sidebar">
            <div className="dt-logo">
              <div className="dt-logo-icon">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <span className="dt-logo-text">SalesPro</span>
            </div>
            <div className="dt-sidebar-section">
              <div className="dt-sidebar-label">WORKSPACE</div>
              <div className="dt-nav-item" onClick={()=>router.push("/dashboard")}>{ICONS.grid} Dashboard</div>
              <div className="dt-nav-item active" onClick={()=>router.push("/")}>{ICONS.docNav} Quotations</div>
              <div className="dt-nav-item" onClick={()=>router.push("/orders")}>{ICONS.cart} Sales Orders</div>
            </div>
            <div className="dt-sidebar-footer"><strong>Pro Tip 💡</strong><br/>Convert quotes to orders in one click.</div>
          </aside>

          {/* CONTENT */}
          <div className="dt-content">
            <header className="dt-topbar">
              <div className="dt-topbar-left">
                <span>Quotations</span>
                <span style={{color:"var(--text-tertiary)"}}>/</span>
                <span>{data.quotation_no}</span>
                <span style={{color:"var(--text-tertiary)"}}>/</span>
                <span style={{color:"var(--text-primary)",fontWeight:600}}>Detail</span>
              </div>
              <div className="dt-topbar-right">
                <div className="dt-live"><span className="dt-live-dot"/>LIVE</div>
                <button className="dt-icon-btn" onClick={toggleTheme}>{isDark?ICONS.sun:ICONS.moon}</button>
                <div className="dt-avatar">S</div>
              </div>
            </header>

            <div className="dt-page">

              {/* DOC HEADER */}
              <div className="dt-doc-header a0">
                <div className="dt-doc-left">
                  <button className="dt-back-btn" onClick={()=>router.push("/")}>{ICONS.back}</button>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                      <span className="dt-doc-no">{data.quotation_no}</span>
                      <span className={`dt-badge ${st.cls}`}><span className="dt-badge-dot"/>{st.label}</span>
                    </div>
                    <div className="dt-doc-sub">Quotation Details</div>
                  </div>
                </div>

                {!disabled && (
                  <div className="dt-actions">
                    {/* ── EDIT → ไปหน้า /edit/[id] ── */}
                    <button
                      className="dt-btn btn-ghost"
                      onClick={() => router.push(`/edit/${id}`)}
                    >
                      {ICONS.edit} Edit
                    </button>
                    <button className="dt-btn btn-danger" onClick={doCancel} disabled={actLoad==="cancel"}>
                      {ICONS.cancel} {actLoad==="cancel"?"Cancelling...":"Cancel"}
                    </button>
                    <button className="dt-btn btn-primary" onClick={doConfirm} disabled={actLoad==="confirm"}>
                      {ICONS.confirm} {actLoad==="confirm"?"Confirming...":"Confirm Order"}
                    </button>
                  </div>
                )}
              </div>

              {/* DOCUMENT DETAILS */}
              <div className="dt-card a1">
                <div className="dt-card-title">{ICONS.calendar} Document Details</div>
                <div className="dt-grid4">
                  {[
                    {label:"Document Number", val:<span style={{fontFamily:"'JetBrains Mono',monospace"}}>{data.quotation_no}</span>},
                    {label:"Issue Date", val:data.issue_date},
                    {label:"Expiry Date", val:data.expiry_date},
                    {label:"Status", val:<span className={`dt-badge ${st.cls}`}><span className="dt-badge-dot"/>{st.label}</span>},
                  ].map((f,i)=>(
                    <div key={i}>
                      <div className="dt-field-label">{f.label}</div>
                      <div className="dt-field-val">{f.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CUSTOMER */}
              <div className="dt-card a2">
                <div className="dt-card-title">{ICONS.user} Customer Information</div>
                <div className="dt-grid2">
                  {[
                    {label:"Name",val:data.customer_name},{label:"Company",val:data.customer_company||"—"},
                    {label:"Email",val:data.customer_email||"—"},{label:"Phone",val:data.customer_phone||"—"},
                    {label:"Billing Address",val:data.customer_address||"—"},{label:"Shipping Address",val:data.customer_shipping_address||data.customer_address||"—"},
                  ].map((f,i)=>(
                    <div key={i}>
                      <div className="dt-field-label">{f.label}</div>
                      <div className="dt-field-val">{f.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ITEMS */}
              <div className="dt-card a3">
                <div className="dt-card-title">{ICONS.list} Items</div>
                <div className="dt-table-wrap">
                  <table className="dt-table">
                    <thead><tr>
                      <th>Product</th><th>Description</th>
                      <th className="r">Qty</th><th className="r">Unit Price</th>
                      <th className="r">Discount</th><th className="r">Line Total</th>
                    </tr></thead>
                    <tbody>
                      {data.items.map((item:any,idx:number)=>{
                        const lt = item.qty*item.unit_price*(1-item.discount_percent/100);
                        const da = item.qty*item.unit_price*(item.discount_percent/100);
                        return (
                          <tr key={idx}>
                            <td className="primary">{item.product_name}</td>
                            <td>{item.description||"—"}</td>
                            <td className="r">{item.qty}</td>
                            <td className="mono">{fmt(item.unit_price)}</td>
                            <td style={{textAlign:"right",color:"var(--text-tertiary)",fontSize:"12px"}}>
                              {item.discount_percent?`${item.discount_percent}%`:fmt(da)}
                            </td>
                            <td className="mono">{fmt(lt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SUMMARY */}
              <div className="dt-card a4">
                <div className="dt-card-title">{ICONS.dollar} Summary</div>
                <div className="dt-sum-wrap">
                  <div className="dt-sum-box">
                    <div className="dt-sum-row"><span>Subtotal</span><span className="dt-sum-val">{fmt(subtotal+totalDisc)}</span></div>
                    <div className="dt-sum-row"><span>Discount</span><span className="dt-sum-val dt-sum-disc">−{fmt(totalDisc)}</span></div>
                    <div className="dt-sum-row"><span>VAT (7%)</span><span className="dt-sum-val">{fmt(vat)}</span></div>
                    <div className="dt-sum-total">
                      <span className="dt-sum-total-label">Grand Total</span>
                      <span className="dt-sum-total-val">{fmt(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}