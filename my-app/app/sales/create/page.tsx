// "use client";
// /* ================================================================
//    app/create/page.tsx  (UPDATED)
//    - Product rows now have a dropdown that fetches /products
//      → auto-fills description + unit_price on select
//    - Customer dropdown fetches /customers (unchanged)
//    - VAT toggle functional
//    - Language aware
//    ================================================================ */
// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { SidebarLayout, useLang } from "@/components/SidebarLayout";

// type CustomerDB = {
//   customer_id: number;
//   customer_name: string;
//   customer_company: string;
//   customer_phone: string;
//   customer_address: string;
//   customer_email: string;
//   tax_id?: string;
// };
// type ProductDB = {
//   product_id: number;
//   product_name: string;
//   sku?: string;
//   description: string;
//   unit_price: number;
//   category?: string;
// };
// type Item = {
//   product_name: string;
//   description: string;
//   qty: number;
//   unit_price: number;
//   discount: number;
//   discount_type: string;
// };

// const inputStyle: React.CSSProperties = {
//   width: "100%", padding: "10px 14px", border: "1px solid var(--border)",
//   borderRadius: "10px", fontSize: "13.5px", background: "var(--input-bg)",
//   color: "var(--text-primary)", outline: "none", fontFamily: "var(--font-body)",
//   transition: "border-color 0.2s, box-shadow 0.2s",
// };
// const focusFn = (e: React.FocusEvent<any>) => { e.target.style.borderColor = "var(--border-hover)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; };
// const blurFn  = (e: React.FocusEvent<any>) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; };

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

// /* ---- Customer Dropdown ---- */
// function CustomerDropdown({ customers, selected, onSelect, placeholder }: {
//   customers: CustomerDB[]; selected: number | null; onSelect: (id: number) => void; placeholder: string;
// }) {
//   const [open, setOpen] = useState(false);
//   const [q, setQ] = useState("");
//   const ref = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const filtered = customers.filter(c =>
//     c.customer_name.toLowerCase().includes(q.toLowerCase()) ||
//     (c.customer_company || "").toLowerCase().includes(q.toLowerCase())
//   );
//   const sel = customers.find(c => c.customer_id === selected);

//   useEffect(() => {
//     const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, []);
//   useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

//   return (
//     <div ref={ref} style={{ position: "relative" }}>
//       <button type="button" onClick={() => setOpen(!open)}
//         style={{ ...inputStyle, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}
//         onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"}
//         onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
//       >
//         <span style={{ color: sel ? "var(--text-primary)" : "var(--text-muted)", fontSize: "13.5px" }}>
//           {sel ? `${sel.customer_name}${sel.customer_company ? ` — ${sel.customer_company}` : ""}` : placeholder}
//         </span>
//         <svg style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
//       </button>
//       <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200, background: "var(--bg-sidebar)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", overflow: "hidden", opacity: open ? 1 : 0, transform: open ? "translateY(0) scaleY(1)" : "translateY(-6px) scaleY(0.96)", transformOrigin: "top", transition: "opacity 0.18s ease, transform 0.18s ease", pointerEvents: open ? "auto" : "none", backdropFilter: "blur(20px)" }}>
//         <div style={{ padding: "10px", borderBottom: "1px solid var(--border)" }}>
//           <div style={{ position: "relative" }}>
//             <svg style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
//             <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." style={{ width: "100%", padding: "7px 10px 7px 30px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", background: "var(--input-bg)", color: "var(--text-primary)", outline: "none", fontFamily: "var(--font-body)" }} />
//           </div>
//         </div>
//         <div style={{ maxHeight: "220px", overflowY: "auto" }}>
//           {filtered.length === 0 && <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>No customers</div>}
//           {filtered.map(c => (
//             <button key={c.customer_id} type="button" onClick={() => { onSelect(c.customer_id); setOpen(false); setQ(""); }}
//               style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 14px", border: "none", background: selected === c.customer_id ? "rgba(124,58,237,0.1)" : "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.15s", fontFamily: "var(--font-body)" }}
//               onMouseEnter={e => { if (selected !== c.customer_id) (e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)"; }}
//               onMouseLeave={e => { if (selected !== c.customer_id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
//             >
//               <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: selected === c.customer_id ? "linear-gradient(135deg,#7c3aed,#db2777)" : "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                 <span style={{ fontSize: "11px", fontWeight: 700, color: selected === c.customer_id ? "white" : "var(--accent)" }}>{(c.customer_name[0] || "?").toUpperCase()}</span>
//               </div>
//               <div>
//                 <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>{c.customer_name}</div>
//                 {c.customer_company && <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{c.customer_company}</div>}
//               </div>
//               {selected === c.customer_id && <svg style={{ marginLeft: "auto", color: "var(--accent)" }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---- Product Dropdown (per row) ---- */
// function ProductDropdown({ products, value, onSelect, placeholder }: {
//   products: ProductDB[]; value: string; onSelect: (p: ProductDB) => void; placeholder: string;
// }) {
//   const [open, setOpen] = useState(false);
//   const [q, setQ] = useState("");
//   const ref = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const filtered = products.filter(p =>
//     p.product_name.toLowerCase().includes(q.toLowerCase()) ||
//     (p.sku || "").toLowerCase().includes(q.toLowerCase())
//   );

//   useEffect(() => {
//     const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, []);
//   useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

