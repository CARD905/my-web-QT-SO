"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SaleOrderPage() {
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
  fetch(`${API}/quotations`)
    .then(res => {
      if (!res.ok) throw new Error("API error");
      return res.json();
    })
    .then(res => {
      const confirmed = res.filter((q: any) => q.status === "confirmed");
      setData(confirmed);
    })
    .catch(err => {
      console.error("Fetch error:", err);
      setData([]);
    });
}, []);

  const money = (n: number) =>
    n?.toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
    });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Sale Orders</h1>

        <button
          onClick={() => router.push("/")}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Back to Quotation
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-500">
            <tr>
              <th className="p-3 text-left">SO No</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-center">Date</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {data.map((q) => (
              <tr
                key={q.quotation_id}
                onClick={() => router.push(`/sale/${q.quotation_id}`)}
                className="border-t hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-3 text-blue-600 font-medium">
                  SO-{q.quotation_id}
                </td>

                <td className="p-3">{q.customer_name}</td>

                <td className="p-3 text-center">
                  {q.issue_date}
                </td>

                <td className="p-3 text-center">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    Confirmed
                  </span>
                </td>

                <td className="p-3 text-right font-semibold">
                  {money(q.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}