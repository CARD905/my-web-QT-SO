// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// /* ================= TYPES ================= */
// type Customer = {
//   customer_name: string;
//   customer_company: string;
//   customer_phone: string;
//   customer_address: string;
//   customer_email: string;
// };

// type CustomerDB = Customer & {
//   customer_id: number;
// };

// type Item = {
//   product_name: string;
//   description: string;
//   qty: number;
//   unit_price: number;
//   discount: number;
// };

// /* ================= PAGE ================= */
// export default function CreatePage() {
//   const router = useRouter();
//   const API = process.env.NEXT_PUBLIC_API_URL || "";

//   /* ================= STATE ================= */
//   const [customers, setCustomers] = useState<CustomerDB[]>([]);
//   const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

//   const [customer, setCustomer] = useState<Customer>({
//     customer_name: "",
//     customer_company: "",
//     customer_phone: "",
//     customer_address: "",
//     customer_email: "",
//   });

//   const [items, setItems] = useState<Item[]>([
//     {
//       product_name: "",
//       description: "",
//       qty: 1,
//       unit_price: 0,
//       discount: 0,
//     },
//   ]);

//   const [date, setDate] = useState("");
//   const [expiry, setExpiry] = useState("");

//   /* ================= INIT ================= */
//   useEffect(() => {
//     // โหลดลูกค้า
//     fetch(`${API}/customers`)
//       .then(res => res.json())
//       .then(setCustomers);

//     // set วันที่
//     const today = new Date();
//     const next = new Date();
//     next.setDate(today.getDate() + 30);

//     const f = (d: Date) => d.toISOString().split("T")[0];

//     setDate(f(today));
//     setExpiry(f(next));
//   }, []);

//   /* ================= SELECT CUSTOMER ================= */
//   const selectCustomer = (id: number) => {
//     setSelectedCustomerId(id);

//     const c = customers.find(c => c.customer_id === id);
//     if (!c) return;

//     // 🔥 autofill
//     setCustomer({
//       customer_name: c.customer_name,
//       customer_company: c.customer_company,
//       customer_phone: c.customer_phone,
//       customer_address: c.customer_address,
//       customer_email: c.customer_email,
//     });
//   };

//   /* ================= ITEM ================= */
//   const addRow = () => {
//     setItems([
//       ...items,
//       {
//         product_name: "",
//         description: "",
//         qty: 1,
//         unit_price: 0,
//         discount: 0,
//       },
//     ]);
//   };

//   const deleteRow = (i: number) => {
//     setItems(items.filter((_, index) => index !== i));
//   };

//   const updateItem = <K extends keyof Item>(
//     i: number,
//     field: K,
//     value: Item[K]
//   ) => {
//     const newItems = [...items];
//     newItems[i][field] = value;
//     setItems(newItems);
//   };

//   /* ================= CALC ================= */
//   const subtotal = items.reduce(
//     (sum, i) =>
//       sum + i.qty * i.unit_price * (1 - i.discount / 100),
//     0
//   );

//   const vat = subtotal * 0.07;
//   const total = subtotal + vat;

//   const money = (n: number) =>
//     n.toLocaleString("th-TH", {
//       style: "currency",
//       currency: "THB",
//     });

//   /* ================= SUBMIT ================= */
//   const submit = async () => {
//   if (!customer.customer_name) {
//     return alert("กรอกชื่อลูกค้า");
//   }

//   const validItems = items.filter(i => i.product_name);
//   if (validItems.length === 0) {
//     return alert("กรอกสินค้าอย่างน้อย 1 รายการ");
//   }

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
//         items: validItems,
//       }),
//     });

//     if (!res.ok) {
//       throw new Error("Create failed");
//     }

//     await res.json();

//     alert("สร้างสำเร็จ ✅");

//     router.push("/"); // 🔥 กลับหน้า list

//   } catch (err) {
//     console.error("Create error:", err);
//     alert("สร้างไม่สำเร็จ ❌");
//   }
// };

//   /* ================= UI ================= */
//   return (
//     <div className="p-8 bg-gray-100 min-h-screen space-y-6">
      
//       {/* HEADER */}
//       <div className="bg-white p-6 rounded-xl shadow flex justify-between">
//         <div>
//           <h1 className="text-xl font-bold">Create Quotation</h1>
//           <p className="text-gray-400 text-sm">
//             Enterprise Sales System
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <input
//             type="date"
//             value={date}
//             onChange={e => setDate(e.target.value)}
//             className="border p-2 rounded-lg"
//           />
//           <input
//             type="date"
//             value={expiry}
//             onChange={e => setExpiry(e.target.value)}
//             className="border p-2 rounded-lg"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-3 gap-6">