//   return (
//     <div ref={ref} style={{ position: "relative" }}>
//       <button type="button" onClick={() => setOpen(!open)}
//         style={{ ...inputStyle, width: "150px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "8px 10px", fontSize: "13px" }}
//         onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"}
//         onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
//       >
//         <span style={{ color: value ? "var(--text-primary)" : "var(--text-muted)", fontSize: "12.5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "110px" }}>
//           {value || placeholder}
//         </span>
//         <svg style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }} width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
//       </button>
//       <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 300, width: "260px", background: "var(--bg-sidebar)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.35)", overflow: "hidden", opacity: open ? 1 : 0, transform: open ? "translateY(0) scaleY(1)" : "translateY(-6px) scaleY(0.96)", transformOrigin: "top", transition: "opacity 0.18s ease, transform 0.18s ease", pointerEvents: open ? "auto" : "none", backdropFilter: "blur(20px)" }}>
//         <div style={{ padding: "8px", borderBottom: "1px solid var(--border)" }}>
//           <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search products..." style={{ width: "100%", padding: "7px 10px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12.5px", background: "var(--input-bg)", color: "var(--text-primary)", outline: "none", fontFamily: "var(--font-body)" }} />
//         </div>
//         <div style={{ maxHeight: "200px", overflowY: "auto" }}>
//           {filtered.length === 0 && <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px" }}>No products</div>}
//           {filtered.map(p => (
//             <button key={p.product_id} type="button" onClick={() => { onSelect(p); setOpen(false); setQ(""); }}
//               style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", border: "none", background: value === p.product_name ? "rgba(124,58,237,0.1)" : "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.15s", fontFamily: "var(--font-body)" }}
//               onMouseEnter={e => { if (value !== p.product_name) (e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)"; }}
//               onMouseLeave={e => { if (value !== p.product_name) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
//             >
//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.product_name}</div>
//                 <div style={{ display: "flex", gap: "6px", marginTop: "2px", alignItems: "center" }}>
//                   {p.sku && <span style={{ fontSize: "10px", color: "var(--accent)", background: "rgba(124,58,237,0.1)", padding: "1px 5px", borderRadius: "4px", fontFamily: "var(--font-mono)" }}>{p.sku}</span>}
//                   <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600, fontFamily: "var(--font-mono)" }}>${p.unit_price.toLocaleString()}</span>
//                 </div>
//               </div>
//               {value === p.product_name && <svg style={{ color: "var(--accent)", flexShrink: 0 }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---- VAT Toggle ---- */
// function VatToggle({ enabled, onChange, amount, moneyFn }: { enabled: boolean; onChange: (v: boolean) => void; amount: number; moneyFn: (n: number) => string }) {
//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//       <button type="button" onClick={() => onChange(!enabled)} style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
//         <div style={{ width: "40px", height: "22px", borderRadius: "11px", background: enabled ? "linear-gradient(135deg,var(--accent),var(--accent-2))" : "var(--border)", position: "relative", transition: "background 0.25s ease", flexShrink: 0, boxShadow: enabled ? "0 0 12px rgba(124,58,237,0.4)" : "none" }}>
//           <div style={{ position: "absolute", top: "3px", left: enabled ? "21px" : "3px", width: "16px", height: "16px", borderRadius: "50%", background: "white", transition: "left 0.25s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.25)" }} />
//         </div>
//         <span style={{ fontSize: "13.5px", color: enabled ? "var(--text-primary)" : "var(--text-muted)", fontWeight: enabled ? 600 : 400, transition: "color 0.2s" }}>VAT (7%)</span>
//       </button>
//       <span style={{ fontSize: "13.5px", color: enabled ? "var(--text-secondary)" : "var(--text-muted)", fontFamily: "var(--font-mono)", fontWeight: 600, transition: "color 0.2s" }}>
//         {enabled ? moneyFn(amount) : "—"}
//       </span>
//     </div>
//   );
// }

// export default function CreatePage() {
//   const { t, lang } = useLang();
//   const router = useRouter();
//   const API = process.env.NEXT_PUBLIC_API_URL || "";

//   const [customers, setCustomers] = useState<CustomerDB[]>([]);
//   const [productCatalog, setProductCatalog] = useState<ProductDB[]>([]);
//   const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
//   const [customer, setCustomer] = useState({ customer_name: "", customer_company: "", customer_phone: "", customer_address: "", customer_email: "" });
//   const [items, setItems] = useState<Item[]>([{ product_name: "", description: "", qty: 1, unit_price: 0, discount: 0, discount_type: "%" }]);
//   const [date, setDate] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [vatEnabled, setVatEnabled] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     const today = new Date(), next = new Date();
//     next.setDate(today.getDate() + 30);
//     const f = (d: Date) => d.toISOString().split("T")[0];
//     setDate(f(today)); setExpiry(f(next));
//     // fetch both in parallel
//     Promise.all([
//       fetch(`${API}/customers`).then(r => r.ok ? r.json() : []).catch(() => []),
//       fetch(`${API}/products`).then(r => r.ok ? r.json() : []).catch(() => []),
//     ]).then(([custs, prods]) => {
//       setCustomers(custs || []);
//       setProductCatalog(prods || []);
//     });
//   }, []);

//   const selectCustomer = (id: number) => {
//     setSelectedCustomerId(id);
//     const c = customers.find(c => c.customer_id === id); if (!c) return;
//     setCustomer({ customer_name: c.customer_name, customer_company: c.customer_company, customer_phone: c.customer_phone, customer_address: c.customer_address, customer_email: c.customer_email });
//   };

//   const addRow = () => setItems([...items, { product_name: "", description: "", qty: 1, unit_price: 0, discount: 0, discount_type: "%" }]);
//   const deleteRow = (i: number) => setItems(items.filter((_, idx) => idx !== i));
//   const updateItem = <K extends keyof Item>(i: number, field: K, value: Item[K]) => {
//     const n = [...items]; n[i][field] = value; setItems(n);
//   };
//   const selectProduct = (i: number, p: ProductDB) => {
//     const n = [...items];
//     n[i] = { ...n[i], product_name: p.product_name, description: p.description, unit_price: p.unit_price };
//     setItems(n);
//   };

//   const subtotal = items.reduce((s, i) => s + i.qty * i.unit_price * (1 - i.discount / 100), 0);
//   const totalDiscount = items.reduce((s, i) => s + i.qty * i.unit_price * (i.discount / 100), 0);
//   const vat = vatEnabled ? subtotal * 0.07 : 0;
//   const total = subtotal + vat;
//   const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

//   const submit = async () => {
//     if (!customer.customer_name) { alert(lang === "th" ? "กรุณากรอกชื่อลูกค้า" : "Please enter customer name"); return; }
//     const validItems = items.filter(i => i.product_name);
//     if (!validItems.length) { alert(lang === "th" ? "กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ" : "Please add at least 1 product"); return; }
//     setSubmitting(true);
//     try {
//       const res = await fetch(`${API}/quotations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer_id: selectedCustomerId, customer, issue_date: date, expiry_date: expiry, items: validItems }) });
//       const data = await res.json();
//       if (!res.ok) { alert(data.error || "Error"); return; }
//       alert(lang === "th" ? "บันทึกสำเร็จ ✅" : "Saved successfully ✅");
//       router.push("/quotations");
//     } finally { setSubmitting(false); }
//   };

//   const cardStyle: React.CSSProperties = { background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)", padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)" };
//   const sectionIcon = (path: string) => (
//     <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(124,58,237,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//       <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={path} /></svg>
//     </span>
//   );

//   return (
//     <SidebarLayout>
//       <div style={{ padding: "32px 36px 60px" }}>

//         {/* HEADER */}
//         <div className="fade-up" style={{ marginBottom: "28px" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
//             <button onClick={() => router.push("/quotations")} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "12.5px", fontWeight: 500, fontFamily: "var(--font-body)", padding: "4px 0", transition: "color 0.2s" }}
//               onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
//               onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
//             >
//               <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
//               {t("quotations")}
//             </button>
//             <span style={{ color: "var(--border)", fontSize: "12px" }}>/</span>
//             <span style={{ color: "var(--text-secondary)", fontSize: "12.5px" }}>{lang === "th" ? "ใหม่" : "New"}</span>
//           </div>
//           <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
//             {t("NewQuotation")}
//           </h1>
//         </div>

