"use client";
import { useEffect, useState } from "react";

export default function PreviewPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("qt_preview");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) return <div className="p-8">No Data</div>;

  const subtotal = data.items.reduce(
    (sum: number, i: any) =>
      sum + i.qty * i.unit_price * (1 - i.discount / 100),
    0
  );

  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  const createQuotation = async () => {
    const res = await fetch("http://127.0.0.1:4000/quotations", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        customer_id: data.customer.customer_id,
        issue_date: data.issue_date,
        expiry_date: data.expiry_date,
        items: data.items
      })
    });

    const result = await res.json();
    if (!res.ok) return alert(result.error);

    alert("✅ สำเร็จ");
    localStorage.removeItem("qt_preview");
    window.location.href = "/";
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-4">Quotation</h1>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {data.items.map((item: any, i: number) => (
              <tr key={i}>
                <td className="border p-2">{item.product_name}</td>
                <td className="border p-2">{item.qty}</td>
                <td className="border p-2">{item.unit_price}</td>
                <td className="border p-2">
                  {(item.qty * item.unit_price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-4">
          <p>Total: {total.toFixed(2)}</p>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gray-400 text-white px-4 py-2 rounded">
            Save PDF
          </button>

          <button
            onClick={createQuotation}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Quotation
          </button>
        </div>

      </div>
    </div>
  );
}