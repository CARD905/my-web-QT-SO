
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
import { SidebarLayout } from "@/components/SidebarLayout";

const inputStyle: React.CSSProperties = {
  padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "10px",
  fontSize: "13.5px", background: "var(--input-bg)", color: "var(--text-primary)",
  outline: "none", fontFamily: "var(--font-body)", transition: "border-color 0.2s, box-shadow 0.2s",
};
const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "var(--border-hover)";
  e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
};
const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "var(--border)";
  e.target.style.boxShadow = "none";
};

function InfoField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{children}</p>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{
      background: "var(--bg-card)", borderRadius: "14px",
      border: "1px solid var(--border)", padding: "24px",
      backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)",
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: "var(--font-display)", fontSize: "10.5px", fontWeight: 700,
      color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "20px",
      display: "flex", alignItems: "center", gap: "8px",
    }}>
      {icon}
      {children}
    </h2>
  );
}

export default function DetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const [data, setData] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/quotations/${id}`)
      .then(res => { if (!res.ok) throw new Error("API error"); return res.json(); })
      .then(setData)
      .catch(() => setData(null));
  }, [id]);

  if (!data) return (
    <SidebarLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px", height: "40px", margin: "0 auto 16px",
            border: "3px solid var(--border)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin-slow 0.8s linear infinite",
          }} />
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading...</p>
        </div>
      </div>
    </SidebarLayout>
  );

  const disabled = data.status === "cancel";

  const subtotal = data.items.reduce((s: number, i: any) => s + i.qty * i.unit_price * (1 - i.discount_percent / 100), 0);
  const totalDiscount = data.items.reduce((s: number, i: any) => s + i.qty * i.unit_price * (i.discount_percent / 100), 0);
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const statusMap: Record<string, { label: string; bg: string; color: string; dot: string }> = {
    confirmed: { label: "Approved", bg: "rgba(34,197,94,0.12)", color: "#22c55e", dot: "#22c55e" },
    cancel:    { label: "Cancelled", bg: "rgba(239,68,68,0.12)", color: "#f87171", dot: "#f87171" },
    sent:      { label: "Sent", bg: "rgba(99,102,241,0.12)", color: "#818cf8", dot: "#818cf8" },
    draft:     { label: "Draft", bg: "rgba(148,163,184,0.1)", color: "#94a3b8", dot: "#94a3b8" },
  };
  const st = statusMap[data.status] ?? statusMap["draft"];

  const saveEdit = async () => {
    await fetch(`${API}/quotations/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    setEditing(false);
  };

  const cancel = async () => {
    await fetch(`${API}/quotations/${id}/status`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancel" }),
    });
    router.push("/quotations");
  };

  const confirm = async () => {
    await fetch(`${API}/quotations/${id}/status`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" }),
    });
    router.push(`/sale/${id}`);
  };

  return (
    <SidebarLayout>
      <div style={{ padding: "32px 36px 60px", maxWidth: "960px" }}>

        {/* Breadcrumb */}
        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px", fontSize: "12.5px", color: "var(--text-muted)" }}>
          <button onClick={() => router.push("/quotations")} style={{
            background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
            fontFamily: "var(--font-body)", fontSize: "12.5px",
            display: "flex", alignItems: "center", gap: "4px", padding: 0,
            transition: "color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Quotations
          </button>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{data.quotation_no}</span>
          <span style={{ color: "var(--border)" }}>/</span>
          <span>Detail</span>
        </div>

        {/* ---- HEADER CARD ---- */}
        <Card className="fade-up">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(219,39,119,0.15))",
                border: "1px solid rgba(124,58,237,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h1 style={{
                    fontFamily: "var(--font-mono)", fontSize: "18px", fontWeight: 700,
                    color: "var(--text-primary)", letterSpacing: "0.01em",
                  }}>{data.quotation_no}</h1>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    background: st.bg, color: st.color,
                    padding: "4px 11px", borderRadius: "20px",
                    fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.04em",
                    border: `1px solid ${st.color}30`,
                  }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.dot, boxShadow: `0 0 6px ${st.dot}` }} />
                    {st.label}
                  </span>
                </div>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>Quotation Details</p>
              </div>
            </div>

            {!disabled && (
              <div style={{ display: "flex", gap: "8px" }}>
                {!editing ? (
                  <ActionBtn onClick={() => setEditing(true)} variant="outline">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z" />
                    </svg>
                    Edit
                  </ActionBtn>
                ) : (
                  <ActionBtn onClick={saveEdit} variant="success">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Save
                  </ActionBtn>
                )}
                <ActionBtn onClick={cancel} variant="danger">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </ActionBtn>
                <ActionBtn onClick={confirm} variant="primary">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm Order
                </ActionBtn>
              </div>
            )}
          </div>
        </Card>

        {/* ---- DOCUMENT DETAILS ---- */}
        <div className="fade-up fade-up-1" style={{ marginTop: "16px" }}>
          <Card>
            <SectionTitle icon={<DocIcon />}>DOCUMENT DETAILS</SectionTitle>
            {editing ? (
              <div style={{ display: "flex", gap: "20px" }}>
                {[
                  { label: "Issue Date", key: "issue_date" as const },
                  { label: "Expiry Date", key: "expiry_date" as const },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "5px", letterSpacing: "0.04em" }}>{f.label.toUpperCase()}</label>
                    <input type="date" value={data[f.key]}
                      onChange={e => setData({ ...data, [f.key]: e.target.value })}
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
                <InfoField label="DOCUMENT NUMBER">{data.quotation_no}</InfoField>
                <InfoField label="DATE">{data.issue_date}</InfoField>
                <InfoField label="EXPIRY DATE">{data.expiry_date}</InfoField>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: "6px" }}>STATUS</p>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    background: st.bg, color: st.color,
                    padding: "4px 10px", borderRadius: "20px",
                    fontSize: "11.5px", fontWeight: 700,
                    border: `1px solid ${st.color}30`,
                  }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.dot, boxShadow: `0 0 6px ${st.dot}` }} />
                    {st.label}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ---- CUSTOMER INFO ---- */}
        <div className="fade-up fade-up-2" style={{ marginTop: "16px" }}>
          <Card>
            <SectionTitle icon={<UserIcon />}>CUSTOMER INFORMATION</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 48px" }}>
              {[
                { label: "NAME", value: data.customer_name },
                { label: "COMPANY", value: data.customer_company },
                { label: "EMAIL", value: data.customer_email },
                { label: "PHONE", value: data.customer_phone },
                { label: "BILLING ADDRESS", value: data.customer_address },
                { label: "SHIPPING ADDRESS", value: data.customer_address },
              ].map(f => (
                <InfoField key={f.label} label={f.label}>{f.value || "—"}</InfoField>
              ))}
            </div>
          </Card>
        </div>

        {/* ---- ITEMS ---- */}
        <div className="fade-up fade-up-2" style={{ marginTop: "16px" }}>
          <Card>
            <SectionTitle icon={<BoxIcon />}>ITEMS</SectionTitle>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Product", "Description", "Qty", "Unit Price", "Discount", "Line Total"].map((h, i) => (
                    <th key={h} style={{
                      padding: "8px 12px", textAlign: i >= 2 ? "right" : "left",
                      fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)",
                      letterSpacing: "0.06em", paddingBottom: "12px",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((item: any, idx: number) => {
                  const lineTotal = item.qty * item.unit_price * (1 - item.discount_percent / 100);
                  const discountAmt = item.qty * item.unit_price * (item.discount_percent / 100);
                  return (
                    <tr key={idx} style={{ borderBottom: idx < data.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "14px 12px", fontWeight: 600, color: "var(--text-primary)" }}>{item.product_name}</td>
                      <td style={{ padding: "14px 12px", color: "var(--text-muted)", fontSize: "13px" }}>{item.description || "—"}</td>
                      <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-secondary)" }}>{item.qty}</td>
                      <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{money(item.unit_price)}</td>
                      <td style={{ padding: "14px 12px", textAlign: "right", color: "#f87171", fontWeight: 600 }}>
                        {item.discount_percent ? `-${item.discount_percent}%` : money(discountAmt)}
                      </td>
                      <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{money(lineTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>

        {/* ---- SUMMARY ---- */}
        <div className="fade-up fade-up-3" style={{ marginTop: "16px" }}>
          <Card>
            <SectionTitle icon={<ChartIcon />}>SUMMARY</SectionTitle>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: "280px" }}>
                {[
                  { label: "Subtotal", value: money(subtotal + totalDiscount), color: "var(--text-secondary)" },
                  { label: "Discount", value: `-${money(totalDiscount)}`, color: "#f87171" },
                  { label: "VAT (7%)", value: money(vat), color: "var(--text-secondary)" },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>{row.label}</span>
                    <span style={{ fontSize: "13.5px", color: row.color, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{row.value}</span>
                  </div>
                ))}
                <div style={{
                  borderTop: "1px solid var(--border)", paddingTop: "12px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Grand Total</span>
                  <span style={{
                    fontSize: "20px", fontWeight: 900, fontFamily: "var(--font-mono)",
                    background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>{money(total)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </SidebarLayout>
  );
}

/* ---- Icon helpers ---- */
function DocIcon() {
  return <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
  </svg>;
}
function UserIcon() {
  return <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>;
}
function BoxIcon() {
  return <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>;
}
function ChartIcon() {
  return <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>;
}

function ActionBtn({ onClick, variant, children }: { onClick: () => void; variant: string; children: React.ReactNode }) {
  const styles: Record<string, React.CSSProperties> = {
    outline: { background: "var(--bg-card-hover)", color: "var(--text-primary)", border: "1px solid var(--border)" },
    success: { background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" },
    danger:  { background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" },
    primary: { background: "linear-gradient(135deg, #7c3aed, #db2777)", color: "white", border: "none", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" },
  };
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "6px",
        padding: "8px 16px", borderRadius: "10px",
        fontSize: "13px", fontWeight: 700,
        fontFamily: "var(--font-body)", cursor: "pointer",
        transition: "all 0.2s ease",
        ...styles[variant],
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
    >
      {children}
    </button>
  );
}