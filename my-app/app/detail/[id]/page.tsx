
// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
 
// export default function DetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const API = process.env.NEXT_PUBLIC_API_URL || "";
//   const [data, setData] = useState<any>(null);
//   const [editing, setEditing] = useState(false);
 
//   useEffect(() => {
//   if (!id) return;

//   fetch(`${API}/quotations/${id}`)
//     .then(res => {
//       if (!res.ok) throw new Error("API error");
//       return res.json();
//     })
//     .then(setData)
//     .catch(err => {
//       console.error(err);
//       setData(null);
//     });
// }, [id]);
 
//   if (!data) return <div className="p-10 text-gray-500">Loading...</div>;
 
//   const disabled = data.status === "cancel";
 
//   const subtotal = data.items.reduce(
//     (sum: number, i: any) =>
//       sum + i.qty * i.unit_price * (1 - i.discount_percent / 100),
//     0
//   );
 
//   const totalDiscount = data.items.reduce(
//     (sum: number, i: any) =>
//       sum + i.qty * i.unit_price * (i.discount_percent / 100),
//     0
//   );
 
//   const vat = subtotal * 0.07;
//   const total = subtotal + vat;
 
//   const money = (n: number) =>
//     n.toLocaleString("en-US", { style: "currency", currency: "USD" });
 
//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case "confirmed": return { bg: "bg-green-100", text: "text-green-700", label: "Approved" };
//       case "cancel": return { bg: "bg-red-100", text: "text-red-600", label: "Cancelled" };
//       default: return { bg: "bg-yellow-100", text: "text-yellow-700", label: "Draft" };
//     }
//   };
 
//   const statusStyle = getStatusStyle(data.status);
 
//   /* ================= ACTION ================= */
 
//   const saveEdit = async () => {
//     await fetch(`${API}/quotations/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     setEditing(false);
//   };
 
//   const cancel = async () => {
//     await fetch(`${API}/quotations/${id}/status`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status: "cancel" }),
//     });
//     router.push("/");
//   };
 
//   const confirm = async () => {
//     await fetch(`${API}/quotations/${id}/status`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status: "confirmed" }),
//     });
//     router.push(`/sale/${id}`);
//   };
 
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* BREADCRUMB */}
//       <div className="px-8 pt-4 pb-2 text-sm text-gray-400">
//         Quotations / {data.quotation_no} / Detail
//       </div>
 
//       <div className="px-8 pb-10 space-y-5 max-w-5xl">
 
//         {/* HEADER */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => router.push("/")}
//               className="text-gray-400 hover:text-gray-600 transition"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <div>
//               <div className="flex items-center gap-3">
//                 <h1 className="text-xl font-bold text-gray-800">{data.quotation_no}</h1>
//                 <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
//                   {statusStyle.label}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-400 mt-0.5">Quotation Details</p>
//             </div>
//           </div>
 
//           {!disabled && (
//             <div className="flex gap-2">
//               {!editing ? (
//                 <button
//                   onClick={() => setEditing(true)}
//                   className="flex items-center gap-1.5 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z" />
//                   </svg>
//                   Edit
//                 </button>
//               ) : (
//                 <button
//                   onClick={saveEdit}
//                   className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   Save
//                 </button>
//               )}
 
//               <button
//                 onClick={cancel}
//                 className="flex items-center gap-1.5 bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//                 Cancel Quotation
//               </button>
 
//               <button
//                 onClick={confirm}
//                 className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//                 Confirm Order
//               </button>
//             </div>
//           )}
//         </div>
 
//         {/* DOCUMENT DETAILS */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//           <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Document Details</h2>
 
