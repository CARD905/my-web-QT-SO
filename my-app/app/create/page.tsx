// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { SidebarLayout } from "@/components/SidebarLayout";

// type Customer = {
//   customer_name: string;
//   customer_company: string;
//   customer_phone: string;
//   customer_address: string;
//   customer_email: string;
// };
// type CustomerDB = Customer & { customer_id: number };
// type Item = {
//   product_name: string;
//   description: string;
//   qty: number;
//   unit_price: number;
//   discount: number;
// };

// /* ---- reusable input style ---- */
// const inputStyle: React.CSSProperties = {
//   width: "100%",
//   padding: "10px 14px",
//   border: "1px solid var(--border)",
//   borderRadius: "10px",
//   fontSize: "13.5px",
//   background: "var(--input-bg)",
//   color: "var(--text-primary)",
//   outline: "none",
//   fontFamily: "var(--font-body)",
//   transition: "border-color 0.2s, box-shadow 0.2s",
// };

// function Field({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div>
//       <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.03em" }}>
//         {label}
//       </label>
//       {children}
//     </div>
//   );
// }

// export default function CreatePage() {
//   const router = useRouter();
//   const API = process.env.NEXT_PUBLIC_API_URL || "";

//   const [customers, setCustomers] = useState<CustomerDB[]>([]);
//   const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
//   const [customer, setCustomer] = useState<Customer>({
//     customer_name: "", customer_company: "", customer_phone: "",
//     customer_address: "", customer_email: "",
//   });
//   const [items, setItems] = useState<Item[]>([{ product_name: "", description: "", qty: 1, unit_price: 0, discount: 0 }]);
//   const [date, setDate] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetch(`${API}/customers`).then(r => r.json()).then(setCustomers);
//     const today = new Date();
//     const next = new Date(); next.setDate(today.getDate() + 30);
//     const f = (d: Date) => d.toISOString().split("T")[0];
//     setDate(f(today)); setExpiry(f(next));
//   }, []);

//   const selectCustomer = (id: number) => {
//     setSelectedCustomerId(id);
//     const c = customers.find(c => c.customer_id === id);
//     if (!c) return;
//     setCustomer({ customer_name: c.customer_name, customer_company: c.customer_company, customer_phone: c.customer_phone, customer_address: c.customer_address, customer_email: c.customer_email });
//   };

//   const addRow = () => setItems([...items, { product_name: "", description: "", qty: 1, unit_price: 0, discount: 0 }]);
//   const deleteRow = (i: number) => setItems(items.filter((_, idx) => idx !== i));
//   const updateItem = <K extends keyof Item>(i: number, field: K, value: Item[K]) => {
//     const n = [...items]; n[i][field] = value; setItems(n);
//   };

//   const subtotal = items.reduce((s, i) => s + i.qty * i.unit_price * (1 - i.discount / 100), 0);
//   const vat = subtotal * 0.07;
//   const total = subtotal + vat;
//   const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

//   const submit = async () => {
//   setSubmitting(true);

//   try {
//     const res = await fetch(`${API}/quotations`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         customer_id: selectedCustomerId,
//         customer,
//         issue_date: date,
//         expiry_date: expiry,
//         items,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       console.error(data);
//       alert(data.error || "error");
//       return;
//     }

//     alert("บันทึกสำเร็จ ✅");

//     // 🔥 เพิ่มอันนี้ (สำคัญ)
//     router.push("/");
//   } finally {
//     setSubmitting(false);
//   }
// };

//   const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     e.target.style.borderColor = "var(--border-hover)";
//     e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
//   };
//   const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     e.target.style.borderColor = "var(--border)";
//     e.target.style.boxShadow = "none";
//   };

//   return (
//     <SidebarLayout>
//       <div style={{ padding: "32px 36px 60px" }}>

//         {/* ---- PAGE HEADER ---- */}
//         <div className="fade-up" style={{ marginBottom: "28px" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
//             <button
//               onClick={() => router.push("/sale-order")}
//               style={{
//                 display: "flex", alignItems: "center", gap: "5px",
//                 background: "none", border: "none", cursor: "pointer",
//                 color: "var(--text-muted)", fontSize: "12.5px", fontWeight: 500,
//                 fontFamily: "var(--font-body)", padding: "4px 0",
//                 transition: "color 0.2s",
//               }}
//               onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
//               onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
//             >
//               <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//               </svg>
//               Quotations
//             </button>
//             <span style={{ color: "var(--border)", fontSize: "12px" }}>/</span>
//             <span style={{ color: "var(--text-secondary)", fontSize: "12.5px" }}>New</span>
//             <span style={{ color: "var(--border)", fontSize: "12px" }}>/</span>
//             <span style={{ color: "var(--text-secondary)", fontSize: "12.5px" }}>Edit</span>
//           </div>
//           <h1 style={{
//             fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800,
//             letterSpacing: "-0.04em", color: "var(--text-primary)",
//           }}>Create Quotation</h1>
//         </div>

