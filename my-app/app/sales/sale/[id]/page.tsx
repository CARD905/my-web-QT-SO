"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SaleOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || "";

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

  if (!data) return <div className="p-10">Loading...</div>;

  /* ================= CALC ================= */
  const subtotal = data.items.reduce(
    (sum: number, i: any) =>
      sum + i.qty * i.unit_price * (1 - i.discount_percent / 100),
    0
  );

  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  const money = (n: number) =>
    n.toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
    });

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-xl p-10 space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-start border-b pb-6">
          <div>
            <h1 className="text-2xl font-bold">SALE ORDER</h1>
            <p className="text-gray-400">Enterprise Sales System</p>
          </div>

          <div className="text-right text-sm">
            <p><b>SO No:</b> SO-{data.quotation_id}</p>
            <p><b>Quotation No:</b> {data.quotation_no}</p>
            <p><b>Date:</b> {data.issue_date}</p>
          </div>
        </div>

        {/* ================= CUSTOMER ================= */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-2 text-gray-600">
              Bill To
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{data.customer_name}</p>
              <p>{data.customer_company}</p>
              <p>{data.customer_address}</p>
              <p>{data.customer_phone}</p>
              <p>{data.customer_email}</p>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-gray-600">
              Document Details
            </h2>
            <div className="text-sm space-y-1">
              <p><b>Issue Date:</b> {data.issue_date}</p>
              <p><b>Expiry Date:</b> {data.expiry_date}</p>
              <p><b>Status:</b> {data.status || "draft"}</p>
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div>
          <table className="w-full border rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-center">Disc %</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {data.items.map((i: any, idx: number) => {
                const rowTotal =
                  i.qty * i.unit_price * (1 - i.discount_percent / 100);

                return (
                  <tr key={idx} className="border-t">
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3">{i.product_name}</td>
                    <td className="p-3">{i.description}</td>
                    <td className="p-3 text-center">{i.qty}</td>
                    <td className="p-3 text-right">
                      {money(i.unit_price)}
                    </td>
                    <td className="p-3 text-center">
                      {i.discount_percent}%
                    </td>
                    <td className="p-3 text-right font-medium">
                      {money(rowTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="flex justify-end">
          <div className="w-80 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>VAT 7%</span>
              <span>{money(vat)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold border-t pt-2 text-blue-600">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex justify-between items-center pt-6 border-t">
          <p className="text-sm text-gray-400">
            * This document is system generated
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/")}
              className="bg-gray-500 text-white px-5 py-2 rounded-lg"
            >
              Back
            </button>

            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
              Save PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}