//           {editing ? (
//             <div className="flex gap-6 flex-wrap">
//               <div>
//                 <label className="text-xs text-gray-400 block mb-1">Issue Date</label>
//                 <input
//                   type="date"
//                   value={data.issue_date}
//                   onChange={e => setData({ ...data, issue_date: e.target.value })}
//                   className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
//                 />
//               </div>
//               <div>
//                 <label className="text-xs text-gray-400 block mb-1">Expiry Date</label>
//                 <input
//                   type="date"
//                   value={data.expiry_date}
//                   onChange={e => setData({ ...data, expiry_date: e.target.value })}
//                   className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
//                 />
//               </div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-4 gap-6">
//               <div>
//                 <p className="text-xs text-gray-400 mb-1">Document Number</p>
//                 <p className="text-sm font-semibold text-gray-800">{data.quotation_no}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-400 mb-1">Date</p>
//                 <p className="text-sm font-semibold text-gray-800">{data.issue_date}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-400 mb-1">Expiry Date</p>
//                 <p className="text-sm font-semibold text-gray-800">{data.expiry_date}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-400 mb-1">Status</p>
//                 <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
//                   {statusStyle.label}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>
 
//         {/* CUSTOMER INFORMATION */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//           <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Customer Information</h2>
 
//           <div className="grid grid-cols-2 gap-x-12 gap-y-4">
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Name</p>
//               <p className="text-sm font-semibold text-gray-800">{data.customer_name}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Company</p>
//               <p className="text-sm font-semibold text-gray-800">{data.customer_company}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Email</p>
//               <p className="text-sm font-semibold text-gray-800">{data.customer_email}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Phone</p>
//               <p className="text-sm font-semibold text-gray-800">{data.customer_phone}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Billing Address</p>
//               <p className="text-sm font-semibold text-gray-800">{data.customer_address}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Shipping Address</p>
//               <p className="text-sm font-semibold text-gray-800">{data.customer_address}</p>
//             </div>
//           </div>
//         </div>
 
//         {/* ITEMS */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//           <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Items</h2>
 
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-gray-100">
//                 <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-4">Product</th>
//                 <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-4">Description</th>
//                 <th className="text-right text-xs text-gray-400 font-medium pb-3 pr-4">Qty</th>
//                 <th className="text-right text-xs text-gray-400 font-medium pb-3 pr-4">Unit Price</th>
//                 <th className="text-right text-xs text-gray-400 font-medium pb-3 pr-4">Discount</th>
//                 <th className="text-right text-xs text-gray-400 font-medium pb-3">Line Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.items.map((item: any, idx: number) => {
//                 const lineTotal = item.qty * item.unit_price * (1 - item.discount_percent / 100);
//                 const discountAmt = item.qty * item.unit_price * (item.discount_percent / 100);
//                 return (
//                   <tr key={idx} className="border-b border-gray-50 last:border-0">
//                     <td className="py-4 pr-4 font-semibold text-gray-800">{item.product_name}</td>
//                     <td className="py-4 pr-4 text-gray-400">{item.description || "—"}</td>
//                     <td className="py-4 pr-4 text-right text-gray-700">{item.qty}</td>
//                     <td className="py-4 pr-4 text-right text-gray-700">{money(item.unit_price)}</td>
//                     <td className="py-4 pr-4 text-right text-gray-500">
//                       {item.discount_percent
//                         ? `${item.discount_percent}%`
//                         : money(discountAmt)}
//                     </td>
//                     <td className="py-4 text-right font-semibold text-gray-800">{money(lineTotal)}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
 
//         {/* SUMMARY */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//           <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Summary</h2>
 
//           <div className="flex justify-end">
//             <div className="w-64 space-y-2 text-sm">
//               <div className="flex justify-between text-gray-500">
//                 <span>Subtotal</span>
//                 <span>{money(subtotal + totalDiscount)}</span>
//               </div>
//               <div className="flex justify-between text-gray-500">
//                 <span>Discount</span>
//                 <span className="text-red-500">-{money(totalDiscount)}</span>
//               </div>
//               <div className="flex justify-between text-gray-500">
//                 <span>VAT (7%)</span>
//                 <span>{money(vat)}</span>
//               </div>
//               <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-800">
//                 <span>Grand Total</span>
//                 <span className="text-blue-600 text-base">{money(total)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
 
//       </div>
//     </div>
//   );
// }
// page3-detail.tsx  →  app/detail/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar, Topbar } from "../../layout-components";