//         {/* DATE BAR */}
//         <div className="fade-up fade-up-1" style={{ ...cardStyle, marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <div>
//             <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{t("Quotation")}</p>
//             <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{t("enterpriseSystem")}</p>
//           </div>
//           <div style={{ display: "flex", gap: "12px" }}>
//             {[{ label: t("issueDate"), value: date, set: setDate }, { label: t("expiryDate"), value: expiry, set: setExpiry }].map(f => (
//               <div key={f.label}>
//                 <label style={{ display: "block", fontSize: "10.5px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px", letterSpacing: "0.04em" }}>{f.label.toUpperCase()}</label>
//                 <input type="date" value={f.value} onChange={e => f.set(e.target.value)} style={{ ...inputStyle, width: "auto", padding: "8px 12px" }} onFocus={focusFn} onBlur={blurFn} />
//               </div>
//             ))}
//           </div>
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", alignItems: "start" }}>
//           <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

//             {/* CUSTOMER CARD */}
//             <div className="fade-up fade-up-1" style={cardStyle}>
//               <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
//                 {sectionIcon("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z")}
//                 {t("Customer Info")}
//               </h2>
//               <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
//                 <Field label={t("selectCustomer").toUpperCase()}>
//                   <CustomerDropdown customers={customers} selected={selectedCustomerId} onSelect={selectCustomer} placeholder={t("selectCustomer")} />
//                 </Field>
//                 <Field label={t("customerName")}>
//                   <input value={customer.customer_name} onChange={e => setCustomer({ ...customer, customer_name: e.target.value })} placeholder={lang === "th" ? "ชื่อ-นามสกุล" : "Full name"} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
//                 </Field>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
//                   <Field label={t("company")}>
//                     <input value={customer.customer_company} onChange={e => setCustomer({ ...customer, customer_company: e.target.value })} placeholder={lang === "th" ? "ชื่อบริษัท" : "Company name"} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
//                   </Field>
//                   <Field label={t("phone")}>
//                     <input value={customer.customer_phone} onChange={e => setCustomer({ ...customer, customer_phone: e.target.value })} placeholder="+66 00 000 0000" style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
//                   </Field>
//                 </div>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
//                   <Field label={t("billingAddr")}>
//                     <input value={customer.customer_address} onChange={e => setCustomer({ ...customer, customer_address: e.target.value })} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
//                   </Field>
//                   <Field label={t("shippingAddr")}>
//                     <input value={customer.customer_address} onChange={e => setCustomer({ ...customer, customer_address: e.target.value })} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
//                   </Field>
//                 </div>
//                 <Field label={t("email")}>
//                   <input type="email" value={customer.customer_email} onChange={e => setCustomer({ ...customer, customer_email: e.target.value })} placeholder="email@company.com" style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
//                 </Field>
//               </div>
//             </div>

//             {/* PRODUCTS CARD */}
//             <div className="fade-up fade-up-2" style={cardStyle}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
//                 <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
//                   {sectionIcon("M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4")}
//                   {lang === "th" ? "สินค้า" : "Products"}
//                 </h2>
//                 <button onClick={addRow} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px", background: "rgba(124,58,237,0.12)", color: "var(--accent)", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-body)", cursor: "pointer", transition: "all 0.2s", border: "1px solid rgba(124,58,237,0.2)" }}
//                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.2)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
//                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
//                 >
//                   <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
//                   {t("addItem")}
//                 </button>
//               </div>
//               <div style={{ overflowX: "auto" }}>
//                 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
//                   <thead>
//                     <tr style={{ borderBottom: "1px solid var(--border)" }}>
//                       {[lang==="th"?"สินค้า":t("product"), t("description"), t("qty"), t("unitPrice"), t("discount"), t("type"), t("lineTotal"), ""].map((h, i) => (
//                         <th key={i} style={{ padding: "8px 10px", textAlign: i >= 2 ? "center" : "left", fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {items.length === 0 && (
//                       <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "13.5px" }}>{t("noItems")}</td></tr>
//                     )}
//                     {items.map((item, i) => {
//                       const lineTotal = item.qty * item.unit_price * (1 - item.discount / 100);
//                       return (
//                         <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
//                           {/* Product dropdown — auto-fills description + price */}
//                           <td style={{ padding: "8px 6px" }}>
//                             <ProductDropdown
//                               products={productCatalog}
//                               value={item.product_name}
//                               onSelect={p => selectProduct(i, p)}
//                               placeholder={lang === "th" ? "เลือกสินค้า" : "Select product"}
//                             />
//                           </td>
//                           <td style={{ padding: "8px 6px" }}>
//                             <input value={item.description} onChange={e => updateItem(i, "description", e.target.value)} placeholder={t("description")} style={{ ...inputStyle, width: "170px", padding: "8px 10px", fontSize: "13px" }} onFocus={focusFn} onBlur={blurFn} />
//                           </td>
//                           <td style={{ padding: "8px 6px" }}>
//                             <input type="number" value={item.qty} onChange={e => updateItem(i, "qty", Number(e.target.value))} style={{ ...inputStyle, width: "60px", padding: "8px 8px", fontSize: "13px", textAlign: "center" }} onFocus={focusFn} onBlur={blurFn} />
//                           </td>
//                           <td style={{ padding: "8px 6px" }}>
//                             <input type="number" value={item.unit_price} onChange={e => updateItem(i, "unit_price", Number(e.target.value))} style={{ ...inputStyle, width: "96px", padding: "8px 10px", fontSize: "13px", textAlign: "right" }} onFocus={focusFn} onBlur={blurFn} />
//                           </td>
//                           <td style={{ padding: "8px 6px" }}>
//                             <input type="number" value={item.discount} onChange={e => updateItem(i, "discount", Number(e.target.value))} style={{ ...inputStyle, width: "60px", padding: "8px 8px", fontSize: "13px", textAlign: "center" }} onFocus={focusFn} onBlur={blurFn} />
//                           </td>
//                           <td style={{ padding: "8px 6px" }}>
//                             <select value={item.discount_type} onChange={e => updateItem(i, "discount_type", e.target.value)} style={{ ...inputStyle, width: "60px", padding: "8px 6px", fontSize: "12px" }} onFocus={focusFn} onBlur={blurFn}>
//                               <option>%</option><option>$</option>
//                             </select>
//                           </td>
//                           <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-primary)", whiteSpace: "nowrap" }}>
//                             {money(lineTotal)}
//                           </td>
//                           <td style={{ padding: "8px 6px" }}>
//                             <button onClick={() => deleteRow(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "6px", borderRadius: "6px", display: "flex", alignItems: "center", transition: "all 0.15s" }}
//                               onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; }}
//                               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.background = "none"; }}
//                             >
//                               <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
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

