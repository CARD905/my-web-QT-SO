
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
 
export default function DetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const [data, setData] = useState<any>(null);
  const [editing, setEditing] = useState(false);
 
  useEffect(() => {
  if (!id) return;

  fetch(`${API}/quotations/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("API error");
      return res.json();
    })
    .then(setData)
    .catch(err => {
      console.error(err);
      setData(null);
    });
}, [id]);
 
  if (!data) return <div className="p-10 text-gray-500">Loading...</div>;
 
  const disabled = data.status === "cancel";
 
  const subtotal = data.items.reduce(
    (sum: number, i: any) =>
      sum + i.qty * i.unit_price * (1 - i.discount_percent / 100),
    0
  );
 
  const totalDiscount = data.items.reduce(
    (sum: number, i: any) =>
      sum + i.qty * i.unit_price * (i.discount_percent / 100),
    0
  );
 
  const vat = subtotal * 0.07;
  const total = subtotal + vat;
 
  const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });
 
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed": return { bg: "bg-green-100", text: "text-green-700", label: "Approved" };
      case "cancel": return { bg: "bg-red-100", text: "text-red-600", label: "Cancelled" };
      default: return { bg: "bg-yellow-100", text: "text-yellow-700", label: "Draft" };
    }
  };
 
  const statusStyle = getStatusStyle(data.status);
 
  /* ================= ACTION ================= */
 
  const saveEdit = async () => {
    await fetch(`${API}/quotations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditing(false);
  };
 
  const cancel = async () => {
    await fetch(`${API}/quotations/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancel" }),
    });
    router.push("/");
  };
 
  const confirm = async () => {
    await fetch(`${API}/quotations/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" }),
    });
    router.push(`/sale/${id}`);
  };
 
  return (
    <div className="min-h-screen bg-gray-50">
      {/* BREADCRUMB */}
      <div className="px-8 pt-4 pb-2 text-sm text-gray-400">
        Quotations / {data.quotation_no} / Detail
      </div>
 
      <div className="px-8 pb-10 space-y-5 max-w-5xl">
 
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-800">{data.quotation_no}</h1>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                  {statusStyle.label}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-0.5">Quotation Details</p>
            </div>
          </div>
 
          {!disabled && (
            <div className="flex gap-2">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z" />
                  </svg>
                  Edit
                </button>
              ) : (
                <button
                  onClick={saveEdit}
                  className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </button>
              )}
 
              <button
                onClick={cancel}
                className="flex items-center gap-1.5 bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel Quotation
              </button>
 
              <button
                onClick={confirm}
                className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm Order
              </button>
            </div>
          )}
        </div>
 
        {/* DOCUMENT DETAILS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Document Details</h2>
 
          {editing ? (
            <div className="flex gap-6 flex-wrap">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Issue Date</label>
                <input
                  type="date"
                  value={data.issue_date}
                  onChange={e => setData({ ...data, issue_date: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={data.expiry_date}
                  onChange={e => setData({ ...data, expiry_date: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-400 mb-1">Document Number</p>
                <p className="text-sm font-semibold text-gray-800">{data.quotation_no}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Date</p>
                <p className="text-sm font-semibold text-gray-800">{data.issue_date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Expiry Date</p>
                <p className="text-sm font-semibold text-gray-800">{data.expiry_date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                  {statusStyle.label}
                </span>
              </div>
            </div>
          )}
        </div>
 
        {/* CUSTOMER INFORMATION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Customer Information</h2>
 
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Name</p>
              <p className="text-sm font-semibold text-gray-800">{data.customer_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Company</p>
              <p className="text-sm font-semibold text-gray-800">{data.customer_company}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Email</p>
              <p className="text-sm font-semibold text-gray-800">{data.customer_email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Phone</p>
              <p className="text-sm font-semibold text-gray-800">{data.customer_phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Billing Address</p>
              <p className="text-sm font-semibold text-gray-800">{data.customer_address}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Shipping Address</p>
              <p className="text-sm font-semibold text-gray-800">{data.customer_address}</p>
            </div>
          </div>
        </div>
 
        {/* ITEMS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Items</h2>
 
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-4">Product</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-4">Description</th>
                <th className="text-right text-xs text-gray-400 font-medium pb-3 pr-4">Qty</th>
                <th className="text-right text-xs text-gray-400 font-medium pb-3 pr-4">Unit Price</th>
                <th className="text-right text-xs text-gray-400 font-medium pb-3 pr-4">Discount</th>
                <th className="text-right text-xs text-gray-400 font-medium pb-3">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item: any, idx: number) => {
                const lineTotal = item.qty * item.unit_price * (1 - item.discount_percent / 100);
                const discountAmt = item.qty * item.unit_price * (item.discount_percent / 100);
                return (
                  <tr key={idx} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 pr-4 font-semibold text-gray-800">{item.product_name}</td>
                    <td className="py-4 pr-4 text-gray-400">{item.description || "—"}</td>
                    <td className="py-4 pr-4 text-right text-gray-700">{item.qty}</td>
                    <td className="py-4 pr-4 text-right text-gray-700">{money(item.unit_price)}</td>
                    <td className="py-4 pr-4 text-right text-gray-500">
                      {item.discount_percent
                        ? `${item.discount_percent}%`
                        : money(discountAmt)}
                    </td>
                    <td className="py-4 text-right font-semibold text-gray-800">{money(lineTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
 
        {/* SUMMARY */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Summary</h2>
 
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{money(subtotal + totalDiscount)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Discount</span>
                <span className="text-red-500">-{money(totalDiscount)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>VAT (7%)</span>
                <span>{money(vat)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-800">
                <span>Grand Total</span>
                <span className="text-blue-600 text-base">{money(total)}</span>
              </div>
            </div>
          </div>
        </div>
 
      </div>
    </div>
  );
}