export default function DetailPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const API       = process.env.NEXT_PUBLIC_API_URL || "";
  const [data, setData]   = useState<any>(null);
  const [editing, setEd]  = useState(false);
  const [actLoad, setAL]  = useState<string|null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/quotations/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setData).catch(() => setData(null));
  }, [id]);

  if (!data) return (
    <div className="qf-layout">
      <Sidebar />
      <div className="qf-content">
        <Topbar breadcrumbs={["Quotations", "Detail"]} />
        <div className="qf-page" style={{ display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text-tertiary)", fontSize:"13.5px" }}>Loading...</div>
      </div>
    </div>
  );

  const disabled   = data.status === "cancel";
  const subtotal   = data.items.reduce((s:number,i:any) => s + i.qty*i.unit_price*(1-i.discount_percent/100), 0);
  const totalDisc  = data.items.reduce((s:number,i:any) => s + i.qty*i.unit_price*(i.discount_percent/100), 0);
  const vat        = subtotal * 0.07;
  const total      = subtotal + vat;
  const fmt        = (n:number) => n.toLocaleString("en-US",{style:"currency",currency:"USD"});

  const statusMap: Record<string, { label:string; cls:string }> = {
    confirmed: { label:"APPROVED",   cls:"badge-confirmed" },
    cancel:    { label:"CANCELLED",  cls:"badge-cancel" },
    sent:      { label:"SENT",       cls:"badge-sent" },
    draft:     { label:"DRAFT",      cls:"badge-draft" },
  };
  const st = statusMap[data.status] ?? statusMap.draft;

  const saveEdit = async () => {
    setAL("save");
    try {
      await fetch(`${API}/quotations/${id}`,{ method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
      setEd(false);
    } finally { setAL(null); }
  };

  const doCancel = async () => {
    if (!confirm("Cancel this quotation?")) return;
    setAL("cancel");
    try {
      await fetch(`${API}/quotations/${id}/status`,{ method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({status:"cancel"}) });
      router.push("/");
    } finally { setAL(null); }
  };

  const doConfirm = async () => {
    setAL("confirm");
    try {
      await fetch(`${API}/quotations/${id}/status`,{ method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({status:"confirmed"}) });
      router.push(`/sale/${id}`);
    } finally { setAL(null); }
  };

  return (
    <div className="qf-layout">
      <Sidebar />
      <div className="qf-content">
        <Topbar breadcrumbs={["Quotations", data.quotation_no, "Detail"]} />
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
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"20px", fontWeight:700, color:"var(--text-primary)", letterSpacing:"-0.01em" }}>
                    {data.quotation_no}
                  </span>
                  <span className={`qf-badge ${st.cls}`}><span className="qf-badge-dot"/>{st.label}</span>
                </div>
                <div style={{ fontSize:"12px", color:"var(--text-tertiary)", marginTop:"2px" }}>Quotation Details</div>
              </div>
            </div>

            {!disabled && (
              <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                {!editing ? (
                  <button className="qf-btn btn-ghost" onClick={() => setEd(true)}>
                    <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                ) : (
                  <button className="qf-btn btn-success" onClick={saveEdit} disabled={actLoad==="save"}>
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {actLoad==="save" ? "Saving..." : "Save"}
                  </button>
                )}
                <button className="qf-btn btn-danger" onClick={doCancel} disabled={actLoad==="cancel"}>
                  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  {actLoad==="cancel" ? "Cancelling..." : "Cancel"}
                </button>
                <button className="qf-btn btn-primary" onClick={doConfirm} disabled={actLoad==="confirm"}>
                  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  {actLoad==="confirm" ? "Confirming..." : "Confirm Order"}
                  {actLoad!=="confirm" && <span className="btn-arrow">↗</span>}
                </button>
              </div>
            )}
          </div>

          {/* ── DOCUMENT DETAILS ── */}
          <div className="qf-card anim-1" style={{ marginBottom:"14px" }}>
            <div className="qf-card-title">
              <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Document Details
            </div>
            {editing ? (
              <div className="qf-form-row cols-2">
                <div>
                  <label className="qf-label">Issue Date</label>
                  <input type="date" className="qf-input" value={data.issue_date} onChange={e => setData({...data, issue_date:e.target.value})}/>
                </div>
                <div>
                  <label className="qf-label">Expiry Date</label>
                  <input type="date" className="qf-input" value={data.expiry_date} onChange={e => setData({...data, expiry_date:e.target.value})}/>
                </div>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px" }}>
                {[
                  { label:"Document Number", val: <span style={{ fontFamily:"'JetBrains Mono',monospace" }}>{data.quotation_no}</span> },
                  { label:"Issue Date", val: data.issue_date },
                  { label:"Expiry Date", val: data.expiry_date },
                  { label:"Status", val: <span className={`qf-badge ${st.cls}`}><span className="qf-badge-dot"/>{st.label}</span> },
                ].map((f,i) => (
                  <div key={i}>
                    <div style={{ fontSize:"11px", fontWeight:600, color:"var(--text-tertiary)", letterSpacing:"0.03em", marginBottom:"5px" }}>{f.label}</div>
                    <div style={{ fontSize:"13.5px", fontWeight:500, color:"var(--text-primary)" }}>{f.val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── CUSTOMER ── */}
          <div className="qf-card anim-2" style={{ marginBottom:"14px" }}>
            <div className="qf-card-title">
              <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Customer Information
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px 24px" }}>
              {[
                { label:"Name", val:data.customer_name },
                { label:"Company", val:data.customer_company||"—" },
                { label:"Email", val:data.customer_email||"—" },
                { label:"Phone", val:data.customer_phone||"—" },
                { label:"Billing Address", val:data.customer_address||"—" },
                { label:"Shipping Address", val:data.customer_address||"—" },
              ].map((f,i) => (
                <div key={i}>
                  <div style={{ fontSize:"11px", fontWeight:600, color:"var(--text-tertiary)", letterSpacing:"0.03em", marginBottom:"4px" }}>{f.label}</div>
                  <div style={{ fontSize:"13.5px", fontWeight:500, color:"var(--text-primary)" }}>{f.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── ITEMS ── */}
          <div className="qf-card anim-3" style={{ marginBottom:"14px" }}>
            <div className="qf-card-title">
              <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              Items
            </div>
            <div className="qf-table-wrap">
              <table className="qf-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Description</th>
                    <th className="r">Qty</th>
                    <th className="r">Unit Price</th>
                    <th className="r">Discount</th>
                    <th className="r">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item:any, idx:number) => {
                    const lineTotal = item.qty * item.unit_price * (1 - item.discount_percent/100);
                    const discAmt   = item.qty * item.unit_price * (item.discount_percent/100);
                    return (
                      <tr key={idx}>
                        <td className="primary">{item.product_name}</td>
                        <td>{item.description||"—"}</td>
                        <td className="r">{item.qty}</td>
                        <td className="r mono">{fmt(item.unit_price)}</td>
                        <td className="r" style={{ color:"var(--text-tertiary)", fontSize:"12px" }}>
                          {item.discount_percent ? `${item.discount_percent}%` : fmt(discAmt)}
                        </td>
                        <td className="r mono" style={{ fontWeight:500, color:"var(--text-primary)" }}>{fmt(lineTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── SUMMARY ── */}
          <div className="qf-card anim-4">
            <div className="qf-card-title">
              <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Summary
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <div style={{ width:"280px" }}>
                <div className="qf-summary-row"><span>Subtotal</span><span className="qf-summary-val">{fmt(subtotal+totalDisc)}</span></div>
                <div className="qf-summary-row"><span>Discount</span><span className="qf-summary-val" style={{ color:"var(--red)" }}>−{fmt(totalDisc)}</span></div>
                <div className="qf-summary-row"><span>VAT (7%)</span><span className="qf-summary-val">{fmt(vat)}</span></div>
                <div className="qf-summary-total">
                  <span className="qf-summary-total-label">Grand Total</span>
                  <span className="qf-summary-total-val">{fmt(total)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}