//           {/* SUMMARY PANEL */}
//           <div className="fade-up fade-up-3" style={{ position: "sticky", top: "72px", ...cardStyle }}>
//             <h2 style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: "20px" }}>
//               {t("summary")}
//             </h2>
//             <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <span style={{ fontSize: "13.5px", color: "var(--text-secondary)", fontWeight: 500 }}>{t("subtotal")}</span>
//                 <span style={{ fontSize: "13.5px", color: "var(--text-secondary)", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{money(subtotal + totalDiscount)}</span>
//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <span style={{ fontSize: "13.5px", color: "var(--text-secondary)", fontWeight: 500 }}>{t("discountRow")}</span>
//                 <span style={{ fontSize: "13.5px", color: "#f87171", fontWeight: 600, fontFamily: "var(--font-mono)" }}>-{money(totalDiscount)}</span>
//               </div>
//               <VatToggle enabled={vatEnabled} onChange={setVatEnabled} amount={vat} moneyFn={money} />
//             </div>
//             <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
//               <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{t("grandTotal")}</span>
//               <span style={{ fontSize: "22px", fontWeight: 900, fontFamily: "var(--font-mono)", letterSpacing: "-0.03em", background: "linear-gradient(135deg,var(--accent),var(--accent-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
//                 {money(total)}
//               </span>
//             </div>
//             <button onClick={submit} disabled={submitting}
//               style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: submitting ? "var(--border)" : "linear-gradient(135deg,#7c3aed,#db2777)", color: "white", fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 4px 20px rgba(124,58,237,0.4)", transition: "all 0.2s ease" }}
//               onMouseEnter={e => { if (!submitting) { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(124,58,237,0.5)"; } }}
//               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)"; }}
//             >
//               {submitting ? t("saving") : t("saveQuotation")}
//             </button>
//           </div>
//         </div>
//       </div>
//     </SidebarLayout>
//   );
// }
"use client";
/* ================================================================
   app/create/page.tsx  (UPDATED v2)
   Changes:
   - Sales Rep: combobox (type or select from history)
   - Billing Address: required field
   - Shipping Address: optional + "Same as Billing" toggle
   - Payment Terms: required dropdown
   - Conditions/Notes: textarea
   - Validation with shake animation + inline error messages
   - Field required indicators (*)
   ================================================================ */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarLayout, useLang } from "@/components/SidebarLayout";

type CustomerDB = {
  customer_id: number;
  customer_name: string;
  customer_company: string;
  customer_phone: string;
  customer_address: string;
  customer_email: string;
  tax_id?: string;
};
type ProductDB = {
  product_id: number;
  product_name: string;
  sku?: string;
  description: string;
  unit_price: number;
  category?: string;
};
type Item = {
  product_name: string;
  description: string;
  qty: number;
  unit_price: number;
  discount: number;
  discount_type: string;
};