//         {/* LEFT */}
//         <div className="col-span-2 space-y-6">

//           {/* CUSTOMER */}
//           <div className="bg-white p-6 rounded-xl shadow space-y-3">
//             <h2 className="font-semibold">
//               Customer Information
//             </h2>

//             {/* 🔽 SELECT CUSTOMER */}
//             <select
//               value={selectedCustomerId || ""}
//               onChange={e => selectCustomer(Number(e.target.value))}
//               className="border p-2 rounded-lg w-full bg-gray-50"
//             >
//               <option value="">-- Select Customer --</option>
//               {customers.map(c => (
//                 <option key={c.customer_id} value={c.customer_id}>
//                   {c.customer_name}
//                 </option>
//               ))}
//             </select>

//             <input
//               placeholder="Customer Name"
//               value={customer.customer_name}
//               onChange={e =>
//                 setCustomer({ ...customer, customer_name: e.target.value })
//               }
//               className="border p-2 rounded-lg w-full"
//             />

//             <div className="grid grid-cols-2 gap-3">
//               <input
//                 placeholder="Company"
//                 value={customer.customer_company}
//                 onChange={e =>
//                   setCustomer({ ...customer, customer_company: e.target.value })
//                 }
//                 className="border p-2 rounded-lg"
//               />

//               <input
//                 placeholder="Phone"
//                 value={customer.customer_phone}
//                 onChange={e =>
//                   setCustomer({ ...customer, customer_phone: e.target.value })
//                 }
//                 className="border p-2 rounded-lg"
//               />
//             </div>

//             <input
//               placeholder="Address"
//               value={customer.customer_address}
//               onChange={e =>
//                 setCustomer({ ...customer, customer_address: e.target.value })
//               }
//               className="border p-2 rounded-lg w-full"
//             />

//             <input
//               placeholder="Email"
//               value={customer.customer_email}
//               onChange={e =>
//                 setCustomer({ ...customer, customer_email: e.target.value })
//               }
//               className="border p-2 rounded-lg w-full"
//             />
//           </div>

//           {/* PRODUCTS */}
//           <div className="bg-white p-6 rounded-xl shadow">
//             <div className="flex justify-between mb-4">
//               <h2 className="font-semibold text-lg">Products</h2>
//               <button
//                 onClick={addRow}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//               >
//                 + Add Product
//               </button>
//             </div>

//             <table className="w-full text-sm border">
//               <thead className="bg-gray-100 text-gray-500">
//                 <tr>
//                   <th className="p-3 text-left">Product</th>
//                   <th className="p-3 text-left">Description</th>
//                   <th className="p-3">Qty</th>
//                   <th className="p-3">Price</th>
//                   <th className="p-3">Disc%</th>
//                   <th className="p-3">Total</th>
//                   <th></th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {items.map((item, i) => (
//                   <tr key={i} className="border-t">
//                     <td className="p-2">
//                       <input
//                         value={item.product_name}
//                         onChange={e =>
//                           updateItem(i, "product_name", e.target.value)
//                         }
//                         className="w-full p-2 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2">
//                       <input
//                         value={item.description}
//                         onChange={e =>
//                           updateItem(i, "description", e.target.value)
//                         }
//                         className="w-full p-2 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={item.qty}
//                         onChange={e =>
//                           updateItem(i, "qty", Number(e.target.value))
//                         }
//                         className="w-20 p-2 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={item.unit_price}
//                         onChange={e =>
//                           updateItem(i, "unit_price", Number(e.target.value))
//                         }
//                         className="w-28 p-2 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={item.discount}
//                         onChange={e =>
//                           updateItem(i, "discount", Number(e.target.value))
//                         }
//                         className="w-20 p-2 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2 text-right font-semibold">
//                       {money(
//                         item.qty *
//                           item.unit_price *
//                           (1 - item.discount / 100)
//                       )}
//                     </td>

//                     <td className="p-2">
//                       <button
//                         onClick={() => deleteRow(i)}
//                         className="text-red-500"
//                       >
//                         ✕
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* RIGHT SUMMARY */}
//         <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-6">
//           <h2 className="font-semibold mb-4">Summary</h2>

//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>{money(subtotal)}</span>
//             </div>

//             <div className="flex justify-between">
//               <span>VAT 7%</span>
//               <span>{money(vat)}</span>
//             </div>

