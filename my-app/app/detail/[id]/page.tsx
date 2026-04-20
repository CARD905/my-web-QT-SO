
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
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const [data, setData] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/quotations/${id}`)
      .then(res => { if (!res.ok) throw new Error("API error"); return res.json(); })
      .then(setData)
      .catch(err => { console.error(err); setData(null); });
  }, [id]);

  if (!data) return (
    <div style={{ background: "#07070f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9896b8", fontFamily: "Outfit,sans-serif", fontSize: "15px" }}>
      Loading...
    </div>
  );

  const disabled = data.status === "cancel";

  const subtotal = data.items.reduce(
    (sum: number, i: any) => sum + i.qty * i.unit_price * (1 - i.discount_percent / 100), 0
  );
  const totalDiscount = data.items.reduce(
    (sum: number, i: any) => sum + i.qty * i.unit_price * (i.discount_percent / 100), 0
  );
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const statusMap: Record<string, { label: string; cls: string }> = {
    confirmed: { label: "Approved", cls: "badge-confirmed" },
    cancel: { label: "Cancelled", cls: "badge-cancel" },
    sent: { label: "Sent", cls: "badge-sent" },
    draft: { label: "Draft", cls: "badge-draft" },
  };
  const st = statusMap[data.status] ?? statusMap.draft;

  const saveEdit = async () => {
    setActionLoading("save");
    await fetch(`${API}/quotations/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    setEditing(false); setActionLoading(null);
  };

  const doCancel = async () => {
    setActionLoading("cancel");
    await fetch(`${API}/quotations/${id}/status`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "cancel" }),
    });
    setActionLoading(null); router.push("/");
  };

  const doConfirm = async () => {
    setActionLoading("confirm");
    await fetch(`${API}/quotations/${id}/status`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "confirmed" }),
    });
    setActionLoading(null); router.push(`/sale/${id}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

        :root.dark {
          --bg0:#07070f; --bg1:#0f0f1a; --bg2:#15151f; --bg3:#1c1c2a;
          --text1:#f0eeff; --text2:#9896b8; --text3:#555570;
          --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
          --card:rgba(255,255,255,0.04); --input-bg:#15151f;
          --accent:#a78bfa; --accent-dim:rgba(167,139,250,0.15);
          --green:#34d399; --green-bg:rgba(52,211,153,0.1);
          --blue:#60a5fa; --blue-bg:rgba(96,165,250,0.1);
          --red:#f87171; --red-bg:rgba(248,113,113,0.1);
          --gray-bg:rgba(148,163,184,0.1); --gray-text:#94a3b8;
        }
        :root.light {
          --bg0:#f0eeff; --bg1:#ffffff; --bg2:#f7f5ff; --bg3:#ede9fe;
          --text1:#1e1b4b; --text2:#4c4577; --text3:#9088bb;
          --border:rgba(109,40,217,0.1); --border2:rgba(109,40,217,0.18);
          --card:rgba(109,40,217,0.04); --input-bg:#ffffff;
          --accent:#7c3aed; --accent-dim:rgba(124,58,237,0.1);
          --green:#059669; --green-bg:rgba(5,150,105,0.08);
          --blue:#2563eb; --blue-bg:rgba(37,99,235,0.08);
          --red:#dc2626; --red-bg:rgba(220,38,38,0.08);
          --gray-bg:rgba(100,116,139,0.08); --gray-text:#64748b;
        }

        * { box-sizing:border-box; margin:0; padding:0; }
        .dt-app { background:var(--bg0); color:var(--text1); min-height:100vh; font-family:'Outfit',sans-serif; transition:background .3s,color .3s; }

        /* TOPBAR */
        .dt-topbar { display:flex; align-items:center; justify-content:space-between; padding:14px 32px; border-bottom:1px solid var(--border); background:var(--bg1); position:sticky; top:0; z-index:100; }
        .dt-logo { display:flex; align-items:center; gap:10px; }
        .dt-logo-icon { width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg,#a78bfa,#ec4899); display:flex; align-items:center; justify-content:center; }
        .dt-logo-icon svg { width:17px; height:17px; stroke:white; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
        .dt-logo-text { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; letter-spacing:-0.02em; color:var(--text1); }
        .dt-topbar-right { display:flex; align-items:center; gap:12px; }
        .dt-theme-btn { width:52px; height:28px; border-radius:14px; border:1px solid var(--border2); background:var(--bg3); cursor:pointer; position:relative; padding:3px; display:flex; align-items:center; transition:background .3s; }
        .dt-theme-knob { width:22px; height:22px; border-radius:50%; background:linear-gradient(135deg,#a78bfa,#ec4899); transition:transform .35s cubic-bezier(.34,1.56,.64,1); display:flex; align-items:center; justify-content:center; font-size:11px; }
        .light .dt-theme-knob { transform:translateX(24px); }

        /* MAIN */
        .dt-main { padding:28px 32px; max-width:1000px; margin:0 auto; }

        /* BREADCRUMB */
        .dt-breadcrumb { font-size:12px; color:var(--text3); margin-bottom:20px; display:flex; align-items:center; gap:6px; }
        .dt-breadcrumb a { color:var(--accent); cursor:pointer; }
        .dt-breadcrumb a:hover { text-decoration:underline; }

        /* HEADER CARD */
        .dt-header-card {
          background:var(--bg1); border:1px solid var(--border);
          border-radius:18px; padding:22px 28px;
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:16px; flex-wrap:wrap; gap:16px;
          position:relative; overflow:hidden;
        }
        .dt-header-card::before {
          content:''; position:absolute; top:-40px; right:-40px;
          width:180px; height:180px; border-radius:50%;
          background:radial-gradient(circle,rgba(167,139,250,0.1) 0%,transparent 70%);
          pointer-events:none;
        }
        .dt-header-left { display:flex; align-items:center; gap:14px; }
        .dt-back-btn { width:36px; height:36px; border-radius:10px; border:1px solid var(--border); background:none; color:var(--text2); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s,color .15s; }
        .dt-back-btn:hover { background:var(--card); color:var(--text1); }
        .dt-back-btn svg { width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
        .dt-doc-no { font-family:'DM Mono',monospace; font-size:20px; font-weight:500; color:var(--text1); letter-spacing:.01em; }
        .dt-doc-sub { font-size:13px; color:var(--text3); margin-top:3px; }
        .dt-actions { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }

        /* BADGES */
        .dt-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }
        .dt-badge-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }
        .badge-confirmed { background:var(--green-bg); color:var(--green); }
        .badge-confirmed .dt-badge-dot { background:var(--green); }
        .badge-sent { background:var(--blue-bg); color:var(--blue); }
        .badge-sent .dt-badge-dot { background:var(--blue); }
        .badge-draft { background:var(--gray-bg); color:var(--gray-text); }
        .badge-draft .dt-badge-dot { background:var(--gray-text); }
        .badge-cancel { background:var(--red-bg); color:var(--red); }
        .badge-cancel .dt-badge-dot { background:var(--red); }

        /* ACTION BUTTONS */
        .dt-btn { display:flex; align-items:center; gap:6px; padding:8px 16px; border-radius:10px; font-size:13px; font-weight:500; cursor:pointer; border:none; font-family:'Outfit',sans-serif; transition:opacity .15s,transform .15s; }
        .dt-btn:hover { opacity:.88; transform:translateY(-1px); }
        .dt-btn:active { transform:scale(.97); }
        .dt-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
        .dt-btn svg { width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
        .btn-outline { background:none; border:1px solid var(--border2); color:var(--text2); }
        .btn-outline:hover { background:var(--card); color:var(--text1); }
        .btn-cancel { background:var(--red-bg); color:var(--red); }
        .btn-save { background:var(--green-bg); color:var(--green); }

        /* CONFIRM BTN - wow gradient */
        .btn-confirm {
          position:relative; color:white; overflow:hidden;
          background:linear-gradient(120deg,#a855f7 0%,#ec4899 50%,#60a5fa 100%);
          background-size:200% 200%; animation:btnShimmer 4s ease infinite;
          transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,opacity .2s;
        }
        @keyframes btnShimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .btn-confirm:hover { transform:translateY(-2px) scale(1.02)!important; box-shadow:0 6px 24px rgba(168,85,247,.45); opacity:1!important; }
        .btn-confirm::before { content:''; position:absolute; inset:0; background:linear-gradient(120deg,rgba(255,255,255,.2) 0%,transparent 60%); pointer-events:none; }

        /* SECTION CARDS */
        .dt-section { background:var(--bg1); border:1px solid var(--border); border-radius:18px; padding:22px 24px; margin-bottom:14px; }
        .dt-section-title { font-size:10.5px; font-weight:600; color:var(--accent); letter-spacing:.1em; text-transform:uppercase; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
        .dt-section-title::before { content:''; width:3px; height:12px; border-radius:2px; background:linear-gradient(to bottom,#a855f7,#ec4899); display:inline-block; }

        /* DOC DETAILS GRID */
        .dt-doc-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .dt-field-label { font-size:11px; color:var(--text3); margin-bottom:4px; }
        .dt-field-val { font-size:13.5px; font-weight:500; color:var(--text1); }
        .dt-input { width:100%; padding:9px 13px; background:var(--input-bg); border:1px solid var(--border); border-radius:10px; color:var(--text1); font-size:13px; outline:none; font-family:'Outfit',sans-serif; transition:border .2s; }
        .dt-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim); }

        /* CUSTOMER GRID */
        .dt-cust-grid { display:grid; grid-template-columns:1fr 1fr; gap:x:16px; gap-y:12px; gap:16px 20px; }

        /* ITEMS TABLE */
        .dt-table { width:100%; border-collapse:collapse; font-size:13px; }
        .dt-table thead tr { border-bottom:1px solid var(--border); }
        .dt-table th { padding:8px 12px; text-align:left; font-size:10px; font-weight:600; color:var(--accent); letter-spacing:.07em; text-transform:uppercase; }
        .dt-table th.r { text-align:right; }
        .dt-table tbody tr { border-bottom:1px solid var(--border); transition:background .12s; }
        .dt-table tbody tr:last-child { border-bottom:none; }
        .dt-table tbody tr:hover { background:var(--card); }
        .dt-table td { padding:14px 12px; color:var(--text2); }
        .dt-table td.name { color:var(--text1); font-weight:500; }
        .dt-table td.mono { font-family:'DM Mono',monospace; text-align:right; color:var(--text1); }
        .dt-table td.disc { text-align:right; color:var(--text3); font-size:12px; }

        /* SUMMARY */
        .dt-summary-wrap { display:flex; justify-content:flex-end; }
        .dt-summary-box { width:260px; }
        .dt-sum-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; font-size:13.5px; color:var(--text2); border-bottom:1px solid var(--border); }
        .dt-sum-row:last-of-type { border-bottom:none; }
        .dt-sum-val { font-family:'DM Mono',monospace; font-size:13px; }
        .dt-sum-disc { color:var(--red); }
        .dt-sum-total { display:flex; justify-content:space-between; padding:12px 0 0; border-top:1px solid var(--border2); margin-top:4px; }
        .dt-sum-total-label { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:var(--text1); }
        .dt-sum-total-val { font-family:'DM Mono',monospace; font-size:18px; font-weight:700; color:var(--accent); }

        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        .fade-up { animation:fadeUp .4s ease both; }
        .fade-up-1 { animation-delay:.05s; }
        .fade-up-2 { animation-delay:.10s; }
        .fade-up-3 { animation-delay:.15s; }
        .fade-up-4 { animation-delay:.20s; }
        .fade-up-5 { animation-delay:.25s; }
      `}</style>

      <div className={`dt-app ${isDark ? "dark" : "light"}`}>

        {/* TOPBAR */}
        <div className="dt-topbar">
          <div className="dt-logo">
            <div className="dt-logo-icon">
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <span className="dt-logo-text">QuoteFlow</span>
          </div>
          <div className="dt-topbar-right">
            <button className="dt-theme-btn" onClick={() => setIsDark(!isDark)}>
              <div className="dt-theme-knob">{isDark ? "☀" : "🌙"}</div>
            </button>
          </div>
        </div>

        <div className="dt-main">

          {/* BREADCRUMB */}
          <div className="dt-breadcrumb fade-up">
            <a onClick={() => router.push("/")}>Quotations</a>
            <span>›</span>
            <span>{data.quotation_no}</span>
            <span>›</span>
            <span>Detail</span>
          </div>

          {/* HEADER CARD */}
          <div className="dt-header-card fade-up fade-up-1">
            <div className="dt-header-left">
              <button className="dt-back-btn" onClick={() => router.push("/")}>
                <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className="dt-doc-no">{data.quotation_no}</span>
                  <span className={`dt-badge ${st.cls}`}>
                    <span className="dt-badge-dot" />
                    {st.label}
                  </span>
                </div>
                <div className="dt-doc-sub">Quotation Details</div>
              </div>
            </div>

            {!disabled && (
              <div className="dt-actions">
                {!editing ? (
                  <button className="dt-btn btn-outline" onClick={() => setEditing(true)}>
                    <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                ) : (
                  <button className="dt-btn btn-save" onClick={saveEdit} disabled={actionLoading === "save"}>
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {actionLoading === "save" ? "Saving..." : "Save"}
                  </button>
                )}
                <button className="dt-btn btn-cancel" onClick={doCancel} disabled={actionLoading === "cancel"}>
                  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  {actionLoading === "cancel" ? "Cancelling..." : "Cancel"}
                </button>
                <button className="dt-btn btn-confirm" onClick={doConfirm} disabled={actionLoading === "confirm"}>
                  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  {actionLoading === "confirm" ? "Confirming..." : "Confirm Order"}
                </button>
              </div>
            )}
          </div>

          {/* DOCUMENT DETAILS */}
          <div className="dt-section fade-up fade-up-2">
            <div className="dt-section-title">Document Details</div>
            {editing ? (
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "180px" }}>
                  <div className="dt-field-label">Issue Date</div>
                  <input type="date" className="dt-input" value={data.issue_date} onChange={e => setData({ ...data, issue_date: e.target.value })} />
                </div>
                <div style={{ flex: 1, minWidth: "180px" }}>
                  <div className="dt-field-label">Expiry Date</div>
                  <input type="date" className="dt-input" value={data.expiry_date} onChange={e => setData({ ...data, expiry_date: e.target.value })} />
                </div>
              </div>
            ) : (
              <div className="dt-doc-grid">
                <div><div className="dt-field-label">Document Number</div><div className="dt-field-val" style={{ fontFamily: "'DM Mono',monospace" }}>{data.quotation_no}</div></div>
                <div><div className="dt-field-label">Issue Date</div><div className="dt-field-val">{data.issue_date}</div></div>
                <div><div className="dt-field-label">Expiry Date</div><div className="dt-field-val">{data.expiry_date}</div></div>
                <div>
                  <div className="dt-field-label">Status</div>
                  <span className={`dt-badge ${st.cls}`} style={{ marginTop: "4px" }}><span className="dt-badge-dot" />{st.label}</span>
                </div>
              </div>
            )}
          </div>

          {/* CUSTOMER */}
          <div className="dt-section fade-up fade-up-3">
            <div className="dt-section-title">Customer Information</div>
            <div className="dt-cust-grid">
              <div><div className="dt-field-label">Name</div><div className="dt-field-val">{data.customer_name}</div></div>
              <div><div className="dt-field-label">Company</div><div className="dt-field-val">{data.customer_company || "—"}</div></div>
              <div><div className="dt-field-label">Email</div><div className="dt-field-val">{data.customer_email || "—"}</div></div>
              <div><div className="dt-field-label">Phone</div><div className="dt-field-val">{data.customer_phone || "—"}</div></div>
              <div><div className="dt-field-label">Billing Address</div><div className="dt-field-val">{data.customer_address || "—"}</div></div>
              <div><div className="dt-field-label">Shipping Address</div><div className="dt-field-val">{data.customer_address || "—"}</div></div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="dt-section fade-up fade-up-4">
            <div className="dt-section-title">Items</div>
            <table className="dt-table">
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
                {data.items.map((item: any, idx: number) => {
                  const lineTotal = item.qty * item.unit_price * (1 - item.discount_percent / 100);
                  const discAmt = item.qty * item.unit_price * (item.discount_percent / 100);
                  return (
                    <tr key={idx}>
                      <td className="name">{item.product_name}</td>
                      <td>{item.description || "—"}</td>
                      <td className="mono">{item.qty}</td>
                      <td className="mono">{money(item.unit_price)}</td>
                      <td className="disc">{item.discount_percent ? `${item.discount_percent}%` : money(discAmt)}</td>
                      <td className="mono">{money(lineTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* SUMMARY */}
          <div className="dt-section fade-up fade-up-5">
            <div className="dt-section-title">Summary</div>
            <div className="dt-summary-wrap">
              <div className="dt-summary-box">
                <div className="dt-sum-row"><span>Subtotal</span><span className="dt-sum-val">{money(subtotal + totalDiscount)}</span></div>
                <div className="dt-sum-row"><span>Discount</span><span className={`dt-sum-val dt-sum-disc`}>−{money(totalDiscount)}</span></div>
                <div className="dt-sum-row"><span>VAT (7%)</span><span className="dt-sum-val">{money(vat)}</span></div>
                <div className="dt-sum-total">
                  <span className="dt-sum-total-label">Grand Total</span>
                  <span className="dt-sum-total-val">{money(total)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}