/* ---- inject shake keyframe once ---- */
if (typeof document !== "undefined") {
  const id = "__shake_style__";
  if (!document.getElementById(id)) {
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @keyframes shakeField {
        0%,100%{transform:translateX(0)}
        15%{transform:translateX(-6px)}
        30%{transform:translateX(6px)}
        45%{transform:translateX(-4px)}
        60%{transform:translateX(4px)}
        75%{transform:translateX(-2px)}
        90%{transform:translateX(2px)}
      }
      .shake { animation: shakeField 0.45s ease; }
    `;
    document.head.appendChild(s);
  }
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: "1px solid var(--border)",
  borderRadius: "10px", fontSize: "13.5px", background: "var(--input-bg)",
  color: "var(--text-primary)", outline: "none", fontFamily: "var(--font-body)",
  transition: "border-color 0.2s, box-shadow 0.2s",
};
const errorInputStyle: React.CSSProperties = {
  ...inputStyle, borderColor: "#f87171", boxShadow: "0 0 0 3px rgba(248,113,113,0.15)"
};
const focusFn  = (e: React.FocusEvent<any>) => { e.target.style.borderColor = "var(--border-hover)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; };
const blurFn   = (e: React.FocusEvent<any>) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; };
const errorFocusFn = (e: React.FocusEvent<any>) => { e.target.style.borderColor = "#f87171"; e.target.style.boxShadow = "0 0 0 3px rgba(248,113,113,0.2)"; };

function Field({
  label, required, error, children
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11.5px", fontWeight: 600, color: error ? "#f87171" : "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.03em", transition: "color 0.2s" }}>
        {label}
        {required && <span style={{ color: "#f87171", fontSize: "12px", lineHeight: 1 }}>*</span>}
      </label>
      <div className={error ? "shake" : ""} style={{ animationIterationCount: 1 }}>
        {children}
      </div>
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "5px" }}>
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
          <span style={{ fontSize: "11px", color: "#f87171", fontWeight: 500 }}>{error}</span>
        </div>
      )}
    </div>
  );
}

/* ---- Customer Dropdown ---- */
function CustomerDropdown({ customers, selected, onSelect, placeholder }: {
  customers: CustomerDB[]; selected: number | null; onSelect: (id: number) => void; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = customers.filter(c =>
    c.customer_name.toLowerCase().includes(q.toLowerCase()) ||
    (c.customer_company || "").toLowerCase().includes(q.toLowerCase())
  );
  const sel = customers.find(c => c.customer_id === selected);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ ...inputStyle, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"}
        onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
      >
        <span style={{ color: sel ? "var(--text-primary)" : "var(--text-muted)", fontSize: "13.5px" }}>
          {sel ? `${sel.customer_name}${sel.customer_company ? ` — ${sel.customer_company}` : ""}` : placeholder}
        </span>
        <svg style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200, background: "var(--bg-sidebar)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", overflow: "hidden", opacity: open ? 1 : 0, transform: open ? "translateY(0) scaleY(1)" : "translateY(-6px) scaleY(0.96)", transformOrigin: "top", transition: "opacity 0.18s ease, transform 0.18s ease", pointerEvents: open ? "auto" : "none", backdropFilter: "blur(20px)" }}>
        <div style={{ padding: "10px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
            <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." style={{ width: "100%", padding: "7px 10px 7px 30px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", background: "var(--input-bg)", color: "var(--text-primary)", outline: "none", fontFamily: "var(--font-body)" }} />
          </div>
        </div>
        <div style={{ maxHeight: "220px", overflowY: "auto" }}>
          {filtered.length === 0 && <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>No customers</div>}
          {filtered.map(c => (
            <button key={c.customer_id} type="button" onClick={() => { onSelect(c.customer_id); setOpen(false); setQ(""); }}
              style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 14px", border: "none", background: selected === c.customer_id ? "rgba(124,58,237,0.1)" : "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.15s", fontFamily: "var(--font-body)" }}
              onMouseEnter={e => { if (selected !== c.customer_id) (e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)"; }}
              onMouseLeave={e => { if (selected !== c.customer_id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: selected === c.customer_id ? "linear-gradient(135deg,#7c3aed,#db2777)" : "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: selected === c.customer_id ? "white" : "var(--accent)" }}>{(c.customer_name[0] || "?").toUpperCase()}</span>
              </div>
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>{c.customer_name}</div>
                {c.customer_company && <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{c.customer_company}</div>}
              </div>
              {selected === c.customer_id && <svg style={{ marginLeft: "auto", color: "var(--accent)" }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Sales Rep Combobox ---- */
function SalesRepCombobox({ value, onChange, history, placeholder }: {
  value: string; onChange: (v: string) => void; history: string[]; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = history.filter(h => h.toLowerCase().includes(value.toLowerCase()) && h !== value);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <input
          ref={inputRef}
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          placeholder={placeholder}
          style={{ ...inputStyle, paddingLeft: "36px", paddingRight: "36px" }}
          onFocus={e => { focusFn(e); setOpen(true); }}
          onBlur={blurFn}
        />
        {history.length > 0 && (
          <button type="button" onClick={() => setOpen(!open)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", padding: "2px" }}>
            <svg style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200, background: "var(--bg-sidebar)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", overflow: "hidden", backdropFilter: "blur(20px)", animation: "fadeSlide 0.15s ease" }}>
          <div style={{ padding: "6px" }}>
            <div style={{ padding: "4px 10px 6px", fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em" }}>RECENT</div>
            {filtered.map(name => (
              <button key={name} type="button"
                onClick={() => { onChange(name); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", borderRadius: "8px", transition: "background 0.15s", fontFamily: "var(--font-body)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent)" }}>{name[0]?.toUpperCase()}</span>
                </div>
                <span style={{ fontSize: "13.5px", color: "var(--text-primary)", fontWeight: 500 }}>{name}</span>
                <svg style={{ marginLeft: "auto", color: "var(--text-muted)" }} width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Product Dropdown (per row) ---- */
function ProductDropdown({ products, value, onSelect, placeholder }: {
  products: ProductDB[]; value: string; onSelect: (p: ProductDB) => void; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = products.filter(p =>
    p.product_name.toLowerCase().includes(q.toLowerCase()) ||
    (p.sku || "").toLowerCase().includes(q.toLowerCase())
  );

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ ...inputStyle, width: "150px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "8px 10px", fontSize: "13px" }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"}
        onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
      >
        <span style={{ color: value ? "var(--text-primary)" : "var(--text-muted)", fontSize: "12.5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "110px" }}>
          {value || placeholder}
        </span>
        <svg style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }} width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 300, width: "260px", background: "var(--bg-sidebar)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.35)", overflow: "hidden", opacity: open ? 1 : 0, transform: open ? "translateY(0) scaleY(1)" : "translateY(-6px) scaleY(0.96)", transformOrigin: "top", transition: "opacity 0.18s ease, transform 0.18s ease", pointerEvents: open ? "auto" : "none", backdropFilter: "blur(20px)" }}>
        <div style={{ padding: "8px", borderBottom: "1px solid var(--border)" }}>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search products..." style={{ width: "100%", padding: "7px 10px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12.5px", background: "var(--input-bg)", color: "var(--text-primary)", outline: "none", fontFamily: "var(--font-body)" }} />
        </div>
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {filtered.length === 0 && <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px" }}>No products</div>}
          {filtered.map(p => (
            <button key={p.product_id} type="button" onClick={() => { onSelect(p); setOpen(false); setQ(""); }}
              style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", border: "none", background: value === p.product_name ? "rgba(124,58,237,0.1)" : "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.15s", fontFamily: "var(--font-body)" }}
              onMouseEnter={e => { if (value !== p.product_name) (e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)"; }}
              onMouseLeave={e => { if (value !== p.product_name) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.product_name}</div>
                <div style={{ display: "flex", gap: "6px", marginTop: "2px", alignItems: "center" }}>
                  {p.sku && <span style={{ fontSize: "10px", color: "var(--accent)", background: "rgba(124,58,237,0.1)", padding: "1px 5px", borderRadius: "4px", fontFamily: "var(--font-mono)" }}>{p.sku}</span>}
                  <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600, fontFamily: "var(--font-mono)" }}>${p.unit_price.toLocaleString()}</span>
                </div>
              </div>
              {value === p.product_name && <svg style={{ color: "var(--accent)", flexShrink: 0 }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- VAT Toggle ---- */
function VatToggle({ enabled, onChange, amount, moneyFn }: { enabled: boolean; onChange: (v: boolean) => void; amount: number; moneyFn: (n: number) => string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <button type="button" onClick={() => onChange(!enabled)} style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        <div style={{ width: "40px", height: "22px", borderRadius: "11px", background: enabled ? "linear-gradient(135deg,var(--accent),var(--accent-2))" : "var(--border)", position: "relative", transition: "background 0.25s ease", flexShrink: 0, boxShadow: enabled ? "0 0 12px rgba(124,58,237,0.4)" : "none" }}>
          <div style={{ position: "absolute", top: "3px", left: enabled ? "21px" : "3px", width: "16px", height: "16px", borderRadius: "50%", background: "white", transition: "left 0.25s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.25)" }} />
        </div>
        <span style={{ fontSize: "13.5px", color: enabled ? "var(--text-primary)" : "var(--text-muted)", fontWeight: enabled ? 600 : 400, transition: "color 0.2s" }}>VAT (7%)</span>
      </button>
      <span style={{ fontSize: "13.5px", color: enabled ? "var(--text-secondary)" : "var(--text-muted)", fontFamily: "var(--font-mono)", fontWeight: 600, transition: "color 0.2s" }}>
        {enabled ? moneyFn(amount) : "—"}
      </span>
    </div>
  );
}

/* ---- Payment Terms Dropdown ---- */
const PAYMENT_TERMS = [
  { value: "net7",    label: "Net 7" },
  { value: "net15",   label: "Net 15" },
  { value: "net30",   label: "Net 30" },
  { value: "net45",   label: "Net 45" },
  { value: "net60",   label: "Net 60" },
  { value: "cod",     label: "Cash on Delivery (COD)" },
  { value: "prepaid", label: "Prepaid" },
  { value: "eia",     label: "End of Month" },
];

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default function CreatePage() {
  const { t, lang } = useLang();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  /* data */
  const [customers, setCustomers]           = useState<CustomerDB[]>([]);
  const [productCatalog, setProductCatalog] = useState<ProductDB[]>([]);

  /* doc meta */
  const [date, setDate]       = useState("");
  const [expiry, setExpiry]   = useState("");
  const [salesRep, setSalesRep]         = useState("");
  const [salesRepHistory, setSalesRepHistory] = useState<string[]>([]);
  const [paymentTerm, setPaymentTerm]   = useState("net30");
  const [notes, setNotes]               = useState("");

  /* customer */
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [customer, setCustomer] = useState({
    customer_name:    "",
    customer_company: "",
    customer_phone:   "",
    customer_address: "",   // billing
    shipping_address: "",   // shipping (new)
    customer_email:   "",
    tax_id:           "",
  });
  const [sameAsBilling, setSameAsBilling] = useState(false);

  /* items */
  const [items, setItems] = useState<Item[]>([
    { product_name: "", description: "", qty: 1, unit_price: 0, discount: 0, discount_type: "%" }
  ]);

  /* other */
  const [vatEnabled, setVatEnabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* errors */
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---- load data ---- */
  useEffect(() => {
    const today = new Date(), next = new Date();
    next.setDate(today.getDate() + 30);
    const f = (d: Date) => d.toISOString().split("T")[0];
    setDate(f(today)); setExpiry(f(next));

    // load sales rep history from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("salesRepHistory") || "[]");
      if (Array.isArray(saved)) setSalesRepHistory(saved);
    } catch {}

    Promise.all([
      fetch(`${API}/customers`).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${API}/products`).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([custs, prods]) => {
      setCustomers(custs || []);
      setProductCatalog(prods || []);
    });
  }, []);

  /* ---- customer select ---- */
  const selectCustomer = (id: number) => {
    setSelectedCustomerId(id);
    const c = customers.find(c => c.customer_id === id);
    if (!c) return;
    setCustomer(prev => ({
      ...prev,
      customer_name:    c.customer_name,
      customer_company: c.customer_company,
      customer_phone:   c.customer_phone,
      customer_address: c.customer_address,
      customer_email:   c.customer_email,
      tax_id:           c.tax_id || "",
      shipping_address: sameAsBilling ? c.customer_address : prev.shipping_address,
    }));
  };

  /* ---- billing → shipping sync ---- */
  const handleBillingChange = (val: string) => {
    setCustomer(prev => ({
      ...prev,
      customer_address: val,
      shipping_address: sameAsBilling ? val : prev.shipping_address,
    }));
  };
  const handleSameAsBilling = (checked: boolean) => {
    setSameAsBilling(checked);
    if (checked) setCustomer(prev => ({ ...prev, shipping_address: prev.customer_address }));
  };

  /* ---- items ---- */
  const addRow    = () => setItems([...items, { product_name: "", description: "", qty: 1, unit_price: 0, discount: 0, discount_type: "%" }]);
  const deleteRow = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = <K extends keyof Item>(i: number, field: K, value: Item[K]) => {
    const n = [...items]; n[i][field] = value; setItems(n);
  };
  const selectProduct = (i: number, p: ProductDB) => {
    const n = [...items];
    n[i] = { ...n[i], product_name: p.product_name, description: p.description, unit_price: p.unit_price };
    setItems(n);
  };

  /* ---- totals ---- */
  const subtotal      = items.reduce((s, i) => s + i.qty * i.unit_price * (1 - i.discount / 100), 0);
  const totalDiscount = items.reduce((s, i) => s + i.qty * i.unit_price * (i.discount / 100), 0);
  const vat   = vatEnabled ? subtotal * 0.07 : 0;
  const total = subtotal + vat;
  const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  /* ---- validation ---- */
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const req = lang === "th" ? "จำเป็นต้องกรอก" : "This field is required";

    if (!salesRep.trim())                e.salesRep        = req;
    if (!customer.customer_name.trim())  e.customer_name   = req;
    if (!customer.customer_address.trim()) e.billing_address = req;
    if (!customer.customer_email.trim()) e.email           = req;
    if (!paymentTerm)                    e.paymentTerm     = req;

    const validItems = items.filter(i => i.product_name);
    if (!validItems.length) e.items = lang === "th" ? "กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ" : "Add at least 1 product";

    setErrors(e);

    /* scroll to first error */
    if (Object.keys(e).length > 0) {
      const id = Object.keys(e)[0];
      document.getElementById(`field-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return Object.keys(e).length === 0;
  };

  /* ---- submit ---- */
  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    /* save sales rep to history */
    if (salesRep.trim()) {
      const updated = [salesRep, ...salesRepHistory.filter(h => h !== salesRep)].slice(0, 10);
      setSalesRepHistory(updated);
      try { localStorage.setItem("salesRepHistory", JSON.stringify(updated)); } catch {}
    }

    try {
      const res = await fetch(`${API}/quotations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: selectedCustomerId,
          customer: {
            customer_name:    customer.customer_name,
            customer_company: customer.customer_company,
            customer_phone:   customer.customer_phone,
            customer_address: customer.customer_address,
            shipping_address: sameAsBilling ? customer.customer_address : customer.shipping_address,
            customer_email:   customer.customer_email,
            tax_id:           customer.tax_id,
          },
          sales_rep:    salesRep,
          issue_date:   date,
          expiry_date:  expiry,
          payment_term: paymentTerm,
          notes,
          vat_enabled:  vatEnabled,
          items: items.filter(i => i.product_name),
        }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Error"); return; }
      alert(lang === "th" ? "บันทึกสำเร็จ ✅" : "Saved successfully ✅");
      router.push("/quotations");
    } finally { setSubmitting(false); }
  };

  /* ---- styles ---- */
  const cardStyle: React.CSSProperties = {
    background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)",
    padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)",
  };
  const sectionIcon = (path: string) => (
    <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(124,58,237,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={path} /></svg>
    </span>
  );

  /* field helper: clears error on change */
  const clearErr = (key: string) => { if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; }); };

  return (
    <SidebarLayout>
      <div style={{ padding: "32px 36px 60px" }}>

        {/* HEADER */}
        <div className="fade-up" style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <button onClick={() => router.push("/quotations")} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "12.5px", fontWeight: 500, fontFamily: "var(--font-body)", padding: "4px 0", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              {t("quotations")}
            </button>
            <span style={{ color: "var(--border)", fontSize: "12px" }}>/</span>
            <span style={{ color: "var(--text-secondary)", fontSize: "12.5px" }}>{lang === "th" ? "ใหม่" : "New"}</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
            {t("NewQuotation")}
          </h1>
        </div>

        {/* ── DOCUMENT DETAILS BAR ── */}
        <div className="fade-up fade-up-1" style={{ ...cardStyle, marginBottom: "20px" }}>
          {/* top row: title + dates */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "24px", flexWrap: "wrap", marginBottom: "18px" }}>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{t("Quotation")}</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{t("enterpriseSystem")}</p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[{ label: t("issueDate"), value: date, set: setDate }, { label: t("expiryDate"), value: expiry, set: setExpiry }].map(f => (
                <div key={f.label}>
                  <label style={{ display: "block", fontSize: "10.5px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px", letterSpacing: "0.04em" }}>{f.label.toUpperCase()}</label>
                  <input type="date" value={f.value} onChange={e => f.set(e.target.value)} style={{ ...inputStyle, width: "auto", padding: "8px 12px" }} onFocus={focusFn} onBlur={blurFn} />
                </div>
              ))}
            </div>
          </div>

          {/* bottom row: Sales Rep */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div id="field-salesRep">
              <Field label={lang === "th" ? "พนักงานขาย (Sales Rep)" : "Sales Rep"} required error={errors.salesRep}>
                <SalesRepCombobox
                  value={salesRep}
                  onChange={v => { setSalesRep(v); clearErr("salesRep"); }}
                  history={salesRepHistory}
                  placeholder={lang === "th" ? "พิมพ์หรือเลือกชื่อ..." : "Type or select name..."}
                />
              </Field>
            </div>
            {/* Payment Terms */}
            <div id="field-paymentTerm">
              <Field label={lang === "th" ? "เงื่อนไขการชำระ (Payment Terms)" : "Payment Terms"} required error={errors.paymentTerm}>
                <div style={{ position: "relative" }}>
                  <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  <select
                    value={paymentTerm}
                    onChange={e => { setPaymentTerm(e.target.value); clearErr("paymentTerm"); }}
                    style={{ ...(errors.paymentTerm ? errorInputStyle : inputStyle), paddingLeft: "36px", appearance: "none", cursor: "pointer" }}
                    onFocus={errors.paymentTerm ? errorFocusFn : focusFn}
                    onBlur={blurFn}
                  >
                    {PAYMENT_TERMS.map(pt => (
                      <option key={pt.value} value={pt.value}>{pt.label}</option>
                    ))}
                  </select>
                  <svg style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </Field>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* ── CUSTOMER CARD ── */}
            <div className="fade-up fade-up-1" style={cardStyle}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                {sectionIcon("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z")}
                {t("Customer Info")}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* Customer select (auto-fill) */}
                <Field label={t("selectCustomer").toUpperCase()}>
                  <CustomerDropdown customers={customers} selected={selectedCustomerId} onSelect={id => { selectCustomer(id); clearErr("customer_name"); }} placeholder={t("selectCustomer")} />
                </Field>

                {/* Name + Contact */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div id="field-customer_name">
                    <Field label={t("customerName")} required error={errors.customer_name}>
                      <input value={customer.customer_name} onChange={e => { setCustomer({ ...customer, customer_name: e.target.value }); clearErr("customer_name"); }}
                        placeholder={lang === "th" ? "ชื่อ-นามสกุล" : "Full name"}
                        style={errors.customer_name ? errorInputStyle : inputStyle}
                        onFocus={errors.customer_name ? errorFocusFn : focusFn} onBlur={blurFn} />
                    </Field>
                  </div>
                  <Field label={lang === "th" ? "ชื่อผู้ติดต่อ" : "Contact Name"}>
                    <input value={customer.customer_company} onChange={e => setCustomer({ ...customer, customer_company: e.target.value })}
                      placeholder={lang === "th" ? "ชื่อผู้ติดต่อ" : "Contact name"}
                      style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
                  </Field>
                </div>

                {/* Company + Tax ID */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label={t("company")}>
                    <input value={customer.customer_company} onChange={e => setCustomer({ ...customer, customer_company: e.target.value })}
                      placeholder={lang === "th" ? "ชื่อบริษัท" : "Company name"}
                      style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
                  </Field>
                  <Field label={lang === "th" ? "เลขประจำตัวผู้เสียภาษี" : "Tax ID"}>
                    <input value={customer.tax_id} onChange={e => setCustomer({ ...customer, tax_id: e.target.value })}
                      placeholder="0000000000000"
                      style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
                  </Field>
                </div>

                {/* Phone + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label={t("phone")}>
                    <input value={customer.customer_phone} onChange={e => setCustomer({ ...customer, customer_phone: e.target.value })}
                      placeholder="+66 00 000 0000"
                      style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
                  </Field>
                  <div id="field-email">
                    <Field label={t("email")} required error={errors.email}>
                      <input type="email" value={customer.customer_email}
                        onChange={e => { setCustomer({ ...customer, customer_email: e.target.value }); clearErr("email"); }}
                        placeholder="email@company.com"
                        style={errors.email ? errorInputStyle : inputStyle}
                        onFocus={errors.email ? errorFocusFn : focusFn} onBlur={blurFn} />
                    </Field>
                  </div>
                </div>

                {/* ── Billing Address (required) ── */}
                <div id="field-billing_address">
                  <Field label={lang === "th" ? "ที่อยู่สำหรับวางบิล" : "Billing Address"} required error={errors.billing_address}>
                    <textarea
                      value={customer.customer_address}
                      onChange={e => { handleBillingChange(e.target.value); clearErr("billing_address"); }}
                      placeholder={lang === "th" ? "กรอกที่อยู่สำหรับวางบิล..." : "Enter billing address..."}
                      rows={3}
                      style={{
                        ...(errors.billing_address ? errorInputStyle : inputStyle),
                        resize: "vertical", minHeight: "80px", lineHeight: "1.5",
                      }}
                      onFocus={errors.billing_address ? errorFocusFn : focusFn}
                      onBlur={blurFn}
                    />
                  </Field>
                </div>

                {/* ── Shipping Address (optional + copy toggle) ── */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.03em" }}>
                      {lang === "th" ? "ที่อยู่จัดส่ง" : "Shipping Address"}
                      <span style={{ marginLeft: "6px", fontSize: "10px", color: "var(--text-muted)", fontWeight: 400, background: "var(--border)", padding: "1px 6px", borderRadius: "4px" }}>
                        {lang === "th" ? "ไม่บังคับ" : "Optional"}
                      </span>
                    </label>
                    {/* Same as billing toggle */}
                    <button type="button"
                      onClick={() => handleSameAsBilling(!sameAsBilling)}
                      style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", padding: "2px 0" }}
                    >
                      <div style={{
                        width: "16px", height: "16px", borderRadius: "4px",
                        border: `2px solid ${sameAsBilling ? "var(--accent)" : "var(--border)"}`,
                        background: sameAsBilling ? "var(--accent)" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.18s ease", flexShrink: 0,
                      }}>
                        {sameAsBilling && <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span style={{ fontSize: "12px", color: sameAsBilling ? "var(--accent)" : "var(--text-muted)", fontWeight: sameAsBilling ? 600 : 400, transition: "color 0.15s", whiteSpace: "nowrap" }}>
                        {lang === "th" ? "ใช้ที่อยู่เดียวกับวางบิล" : "Same as billing"}
                      </span>
                    </button>
                  </div>
                  <textarea
                    value={sameAsBilling ? customer.customer_address : customer.shipping_address}
                    onChange={e => { if (!sameAsBilling) setCustomer({ ...customer, shipping_address: e.target.value }); }}
                    disabled={sameAsBilling}
                    placeholder={
                      sameAsBilling
                        ? (lang === "th" ? "ใช้ที่อยู่เดียวกับวางบิล" : "Same as billing address")
                        : (lang === "th" ? "กรอกที่อยู่จัดส่ง หรือเว้นว่างไว้..." : "Enter shipping address, or leave blank...")
                    }
                    rows={3}
                    style={{
                      ...inputStyle, resize: "vertical", minHeight: "80px", lineHeight: "1.5",
                      opacity: sameAsBilling ? 0.6 : 1,
                      background: sameAsBilling ? "var(--bg-card)" : "var(--input-bg)",
                      cursor: sameAsBilling ? "not-allowed" : "text",
                      transition: "opacity 0.2s, background 0.2s",
                    }}
                    onFocus={sameAsBilling ? undefined : focusFn}
                    onBlur={sameAsBilling ? undefined : blurFn}
                  />
                </div>

              </div>
            </div>

            {/* ── PRODUCTS CARD ── */}
            <div className="fade-up fade-up-2" style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                  {sectionIcon("M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4")}
                  {lang === "th" ? "สินค้า" : "Products"}
                  {errors.items && <span style={{ fontSize: "11px", color: "#f87171", fontWeight: 500, marginLeft: "4px" }}>— {errors.items}</span>}
                </h2>
                <button onClick={addRow} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px", background: "rgba(124,58,237,0.12)", color: "var(--accent)", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-body)", cursor: "pointer", transition: "all 0.2s", border: "1px solid rgba(124,58,237,0.2)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.2)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  {t("addItem")}
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {[lang==="th"?"สินค้า":t("product"), t("description"), t("qty"), t("unitPrice"), t("discount"), t("type"), t("lineTotal"), ""].map((h, i) => (
                        <th key={i} style={{ padding: "8px 10px", textAlign: i >= 2 ? "center" : "left", fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "13.5px" }}>{t("noItems")}</td></tr>
                    )}
                    {items.map((item, i) => {
                      const lineTotal = item.qty * item.unit_price * (1 - item.discount / 100);
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.03)"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                        >
                          <td style={{ padding: "8px 6px" }}>
                            <ProductDropdown products={productCatalog} value={item.product_name} onSelect={p => { selectProduct(i, p); clearErr("items"); }} placeholder={lang === "th" ? "เลือกสินค้า" : "Select product"} />
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <input value={item.description} onChange={e => updateItem(i, "description", e.target.value)} placeholder={t("description")} style={{ ...inputStyle, width: "170px", padding: "8px 10px", fontSize: "13px" }} onFocus={focusFn} onBlur={blurFn} />
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <input type="number" value={item.qty} onChange={e => updateItem(i, "qty", Number(e.target.value))} style={{ ...inputStyle, width: "60px", padding: "8px 8px", fontSize: "13px", textAlign: "center" }} onFocus={focusFn} onBlur={blurFn} />
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <input type="number" value={item.unit_price} onChange={e => updateItem(i, "unit_price", Number(e.target.value))} style={{ ...inputStyle, width: "96px", padding: "8px 10px", fontSize: "13px", textAlign: "right" }} onFocus={focusFn} onBlur={blurFn} />
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <input type="number" value={item.discount} onChange={e => updateItem(i, "discount", Number(e.target.value))} style={{ ...inputStyle, width: "60px", padding: "8px 8px", fontSize: "13px", textAlign: "center" }} onFocus={focusFn} onBlur={blurFn} />
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <select value={item.discount_type} onChange={e => updateItem(i, "discount_type", e.target.value)} style={{ ...inputStyle, width: "60px", padding: "8px 6px", fontSize: "12px" }} onFocus={focusFn} onBlur={blurFn}>
                              <option>%</option><option>$</option>
                            </select>
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                            {money(lineTotal)}
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <button onClick={() => deleteRow(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "6px", borderRadius: "6px", display: "flex", alignItems: "center", transition: "all 0.15s" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.background = "none"; }}
                            >
                              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── CONDITIONS / NOTES CARD ── */}
            <div className="fade-up fade-up-3" style={cardStyle}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                {sectionIcon("M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z")}
                {lang === "th" ? "เงื่อนไข / หมายเหตุ" : "Conditions / Notes"}
              </h2>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={lang === "th"
                  ? "เช่น เงื่อนไขการรับประกัน, หมายเหตุพิเศษ, ข้อตกลงเพิ่มเติม..."
                  : "e.g. Warranty conditions, special remarks, additional terms..."}
                rows={5}
                style={{ ...inputStyle, resize: "vertical", minHeight: "110px", lineHeight: "1.6" }}
                onFocus={focusFn}
                onBlur={blurFn}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{notes.length} {lang === "th" ? "ตัวอักษร" : "chars"}</span>
              </div>
            </div>

          </div>{/* end left col */}

          {/* ── SUMMARY PANEL ── */}
          <div className="fade-up fade-up-3" style={{ position: "sticky", top: "72px", ...cardStyle }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: "20px" }}>
              {t("summary")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13.5px", color: "var(--text-secondary)", fontWeight: 500 }}>{t("subtotal")}</span>
                <span style={{ fontSize: "13.5px", color: "var(--text-secondary)", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{money(subtotal + totalDiscount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13.5px", color: "var(--text-secondary)", fontWeight: 500 }}>{t("discountRow")}</span>
                <span style={{ fontSize: "13.5px", color: "#f87171", fontWeight: 600, fontFamily: "var(--font-mono)" }}>-{money(totalDiscount)}</span>
              </div>
              <VatToggle enabled={vatEnabled} onChange={setVatEnabled} amount={vat} moneyFn={money} />
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{t("grandTotal")}</span>
              <span style={{ fontSize: "22px", fontWeight: 900, fontFamily: "var(--font-mono)", letterSpacing: "-0.03em", background: "linear-gradient(135deg,var(--accent),var(--accent-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {money(total)}
              </span>
            </div>

            {/* ── required fields checklist (mini progress) ── */}
            {Object.keys(errors).length > 0 && (
              <div style={{ marginBottom: "16px", padding: "12px 14px", borderRadius: "10px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#f87171" }}>
                    {lang === "th" ? `กรุณากรอกข้อมูล ${Object.keys(errors).length} รายการ` : `${Object.keys(errors).length} field(s) required`}
                  </span>
                </div>
                {Object.entries(errors).map(([key, msg]) => (
                  <div key={key} style={{ fontSize: "11.5px", color: "#fca5a5", paddingLeft: "2px", lineHeight: "1.8" }}>· {msg}</div>
                ))}
              </div>
            )}

            {/* Save button */}
            <button onClick={submit} disabled={submitting}
              style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: submitting ? "var(--border)" : "linear-gradient(135deg,#7c3aed,#db2777)", color: "white", fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", cursor: submitting ? "not-allowed" : "pointer", boxShadow: submitting ? "none" : "0 4px 20px rgba(124,58,237,0.4)", transition: "all 0.2s ease" }}
              onMouseEnter={e => { if (!submitting) { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(124,58,237,0.5)"; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; if (!submitting) (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)"; }}
            >
              {submitting ? t("saving") : t("saveQuotation")}
            </button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}