//         {/* ---- TOP DATE BAR ---- */}
//         <div className="fade-up fade-up-1" style={{
//           background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)",
//           padding: "18px 24px", marginBottom: "20px",
//           display: "flex", justifyContent: "space-between", alignItems: "center",
//           backdropFilter: "blur(12px)",
//         }}>
//           <div>
//             <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
//               New Quotation
//             </p>
//             <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Enterprise Sales System</p>
//           </div>
//           <div style={{ display: "flex", gap: "12px" }}>
//             {[
//               { label: "Issue Date", value: date, onChange: setDate },
//               { label: "Expiry Date", value: expiry, onChange: setExpiry },
//             ].map(f => (
//               <div key={f.label}>
//                 <label style={{ display: "block", fontSize: "10.5px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px", letterSpacing: "0.04em" }}>{f.label}</label>
//                 <input
//                   type="date" value={f.value}
//                   onChange={e => f.onChange(e.target.value)}
//                   style={{ ...inputStyle, width: "auto", padding: "8px 12px" }}
//                   onFocus={focusStyle} onBlur={blurStyle}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", alignItems: "start" }}>

//           {/* ---- LEFT ---- */}
//           <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

//             {/* CUSTOMER CARD */}
//             <div className="fade-up fade-up-1" style={{
//               background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)",
//               padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)",
//             }}>
//               <h2 style={{
//                 fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700,
//                 color: "var(--text-primary)", marginBottom: "18px",
//                 display: "flex", alignItems: "center", gap: "8px",
//               }}>
//                 <span style={{
//                   width: "28px", height: "28px", borderRadius: "8px",
//                   background: "rgba(124,58,237,0.12)",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                 }}>
//                   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </span>
//                 Customer Information
//               </h2>

//               <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
//                 <Field label="SELECT CUSTOMER">
//                   <select
//                     value={selectedCustomerId || ""}
//                     onChange={e => selectCustomer(Number(e.target.value))}
//                     style={{ ...inputStyle }}
//                     onFocus={focusStyle} onBlur={blurStyle}
//                   >
//                     <option value="">Select customer...</option>
//                     {customers.map(c => (
//                       <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>
//                     ))}
//                   </select>
//                 </Field>

//                 <Field label="CUSTOMER NAME">
//                   <input placeholder="Full name" value={customer.customer_name}
//                     onChange={e => setCustomer({ ...customer, customer_name: e.target.value })}
//                     style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
//                 </Field>

//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
//                   <Field label="COMPANY">
//                     <input placeholder="Company name" value={customer.customer_company}
//                       onChange={e => setCustomer({ ...customer, customer_company: e.target.value })}
//                       style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
//                   </Field>
//                   <Field label="PHONE">
//                     <input placeholder="+1 000 000 0000" value={customer.customer_phone}
//                       onChange={e => setCustomer({ ...customer, customer_phone: e.target.value })}
//                       style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
//                   </Field>
//                 </div>

//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
//                   <Field label="BILLING ADDRESS">
//                     <input placeholder="Address" value={customer.customer_address}
//                       onChange={e => setCustomer({ ...customer, customer_address: e.target.value })}
//                       style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
//                   </Field>
//                   <Field label="SHIPPING ADDRESS">
//                     <input placeholder="Same as billing" value={customer.customer_address}
//                       onChange={e => setCustomer({ ...customer, customer_address: e.target.value })}
//                       style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
//                   </Field>
//                 </div>

//                 <Field label="EMAIL">
//                   <input type="email" placeholder="email@company.com" value={customer.customer_email}
//                     onChange={e => setCustomer({ ...customer, customer_email: e.target.value })}
//                     style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
//                 </Field>
//               </div>
//             </div>

//             {/* PRODUCTS CARD */}
//             <div className="fade-up fade-up-2" style={{
//               background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)",
//               padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)",
//             }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
//                 <h2 style={{
//                   fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700,
//                   color: "var(--text-primary)",
//                   display: "flex", alignItems: "center", gap: "8px",
//                 }}>
//                   <span style={{
//                     width: "28px", height: "28px", borderRadius: "8px",
//                     background: "rgba(124,58,237,0.12)",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                   }}>
//                     <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2}>
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                     </svg>
//                   </span>
//                   Products
//                 </h2>
//                 <button
//                   onClick={addRow}
//                   style={{
//                     display: "flex", alignItems: "center", gap: "6px",
//                     padding: "8px 16px", borderRadius: "10px", 
//                     background: "rgba(124,58,237,0.12)",
//                     color: "var(--accent)",
//                     fontSize: "13px", fontWeight: 700,
//                     fontFamily: "var(--font-body)",
//                     cursor: "pointer", transition: "all 0.2s",
//                     border: "1px solid rgba(124,58,237,0.2)" as any,
//                   }}
//                   onMouseEnter={e => {
//                     (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.2)";
//                     (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
//                   }}
//                   onMouseLeave={e => {
//                     (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.12)";
//                     (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
//                   }}
//                 >
//                   <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//                   </svg>
//                   Add Item
//                 </button>
//               </div>