//             <div className="flex justify-between font-bold text-lg text-blue-600">
//               <span>Total</span>
//               <span>{money(total)}</span>
//             </div>
//           </div>

//           <button
//             onClick={submit}
//             className="bg-blue-600 text-white w-full mt-6 py-3 rounded-lg"
//           >
//             Save Quotation
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// page2-create.tsx  →  app/create/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, Topbar } from "../layout-components";

type Customer    = { customer_name:string; customer_company:string; customer_phone:string; customer_address:string; customer_email:string; customer_tax_id?:string; customer_shipping_address?:string; };
type CustomerDB  = Customer & { customer_id:number };
type Item        = { product_name:string; description:string; qty:number; unit_price:number; discount:number; type:string };

export default function CreatePage() {
  const router = useRouter();
  const API    = process.env.NEXT_PUBLIC_API_URL || "";

  const [customers, setCustomers]   = useState<CustomerDB[]>([]);
  const [selId, setSelId]           = useState<number | null>(null);
  const [customer, setCustomer]     = useState<Customer>({ customer_name:"", customer_company:"", customer_phone:"", customer_address:"", customer_email:"", customer_tax_id:"", customer_shipping_address:"" });
  const [items, setItems]           = useState<Item[]>([]);
  const [date, setDate]             = useState("");
  const [expiry, setExpiry]         = useState("");
  const [vatOn, setVatOn]           = useState(true);
  const [notes, setNotes]           = useState("");
  const [status, setStatus]         = useState("draft");
  const [saving, setSaving]         = useState(false);

  /* Auto-generate quotation number */
  const [docNo]                     = useState(() => {
    const now = new Date();
    const seq = Math.floor(Math.random() * 900) + 100;
    return `QT-${now.getFullYear()}-${seq}`;
  });

  useEffect(() => {
    fetch(`${API}/customers`).then(r => r.json()).then(setCustomers).catch(() => {});
    const today = new Date();
    const next  = new Date(); next.setDate(today.getDate() + 30);
    const f = (d: Date) => d.toISOString().split("T")[0];
    setDate(f(today)); setExpiry(f(next));
  }, []);

  const selectCustomer = (id: number) => {
    setSelId(id);
    const c = customers.find(x => x.customer_id === id);
    if (c) setCustomer({ customer_name:c.customer_name, customer_company:c.customer_company, customer_phone:c.customer_phone, customer_address:c.customer_address, customer_email:c.customer_email, customer_tax_id:"", customer_shipping_address:c.customer_address });
  };

  const addItem   = () => setItems(p => [...p, { product_name:"", description:"", qty:1, unit_price:0, discount:0, type:"" }]);
  const delItem   = (i:number) => setItems(p => p.filter((_,idx) => idx !== i));
  const upd       = <K extends keyof Item>(i:number, k:K, v:Item[K]) => { const n=[...items]; n[i][k]=v; setItems(n); };

  const subtotal  = items.reduce((s,i) => s + i.qty * i.unit_price * (1 - i.discount/100), 0);
  const discount  = items.reduce((s,i) => s + i.qty * i.unit_price * (i.discount/100), 0);
  const vat       = vatOn ? subtotal * 0.07 : 0;
  const total     = subtotal + vat;
  const fmt       = (n:number) => n.toLocaleString("en-US",{style:"currency",currency:"USD"});

  const submit = async (saveAs: "draft" | "submit") => {
    if (!customer.customer_name) return alert("Please enter customer name");
    const validItems = items.filter(i => i.product_name);
    if (validItems.length === 0) return alert("Please add at least 1 product");
    try {
      setSaving(true);
      const res = await fetch(`${API}/quotations`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ customer_id:selId, customer, issue_date:date, expiry_date:expiry, items:validItems, status:saveAs==="draft"?"draft":"sent", notes, vat_enabled:vatOn }),
      });
      if (!res.ok) throw new Error();
      router.push("/");
    } catch { alert("Save failed"); } finally { setSaving(false); }
  };

  return (
    <div className="qf-layout">
      <Sidebar />
      <div className="qf-content">
        <Topbar breadcrumbs={["Quotations", "New", "Edit"]} />
        <div className="qf-page">

          {/* ── DOC HEADER ── */}
          <div className="anim-0" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"12px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
              <button
                onClick={() => router.push("/")}
                style={{ background:"none", border:"none", color:"var(--text-secondary)", cursor:"pointer", display:"flex", alignItems:"center", padding:"4px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"20px", fontWeight:700, color:"var(--text-primary)", letterSpacing:"-0.01em" }}>{docNo}</span>
                  <span className="qf-badge badge-draft"><span className="qf-badge-dot"/>DRAFT</span>
                </div>
                <div style={{ fontSize:"12px", color:"var(--text-tertiary)", marginTop:"2px" }}>New Quotation</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:"10px" }}>
              <button className="qf-btn btn-ghost" onClick={() => submit("draft")} disabled={saving}>
                <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Save Draft
              </button>
              <button className="qf-btn btn-primary" onClick={() => submit("submit")} disabled={saving}>
                <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                {saving ? "Saving..." : "Submit"}
                {!saving && <span className="btn-arrow">↗</span>}
              </button>
            </div>
          </div>

          {/* ── DOCUMENT DETAILS ── */}
          <div className="qf-card anim-1" style={{ marginBottom:"16px" }}>
            <div className="qf-card-title">
              <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Document Details
            </div>
            <div className="qf-form-row cols-4">
              <div>
                <label className="qf-label">Document Number</label>
                <input className="qf-input" value={docNo} readOnly style={{ opacity:.65, cursor:"default" }}/>
              </div>
              <div>
                <label className="qf-label">Date</label>
                <input type="date" className="qf-input" value={date} onChange={e => setDate(e.target.value)}/>
              </div>
              <div>
                <label className="qf-label">Expiry Date</label>
                <input type="date" className="qf-input" value={expiry} onChange={e => setExpiry(e.target.value)}/>
              </div>
              <div>
                <label className="qf-label">Status</label>
                <div style={{ position:"relative" }}>
                  <select className="qf-input qf-select" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                  <svg style={{ position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"var(--text-tertiary)", width:"13px", height:"13px" }}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ── CUSTOMER INFORMATION ── */}
          <div className="qf-card anim-2" style={{ marginBottom:"16px" }}>
            <div className="qf-card-title">
              <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Customer Information
            </div>

            {/* Select customer */}
            <div className="qf-form-row cols-2" style={{ marginBottom:"14px" }}>
              <div>
                <label className="qf-label">Customer</label>
                <div style={{ position:"relative" }}>
                  <select className="qf-input qf-select" value={selId ?? ""} onChange={e => selectCustomer(Number(e.target.value))}>
                    <option value="">Select customer...</option>
                    {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>)}
                  </select>
                  <svg style={{ position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"var(--text-tertiary)", width:"13px", height:"13px" }}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
              <div>
                <label className="qf-label">Company</label>
                <input className="qf-input" placeholder="" value={customer.customer_company} onChange={e => setCustomer({...customer, customer_company:e.target.value})}/>
              </div>
            </div>

            <div className="qf-form-row cols-2" style={{ marginBottom:"14px" }}>
              <div>
                <label className="qf-label">Tax ID</label>
                <input className="qf-input" placeholder="" value={customer.customer_tax_id||""} onChange={e => setCustomer({...customer, customer_tax_id:e.target.value})}/>
              </div>
              <div>
                <label className="qf-label">Phone</label>
                <input className="qf-input" placeholder="" value={customer.customer_phone} onChange={e => setCustomer({...customer, customer_phone:e.target.value})}/>
              </div>
            </div>

            <div className="qf-form-row" style={{ marginBottom:"14px" }}>
              <div>
                <label className="qf-label">Email</label>
                <input type="email" className="qf-input" placeholder="" value={customer.customer_email} onChange={e => setCustomer({...customer, customer_email:e.target.value})}/>
              </div>
            </div>

            <div className="qf-form-row cols-2">
              <div>
                <label className="qf-label">Billing Address</label>
                <input className="qf-input" placeholder="" value={customer.customer_address} onChange={e => setCustomer({...customer, customer_address:e.target.value})}/>
              </div>
              <div>
                <label className="qf-label">Shipping Address</label>
                <input className="qf-input" placeholder="" value={customer.customer_shipping_address||""} onChange={e => setCustomer({...customer, customer_shipping_address:e.target.value})}/>
              </div>
            </div>
          </div>

          {/* ── PRODUCTS ── */}
          <div className="qf-card anim-3" style={{ marginBottom:"16px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px", paddingBottom:"12px", borderBottom:"1px solid var(--border-subtle)" }}>
              <span className="qf-card-title" style={{ marginBottom:0, paddingBottom:0, border:"none" }}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                Products
              </span>
              <button className="qf-btn btn-ghost" style={{ padding:"6px 14px", fontSize:"12.5px" }} onClick={addItem}>
                <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Item
              </button>
            </div>

            {items.length === 0 ? (
              <div style={{ padding:"36px", textAlign:"center", color:"var(--text-tertiary)", fontSize:"13.5px" }}>
                No items yet. Click "Add Item" to begin.
              </div>
            ) : (
              <div className="qf-table-wrap">
                <table className="qf-table">
                  <thead>
                    <tr>
                      <th style={{ width:"22%" }}>Product</th>
                      <th style={{ width:"24%" }}>Description</th>
                      <th style={{ width:"8%" }}>Qty</th>
                      <th style={{ width:"13%" }}>Unit Price</th>
                      <th style={{ width:"9%" }}>Discount</th>
                      <th style={{ width:"10%" }}>Type</th>
                      <th className="r" style={{ width:"11%" }}>Line Total</th>
                      <th style={{ width:"3%" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td><input className="qf-input" style={{ padding:"6px 9px", fontSize:"13px" }} value={item.product_name} onChange={e => upd(i,"product_name",e.target.value)}/></td>
                        <td><input className="qf-input" style={{ padding:"6px 9px", fontSize:"13px" }} value={item.description} onChange={e => upd(i,"description",e.target.value)}/></td>
                        <td><input type="number" className="qf-input" style={{ padding:"6px 9px", fontSize:"13px" }} value={item.qty} onChange={e => upd(i,"qty",Number(e.target.value))}/></td>
                        <td><input type="number" className="qf-input" style={{ padding:"6px 9px", fontSize:"13px" }} value={item.unit_price} onChange={e => upd(i,"unit_price",Number(e.target.value))}/></td>
                        <td><input type="number" className="qf-input" style={{ padding:"6px 9px", fontSize:"13px" }} value={item.discount} onChange={e => upd(i,"discount",Number(e.target.value))}/></td>
                        <td>
                          <div style={{ position:"relative" }}>
                            <select className="qf-input qf-select" style={{ padding:"6px 28px 6px 9px", fontSize:"13px" }} value={item.type} onChange={e => upd(i,"type",e.target.value)}>
                              <option value="">—</option>
                              <option value="product">Product</option>
                              <option value="service">Service</option>
                            </select>
                            <svg style={{ position:"absolute", right:"7px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"var(--text-tertiary)", width:"11px", height:"11px" }}
                              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                          </div>
                        </td>
                        <td style={{ textAlign:"right", fontFamily:"'JetBrains Mono',monospace", fontSize:"13px", fontWeight:500, color:"var(--text-primary)" }}>
                          {fmt(item.qty * item.unit_price * (1 - item.discount / 100))}
                        </td>
                        <td>
                          <button
                            onClick={() => delItem(i)}
                            style={{ background:"none", border:"none", color:"var(--text-tertiary)", cursor:"pointer", padding:"4px", borderRadius:"6px", display:"flex", alignItems:"center" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color="var(--red)"; (e.currentTarget as HTMLElement).style.background="var(--red-soft)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color="var(--text-tertiary)"; (e.currentTarget as HTMLElement).style.background="none"; }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── SUMMARY ── */}
          <div className="qf-card anim-4" style={{ marginBottom:"16px" }}>
            <div className="qf-card-title">
              <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Summary
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <div style={{ width:"300px" }}>
                <div className="qf-summary-row"><span>Subtotal</span><span className="qf-summary-val">{fmt(subtotal + discount)}</span></div>
                <div className="qf-summary-row"><span>Discount</span><span className="qf-summary-val" style={{ color:"var(--red)" }}>-{fmt(discount)}</span></div>
                <div className="qf-summary-row">
                  <div className="qf-toggle-wrap">
                    <span>VAT (7%)</span>
                    <button className={`qf-toggle ${vatOn?"on":""}`} onClick={() => setVatOn(v=>!v)}>
                      <div className="qf-toggle-knob"/>
                    </button>
                  </div>
                  <span className="qf-summary-val">{fmt(vat)}</span>
                </div>
                <div className="qf-summary-total">
                  <span className="qf-summary-total-label">Grand Total</span>
                  <span className="qf-summary-total-val">{fmt(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── NOTES ── */}
          <div className="qf-card anim-5" style={{ marginBottom:"16px" }}>
            <div className="qf-card-title">
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Notes
            </div>
            <textarea
              className="qf-input"
              rows={4}
              placeholder="Additional remarks..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ resize:"vertical", lineHeight:"1.6" }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}