//               {/* Table */}
//               <div style={{ overflowX: "auto" }}>
//                 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
//                   <thead>
//                     <tr style={{ borderBottom: "1px solid var(--border)" }}>
//                       {["Product", "Description", "Qty", "Unit Price", "Discount", "Type", "Line Total", ""].map((h, i) => (
//                         <th key={i} style={{
//                           padding: "8px 10px", textAlign: i >= 2 ? "center" : "left",
//                           fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)",
//                           letterSpacing: "0.06em", whiteSpace: "nowrap",
//                         }}>{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {items.length === 0 && (
//                       <tr>
//                         <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "13.5px" }}>
//                           No items yet. Click "Add Item" to begin.
//                         </td>
//                       </tr>
//                     )}
//                     {items.map((item, i) => {
//                       const lineTotal = item.qty * item.unit_price * (1 - item.discount / 100);
//                       return (
//                         <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
//                           <td style={{ padding: "8px 6px" }}>
//                             <input value={item.product_name}
//                               onChange={e => updateItem(i, "product_name", e.target.value)}
//                               placeholder="Product name"
//                               style={{ ...inputStyle, width: "140px", padding: "8px 10px", fontSize: "13px" }}
//                               onFocus={focusStyle} onBlur={blurStyle} />
//                           </td>
//                           <td style={{ padding: "8px 6px" }}>
//                             <input value={item.description}
//                               onChange={e => updateItem(i, "description", e.target.value)}
//                               placeholder="Description"
//                               style={{ ...inputStyle, width: "160px", padding: "8px 10px", fontSize: "13px" }}
//                               onFocus={focusStyle} onBlur={blurStyle} />
//                           </td>
//                           <td style={{ padding: "8px 6px" }}>
//                             <input type="number" value={item.qty}
//                               onChange={e => updateItem(i, "qty", Number(e.target.value))}
//                               style={{ ...inputStyle, width: "62px", padding: "8px 10px", fontSize: "13px", textAlign: "center" }}
//                               onFocus={focusStyle} onBlur={blurStyle} />
//                           </td>
//                           <td style={{ padding: "8px 6px" }}>
//                             <input type="number" value={item.unit_price}
//                               onChange={e => updateItem(i, "unit_price", Number(e.target.value))}
//                               style={{ ...inputStyle, width: "100px", padding: "8px 10px", fontSize: "13px", textAlign: "right" }}
//                               onFocus={focusStyle} onBlur={blurStyle} />
//                           </td>
//                           <td style={{ padding: "8px 6px" }}>
//                             <input type="number" value={item.discount}
//                               onChange={e => updateItem(i, "discount", Number(e.target.value))}
//                               style={{ ...inputStyle, width: "70px", padding: "8px 10px", fontSize: "13px", textAlign: "center" }}
//                               onFocus={focusStyle} onBlur={blurStyle} />
//                           </td>
//                           <td style={{ padding: "8px 6px" }}>
//                             <select style={{ ...inputStyle, width: "70px", padding: "8px 8px", fontSize: "12px" }}>
//                               <option>%</option>
//                               <option>$</option>
//                             </select>
//                           </td>
//                           <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-primary)", whiteSpace: "nowrap" }}>
//                             {money(lineTotal)}
//                           </td>
//                           <td style={{ padding: "8px 6px" }}>
//                             <button onClick={() => deleteRow(i)} style={{
//                               background: "none", border: "none", cursor: "pointer",
//                               color: "var(--text-muted)", padding: "6px", borderRadius: "6px",
//                               display: "flex", alignItems: "center", transition: "all 0.15s",
//                             }}
//                               onMouseEnter={e => {
//                                 (e.currentTarget as HTMLElement).style.color = "#f87171";
//                                 (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)";
//                               }}
//                               onMouseLeave={e => {
//                                 (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
//                                 (e.currentTarget as HTMLElement).style.background = "none";
//                               }}
//                             >
//                               <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                               </svg>
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* ---- RIGHT SUMMARY ---- */}
//           <div className="fade-up fade-up-3" style={{
//             position: "sticky", top: "76px",
//             background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)",
//             padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)",
//           }}>
//             <h2 style={{
//               fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700,
//               color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: "20px",
//             }}>SUMMARY</h2>

//             <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
//               {[
//                 { label: "Subtotal", value: subtotal, color: "var(--text-secondary)" },
//                 { label: "Discount", value: 0, color: "#f87171", prefix: "-" },
//                 { label: "VAT (7%)", value: vat, color: "var(--text-secondary)" },
//               ].map(row => (
//                 <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <span style={{ fontSize: "13.5px", color: "var(--text-secondary)", fontWeight: 500 }}>{row.label}</span>
//                   <span style={{ fontSize: "13.5px", color: row.color, fontWeight: 600, fontFamily: "var(--font-mono)" }}>
//                     {row.prefix}{money(row.value)}
//                   </span>
//                 </div>
//               ))}

//               {/* VAT toggle */}
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>VAT (7%)</span>
//                 <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
//                   <div style={{
//                     width: "38px", height: "22px", borderRadius: "11px",
//                     background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
//                     position: "relative",
//                   }}>
//                     <div style={{
//                       position: "absolute", right: "3px", top: "3px",
//                       width: "16px", height: "16px", borderRadius: "50%", background: "white",
//                     }} />
//                   </div>
//                   <span style={{ fontSize: "13.5px", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{money(vat)}</span>
//                 </label>
//               </div>
//             </div>

//             <div style={{
//               borderTop: "1px solid var(--border)", paddingTop: "16px",
//               display: "flex", justifyContent: "space-between", alignItems: "center",
//               marginBottom: "24px",
//             }}>
//               <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
//                 GRAND TOTAL
//               </span>
//               <span style={{
//                 fontSize: "22px", fontWeight: 900,
//                 fontFamily: "var(--font-mono)",
//                 letterSpacing: "-0.03em",
//                 background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//               }}>
//                 {money(total)}
//               </span>
//             </div>

//             <button
//               onClick={submit}
//               disabled={submitting}
//               style={{
//                 width: "100%", padding: "13px",
//                 borderRadius: "12px", border: "none",
//                 background: submitting ? "var(--border)" : "linear-gradient(135deg, #7c3aed, #db2777)",
//                 color: "white",
//                 fontSize: "14px", fontWeight: 800,
//                 fontFamily: "var(--font-display)", letterSpacing: "-0.01em",
//                 cursor: submitting ? "not-allowed" : "pointer",
//                 boxShadow: submitting ? "none" : "0 4px 20px rgba(124,58,237,0.4), 0 1px 0 rgba(255,255,255,0.15) inset",
//                 transition: "all 0.2s ease",
//               }}
//               onMouseEnter={e => {
//                 if (!submitting) {
//                   (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
//                   (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(124,58,237,0.5), 0 1px 0 rgba(255,255,255,0.15) inset";
//                 }
//               }}
//               onMouseLeave={e => {
//                 (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
//                 (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(124,58,237,0.4), 0 1px 0 rgba(255,255,255,0.15) inset";
//               }}
//             >
//               {submitting ? "Saving..." : "✦ Save Quotation"}
//             </button>
//           </div>

//         </div>
//       </div>
//     </SidebarLayout>
//   );
// }
// page2-create-updated.tsx  →  app/create/page.tsx
// VAT toggle ทำงานได้จริง: ปิด = ไม่คิด VAT, เปิด = คิด 7%

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CustomerDB = { customer_id:number; customer_name:string; customer_company:string; customer_phone:string; customer_address:string; customer_email:string; };
type Item = { product_name:string; description:string; qty:number; unit_price:number; discount:number; discount_type:"%"|"$"; item_type:string; };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
[data-theme="dark"]{--bg-base:#0d0d14;--bg-surface:#13131e;--bg-elevated:#1a1a28;--bg-overlay:#20202f;--bg-muted:rgba(255,255,255,.04);--bg-muted-hover:rgba(255,255,255,.07);--text-primary:#eeeeff;--text-secondary:#9090b0;--text-tertiary:#555570;--text-placeholder:#444460;--border-subtle:rgba(255,255,255,.06);--border-default:rgba(255,255,255,.10);--border-strong:rgba(255,255,255,.16);--accent:#9d7cf8;--accent-soft:rgba(157,124,248,.14);--green:#2ecc9a;--green-soft:rgba(46,204,154,.12);--red:#f06a6a;--red-soft:rgba(240,106,106,.12);--slate:#8888a8;--sidebar-bg:#0f0f18;--sidebar-w:220px;--shadow-btn:0 4px 20px rgba(157,124,248,.35);}
[data-theme="light"]{--bg-base:#f4f2ff;--bg-surface:#ffffff;--bg-elevated:#faf8ff;--bg-overlay:#f0eeff;--bg-muted:rgba(109,40,217,.04);--bg-muted-hover:rgba(109,40,217,.07);--text-primary:#1c1840;--text-secondary:#4e4878;--text-tertiary:#9088bb;--text-placeholder:#b0a8d8;--border-subtle:rgba(109,40,217,.08);--border-default:rgba(109,40,217,.13);--border-strong:rgba(109,40,217,.22);--accent:#7c3aed;--accent-soft:rgba(124,58,237,.10);--green:#0a9e74;--green-soft:rgba(10,158,116,.10);--red:#dc2626;--red-soft:rgba(220,38,38,.10);--slate:#6b6b8a;--sidebar-bg:#faf9ff;--sidebar-w:220px;--shadow-btn:0 4px 20px rgba(124,58,237,.25);}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:14px}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:var(--bg-base);color:var(--text-primary);-webkit-font-smoothing:antialiased}
input,select,textarea,button{font-family:inherit}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border-strong);border-radius:4px}
.cr-layout{display:flex;min-height:100vh}
.cr-sidebar{width:var(--sidebar-w);min-height:100vh;background:var(--sidebar-bg);border-right:1px solid var(--border-subtle);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:50}
.cr-logo{display:flex;align-items:center;gap:10px;padding:18px 20px 16px;border-bottom:1px solid var(--border-subtle)}
.cr-logo-icon{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#a855f7,#ec4899);display:flex;align-items:center;justify-content:center}
.cr-logo-icon svg{width:15px;height:15px;stroke:white;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.cr-logo-text{font-size:15px;font-weight:700;color:var(--text-primary);letter-spacing:-0.02em}
.cr-sidebar-section{padding:14px 12px 4px}
.cr-sidebar-label{font-size:10px;font-weight:600;color:var(--text-tertiary);letter-spacing:.08em;text-transform:uppercase;padding:0 8px;margin-bottom:4px}
.cr-nav-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;font-size:13.5px;font-weight:500;color:var(--text-secondary);cursor:pointer;transition:background .15s,color .15s;margin-bottom:2px}
.cr-nav-item:hover{background:var(--bg-muted-hover);color:var(--text-primary)}
.cr-nav-item.active{background:var(--accent-soft);color:var(--accent)}
.cr-nav-item svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.cr-sidebar-footer{margin-top:auto;padding:14px 16px;border-top:1px solid var(--border-subtle);font-size:11.5px;color:var(--text-tertiary)}
.cr-sidebar-footer strong{color:var(--accent)}
.cr-content{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column}
.cr-topbar{height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:var(--bg-surface);border-bottom:1px solid var(--border-subtle);position:sticky;top:0;z-index:40}
.cr-topbar-left{display:flex;align-items:center;gap:8px;font-size:13.5px;color:var(--text-tertiary)}
.cr-topbar-right{display:flex;align-items:center;gap:10px}
.cr-live{display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;background:rgba(46,204,154,.10);border:1px solid rgba(46,204,154,.2);font-size:11px;font-weight:700;color:var(--green);letter-spacing:.06em}
.cr-live-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:livepulse 2s infinite}
@keyframes livepulse{0%,100%{opacity:1}50%{opacity:.4}}
.cr-icon-btn{width:34px;height:34px;border-radius:8px;border:1px solid var(--border-default);background:var(--bg-muted);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-secondary);transition:background .15s,color .15s}
.cr-icon-btn:hover{background:var(--bg-muted-hover);color:var(--text-primary)}
.cr-icon-btn svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.cr-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#ec4899);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:white;cursor:pointer}
.cr-page{flex:1;padding:24px}
.cr-doc-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px}
.cr-doc-left{display:flex;align-items:center;gap:14px}
.cr-back-btn{background:none;border:none;color:var(--text-secondary);cursor:pointer;padding:4px;display:flex;align-items:center;transition:color .15s}
.cr-back-btn:hover{color:var(--text-primary)}
.cr-back-btn svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.cr-doc-no{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:700;color:var(--text-primary);letter-spacing:-0.01em}
.cr-doc-sub{font-size:12px;color:var(--text-tertiary);margin-top:2px}
.cr-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.cr-badge-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.badge-draft{background:rgba(136,136,168,.12);color:#8888a8}.badge-draft .cr-badge-dot{background:#8888a8}
.cr-actions{display:flex;gap:10px;flex-wrap:wrap}
.cr-btn{display:inline-flex;align-items:center;gap:7px;padding:8px 16px;border-radius:9px;border:none;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:transform .15s,opacity .15s,box-shadow .15s;white-space:nowrap}
.cr-btn:hover{transform:translateY(-1px);opacity:.92}
.cr-btn:active{transform:scale(.97);opacity:1}
.cr-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.cr-btn svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.btn-primary{position:relative;overflow:hidden;color:white;background:linear-gradient(115deg,#a855f7 0%,#ec4899 55%,#60a5fa 100%);background-size:200% 200%;animation:gradShift 5s ease infinite;box-shadow:var(--shadow-btn)}
@keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(120deg,rgba(255,255,255,.18) 0%,transparent 55%);pointer-events:none}
.btn-primary:hover{box-shadow:0 6px 28px rgba(168,85,247,.5);opacity:1;transform:translateY(-1px)}
.btn-ghost{background:none;border:1px solid var(--border-default);color:var(--text-secondary)}
.btn-ghost:hover{background:var(--bg-muted);color:var(--text-primary);opacity:1}
.cr-card{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;padding:20px 22px;box-shadow:0 1px 3px rgba(0,0,0,.08);margin-bottom:14px}
.cr-section-title{font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;gap:8px}
.cr-section-title svg{width:15px;height:15px;stroke:var(--accent);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.cr-label{font-size:11.5px;font-weight:600;color:var(--text-tertiary);letter-spacing:.03em;display:block;margin-bottom:5px}
.cr-input,.cr-select{width:100%;padding:8px 11px;background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:8px;color:var(--text-primary);font-size:13.5px;outline:none;transition:border .18s,box-shadow .18s}
.cr-input::placeholder{color:var(--text-placeholder)}
.cr-input:focus,.cr-select:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
.cr-input[readonly]{opacity:.6;cursor:default;background:var(--bg-overlay)}
.cr-select{appearance:none;cursor:pointer}
.cr-sel-wrap{position:relative}
.cr-sel-wrap svg{position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--text-tertiary);width:13px;height:13px}
.cr-row4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:14px}
.cr-row2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.cr-row1{margin-bottom:14px}
.cr-prod-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--border-subtle)}
.cr-table-wrap{overflow-x:auto}
.cr-table{width:100%;border-collapse:collapse;font-size:13px}
.cr-table thead tr{border-bottom:1px solid var(--border-default)}
.cr-table th{padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--text-tertiary);letter-spacing:.07em;text-transform:uppercase;white-space:nowrap}
.cr-table th.r{text-align:right}
.cr-table tbody tr{border-bottom:1px solid var(--border-subtle)}
.cr-table tbody tr:last-child{border-bottom:none}
.cr-table td{padding:7px 10px;vertical-align:middle}
.cr-row-input{width:100%;padding:6px 9px;background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:7px;color:var(--text-primary);font-size:13px;outline:none;transition:border .15s}
.cr-row-input:focus{border-color:var(--accent)}
.cr-line-total{text-align:right;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500;color:var(--text-primary)}
.cr-del-row{background:none;border:none;color:var(--text-tertiary);cursor:pointer;padding:5px;border-radius:6px;display:flex;align-items:center;transition:color .15s,background .15s}
.cr-del-row:hover{color:var(--red);background:var(--red-soft)}
.cr-del-row svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.cr-add-btn{display:flex;align-items:center;gap:6px;padding:6px 14px;border:1px dashed rgba(157,124,248,.35);border-radius:8px;background:var(--accent-soft);color:var(--accent);font-size:12.5px;font-weight:500;cursor:pointer;font-family:inherit;transition:background .15s,border-color .15s}
.cr-add-btn:hover{background:rgba(157,124,248,.2);border-color:rgba(157,124,248,.55)}
.cr-add-btn svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
/* VAT TOGGLE */
.cr-toggle-row{display:flex;align-items:center;gap:10px}
.cr-toggle{width:38px;height:21px;border-radius:11px;background:var(--border-strong);cursor:pointer;position:relative;transition:background .2s;border:none;flex-shrink:0}
.cr-toggle.on{background:var(--accent)}
.cr-toggle-knob{position:absolute;top:2.5px;left:2.5px;width:16px;height:16px;border-radius:50%;background:white;transition:transform .2s cubic-bezier(.34,1.56,.64,1);box-shadow:0 1px 3px rgba(0,0,0,.2)}
.cr-toggle.on .cr-toggle-knob{transform:translateX(17px)}
.cr-vat-label{font-size:13.5px;color:var(--text-secondary)}
.cr-vat-label.active{color:var(--text-primary);font-weight:500}
/* SUMMARY */
.cr-sum-outer{display:flex;justify-content:flex-end}
.cr-sum-box{width:300px}
.cr-sum-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;font-size:13.5px;color:var(--text-secondary);border-bottom:1px solid var(--border-subtle)}
.cr-sum-row:last-of-type{border-bottom:none}
.cr-sum-val{font-family:'JetBrains Mono',monospace;font-size:13px}
.cr-sum-disc{color:var(--red)}
.cr-sum-total{display:flex;justify-content:space-between;align-items:center;padding:12px 0 0;border-top:1px solid var(--border-strong);margin-top:4px}
.cr-sum-total-label{font-size:13px;font-weight:700;color:var(--text-primary);letter-spacing:.06em;text-transform:uppercase}
.cr-sum-total-val{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:700;color:var(--accent)}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.a0{animation:fadeUp .32s ease both}.a1{animation:fadeUp .32s .05s ease both}.a2{animation:fadeUp .32s .10s ease both}
.a3{animation:fadeUp .32s .15s ease both}.a4{animation:fadeUp .32s .20s ease both}.a5{animation:fadeUp .32s .25s ease both}
`;

export default function CreatePage() {
  const router = useRouter();
  const API    = process.env.NEXT_PUBLIC_API_URL || "";
  const [isDark, setIsDark]   = useState(true);
  const [customers, setCusts] = useState<CustomerDB[]>([]);
  const [selId, setSelId]     = useState<number|null>(null);
  const [cust, setCust]       = useState({ customer_name:"", customer_company:"", customer_phone:"", customer_address:"", customer_email:"", customer_tax_id:"", customer_shipping_address:"" });
  const [items, setItems]     = useState<Item[]>([]);
  const [date, setDate]       = useState("");
  const [expiry, setExpiry]   = useState("");
  const [vatOn, setVatOn]     = useState(true);   // ← VAT toggle state
  const [notes, setNotes]     = useState("");
  const [saving, setSaving]   = useState(false);

  const [docNo] = useState(() => {
    const now = new Date();
    return `QT-${now.getFullYear()}-${String(Math.floor(Math.random()*900)+100)}`;
  });

  useEffect(() => {
    const saved = localStorage.getItem("qf-theme");
    if (saved) setIsDark(saved==="dark");
    fetch(`${API}/customers`).then(r=>r.json()).then(setCusts).catch(()=>{});
    const today=new Date(), next=new Date(); next.setDate(today.getDate()+30);
    const f=(d:Date)=>d.toISOString().split("T")[0];
    setDate(f(today)); setExpiry(f(next));
  },[]);

  const toggleTheme=()=>{ setIsDark(v=>{localStorage.setItem("qf-theme",!v?"dark":"light");return !v;}); };
  const selectCust=(id:number)=>{ setSelId(id); const c=customers.find(x=>x.customer_id===id); if(c) setCust({customer_name:c.customer_name,customer_company:c.customer_company,customer_phone:c.customer_phone,customer_address:c.customer_address,customer_email:c.customer_email,customer_tax_id:"",customer_shipping_address:c.customer_address}); };
  const addItem=()=>setItems(p=>[...p,{product_name:"",description:"",qty:1,unit_price:0,discount:0,discount_type:"%",item_type:""}]);
  const delItem=(i:number)=>setItems(p=>p.filter((_,idx)=>idx!==i));
  const updItem=<K extends keyof Item>(i:number,k:K,v:Item[K])=>{ setItems(p=>{const n=[...p];n[i]={...n[i],[k]:v};return n;}); };

  const calcLine=(it:Item)=>{ const g=it.qty*it.unit_price; return it.discount_type==="%"?g*(1-it.discount/100):g-it.discount; };
  const calcDisc=(it:Item)=>{ const g=it.qty*it.unit_price; return it.discount_type==="%"?g*(it.discount/100):it.discount; };
  const subtotal   = items.reduce((s,i)=>s+calcLine(i),0);
  const totalDisc  = items.reduce((s,i)=>s+calcDisc(i),0);
  const vat        = vatOn ? subtotal*0.07 : 0;   // ← ถ้า vatOn=false → vat=0
  const grandTotal = subtotal+vat;
  const fmt        = (n:number)=>n.toLocaleString("en-US",{style:"currency",currency:"USD"});

  const submit=async(saveAs:"draft"|"submit")=>{
    if(!cust.customer_name.trim()) return alert("Please enter customer name");
    const valid=items.filter(i=>i.product_name.trim());
    if(!valid.length) return alert("Please add at least 1 product");
    try{
      setSaving(true);
      const res=await fetch(`${API}/quotations`,{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({customer_id:selId,customer:cust,issue_date:date,expiry_date:expiry,items:valid,status:saveAs==="draft"?"draft":"sent",notes,vat_enabled:vatOn})});
      if(!res.ok) throw new Error();
      router.push("/");
    }catch{alert("Save failed ❌");}finally{setSaving(false);}
  };

  const ICONS={
    back:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
    save:<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    send:<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    plus:<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x:<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    chevD:<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
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
        <div className="cr-layout">
          {/* SIDEBAR */}
          <aside className="cr-sidebar">
            <div className="cr-logo">
              <div className="cr-logo-icon"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
              <span className="cr-logo-text">SalesPro</span>
            </div>
            <div className="cr-sidebar-section">
              <div className="cr-sidebar-label">WORKSPACE</div>
              <div className="cr-nav-item" onClick={()=>router.push("/dashboard")}>{ICONS.grid} Dashboard</div>
              <div className="cr-nav-item active" onClick={()=>router.push("/")}>{ICONS.docNav} Quotations</div>
              <div className="cr-nav-item" onClick={()=>router.push("/orders")}>{ICONS.cart} Sales Orders</div>
            </div>
            <div className="cr-sidebar-footer"><strong>Pro Tip 💡</strong><br/>Convert quotes to orders in one click.</div>
          </aside>

          {/* CONTENT */}
          <div className="cr-content">
            <header className="cr-topbar">
              <div className="cr-topbar-left">
                <span>Quotations</span><span style={{color:"var(--text-tertiary)"}}>/</span>
                <span>New</span><span style={{color:"var(--text-tertiary)"}}>/</span>
                <span style={{color:"var(--text-primary)",fontWeight:600}}>Edit</span>
              </div>
              <div className="cr-topbar-right">
                <div className="cr-live"><span className="cr-live-dot"/>LIVE</div>
                <button className="cr-icon-btn" onClick={toggleTheme}>{isDark?ICONS.sun:ICONS.moon}</button>
                <div className="cr-avatar">S</div>
              </div>
            </header>

            <div className="cr-page">
              {/* DOC HEADER */}
              <div className="cr-doc-header a0">
                <div className="cr-doc-left">
                  <button className="cr-back-btn" onClick={()=>router.push("/")}>{ICONS.back}</button>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                      <span className="cr-doc-no">{docNo}</span>
                      <span className="cr-badge badge-draft"><span className="cr-badge-dot"/>DRAFT</span>
                    </div>
                    <div style={{fontSize:"12px",color:"var(--text-tertiary)",marginTop:"2px"}}>New Quotation</div>
                  </div>
                </div>
                <div className="cr-actions">
                  <button className="cr-btn btn-ghost" onClick={()=>submit("draft")} disabled={saving}>{ICONS.save} Save Draft</button>
                  <button className="cr-btn btn-primary" onClick={()=>submit("submit")} disabled={saving}>{ICONS.send} {saving?"Saving...":"Submit"}</button>
                </div>
              </div>

              {/* DOCUMENT DETAILS */}
              <div className="cr-card a1">
                <div className="cr-section-title">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Document Details
                </div>
                <div className="cr-row4">
                  <div><label className="cr-label">Document Number</label><input className="cr-input" value={docNo} readOnly/></div>
                  <div><label className="cr-label">Date</label><input type="date" className="cr-input" value={date} onChange={e=>setDate(e.target.value)}/></div>
                  <div><label className="cr-label">Expiry Date</label><input type="date" className="cr-input" value={expiry} onChange={e=>setExpiry(e.target.value)}/></div>
                  <div><label className="cr-label">Status</label>
                    <div className="cr-sel-wrap">
                      <select className="cr-input cr-select" defaultValue="draft"><option value="draft">Draft</option></select>
                      {ICONS.chevD}
                    </div>
                  </div>
                </div>
              </div>

              {/* CUSTOMER */}
              <div className="cr-card a2">
                <div className="cr-section-title">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Customer Information
                </div>
                <div className="cr-row2">
                  <div><label className="cr-label">Customer</label>
                    <div className="cr-sel-wrap">
                      <select className="cr-input cr-select" value={selId??""} onChange={e=>selectCust(Number(e.target.value))}>
                        <option value="">Select customer...</option>
                        {customers.map(c=><option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>)}
                      </select>{ICONS.chevD}
                    </div>
                  </div>
                  <div><label className="cr-label">Company</label><input className="cr-input" value={cust.customer_company} onChange={e=>setCust({...cust,customer_company:e.target.value})}/></div>
                </div>
                <div className="cr-row2">
                  <div><label className="cr-label">Tax ID</label><input className="cr-input" value={cust.customer_tax_id} onChange={e=>setCust({...cust,customer_tax_id:e.target.value})}/></div>
                  <div><label className="cr-label">Phone</label><input className="cr-input" value={cust.customer_phone} onChange={e=>setCust({...cust,customer_phone:e.target.value})}/></div>
                </div>
                <div className="cr-row1"><label className="cr-label">Email</label><input type="email" className="cr-input" value={cust.customer_email} onChange={e=>setCust({...cust,customer_email:e.target.value})}/></div>
                <div className="cr-row2">
                  <div><label className="cr-label">Billing Address</label><input className="cr-input" value={cust.customer_address} onChange={e=>setCust({...cust,customer_address:e.target.value})}/></div>
                  <div><label className="cr-label">Shipping Address</label><input className="cr-input" value={cust.customer_shipping_address} onChange={e=>setCust({...cust,customer_shipping_address:e.target.value})}/></div>
                </div>
              </div>

              {/* PRODUCTS */}
              <div className="cr-card a3">
                <div className="cr-prod-header">
                  <span className="cr-section-title" style={{margin:0,padding:0,border:"none"}}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    Products
                  </span>
                  <button className="cr-add-btn" onClick={addItem}>{ICONS.plus} Add Item</button>
                </div>
                {items.length===0?(
                  <div style={{padding:"32px",textAlign:"center",color:"var(--text-tertiary)",fontSize:"13.5px"}}>No items yet. Click "Add Item" to begin.</div>
                ):(
                  <div className="cr-table-wrap">
                    <table className="cr-table">
                      <thead><tr>
                        <th style={{width:"20%"}}>Product</th><th style={{width:"22%"}}>Description</th>
                        <th style={{width:"7%"}}>Qty</th><th style={{width:"12%"}}>Unit Price</th>
                        <th style={{width:"10%"}}>Discount</th><th style={{width:"10%"}}>Type</th>
                        <th className="r" style={{width:"11%"}}>Line Total</th><th style={{width:"3%"}}></th>
                      </tr></thead>
                      <tbody>
                        {items.map((item,i)=>(
                          <tr key={i}>
                            <td><input className="cr-row-input" value={item.product_name} onChange={e=>updItem(i,"product_name",e.target.value)} placeholder="Product name"/></td>
                            <td><input className="cr-row-input" value={item.description} onChange={e=>updItem(i,"description",e.target.value)}/></td>
                            <td><input type="number" min="0" className="cr-row-input" value={item.qty} onChange={e=>updItem(i,"qty",Number(e.target.value))}/></td>
                            <td><input type="number" min="0" className="cr-row-input" value={item.unit_price} onChange={e=>updItem(i,"unit_price",Number(e.target.value))}/></td>
                            <td><input type="number" min="0" className="cr-row-input" value={item.discount} onChange={e=>updItem(i,"discount",Number(e.target.value))}/></td>
                            <td>
                              <div className="cr-sel-wrap">
                                <select className="cr-row-input cr-select" style={{paddingRight:"22px"}} value={item.discount_type} onChange={e=>updItem(i,"discount_type",e.target.value as "%"|"$")}>
                                  <option value="%">%</option><option value="$">$</option>
                                </select>
                                <svg viewBox="0 0 24 24" width="11" height="11" style={{position:"absolute",right:"6px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text-tertiary)"}} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                              </div>
                            </td>
                            <td className="cr-line-total">{fmt(calcLine(item))}</td>
                            <td><button className="cr-del-row" onClick={()=>delItem(i)}>{ICONS.x}</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* SUMMARY — VAT toggle ทำงานจริง */}
              <div className="cr-card a4">
                <div className="cr-section-title">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Summary
                </div>
                <div className="cr-sum-outer">
                  <div className="cr-sum-box">
                    <div className="cr-sum-row"><span>Subtotal</span><span className="cr-sum-val">{fmt(subtotal+totalDisc)}</span></div>
                    <div className="cr-sum-row"><span>Discount</span><span className="cr-sum-val cr-sum-disc">-{fmt(totalDisc)}</span></div>

                    {/* ── VAT ROW with working toggle ── */}
                    <div className="cr-sum-row">
                      <div className="cr-toggle-row">
                        <span className={`cr-vat-label ${vatOn?"active":""}`}>VAT (7%)</span>
                        <button
                          className={`cr-toggle ${vatOn?"on":""}`}
                          onClick={()=>setVatOn(v=>!v)}
                          title={vatOn?"Click to disable VAT":"Click to enable VAT"}
                        >
                          <div className="cr-toggle-knob"/>
                        </button>
                        <span style={{fontSize:"11px",color:vatOn?"var(--accent)":"var(--text-tertiary)",fontWeight:600}}>
                          {vatOn?"ON":"OFF"}
                        </span>
                      </div>
                      <span className="cr-sum-val" style={{color:vatOn?"var(--text-primary)":"var(--text-tertiary)"}}>
                        {vatOn ? fmt(vat) : "$0.00"}
                      </span>
                    </div>

                    <div className="cr-sum-total">
                      <span className="cr-sum-total-label">Grand Total</span>
                      <span className="cr-sum-total-val">{fmt(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* NOTES */}
              <div className="cr-card a5">
                <div className="cr-section-title">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  Notes
                </div>
                <textarea className="cr-input" rows={4} placeholder="Additional remarks..." value={notes} onChange={e=>setNotes(e.target.value)} style={{resize:"vertical",lineHeight:"1.6"}}/>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}