"use client";
/* =========================================================
   app/approver/review/[id]/page.tsx
   Review + Approve / Reject Page
   ========================================================= */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Item = {
  product_name: string;
  qty: number;
  unit_price: number;
  discount_percent: number;
};

type Detail = {
  quotation_id: number;
  quotation_no: string;
  customer_name: string;
  customer_company: string;
  issue_date: string;
  expiry_date: string;
  total: number;
  items: Item[];
  submit_note: string;
  submitted_by_name: string;
};

export default function ReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("wisdom-token");
    const role = localStorage.getItem("wisdom-role");

    if (!token || role !== "approver") {
      router.replace("/login");
      return;
    }

    fetch(`${API}/approver/review/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const money = (n: number) =>
    n?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    });

  const handleAction = async (type: "approve" | "reject") => {
    if (type === "reject" && !comment.trim()) {
      alert("ใส่เหตุผลก่อน reject");
      return;
    }

    const ok = confirm(`Confirm ${type}?`);
    if (!ok) return;

    setActionLoading(true);

    const token = localStorage.getItem("wisdom-token");

    await fetch(`${API}/approver/${type}/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });

    setActionLoading(false);
    router.push("/approver");
  };

  if (loading)
    return <p style={{ padding: 40 }}>Loading...</p>;

  if (!data)
    return <p style={{ padding: 40 }}>Not found</p>;

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
      
      {/* HEADER */}
      <h1 style={{ fontSize: "26px", fontWeight: 800 }}>
        {data.quotation_no}
      </h1>
      <p>{data.customer_name} ({data.customer_company})</p>

      {/* INFO */}
      <div style={{ marginTop: "16px" }}>
        <p>Issue: {data.issue_date}</p>
        <p>Expiry: {data.expiry_date}</p>
      </div>

      {/* NOTE */}
      {data.submit_note && (
        <div style={{
          marginTop: "16px",
          padding: "12px",
          border: "1px solid #f59e0b",
          borderRadius: "10px"
        }}>
          <b>Note:</b> {data.submit_note}
        </div>
      )}

      {/* TABLE */}
      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Product</th>
            <th style={th}>Qty</th>
            <th style={th}>Price</th>
            <th style={th}>Discount</th>
            <th style={th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((i, idx) => {
            const total =
              i.qty * i.unit_price * (1 - i.discount_percent / 100);

            return (
              <tr key={idx}>
                <td style={td}>{i.product_name}</td>
                <td style={td}>{i.qty}</td>
                <td style={td}>{money(i.unit_price)}</td>
                <td style={td}>{i.discount_percent}%</td>
                <td style={td}>{money(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* TOTAL */}
      <h2 style={{ marginTop: "20px" }}>
        Total: {money(data.total)}
      </h2>

      {/* COMMENT */}
      <div style={{ marginTop: "20px" }}>
        <textarea
          placeholder="comment (required if reject)"
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      {/* ACTIONS */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => handleAction("approve")}
          disabled={actionLoading}
          style={btnGreen}
        >
          ✅ Approve
        </button>

        <button
          onClick={() => handleAction("reject")}
          disabled={actionLoading}
          style={btnRed}
        >
          ❌ Reject
        </button>

        <button
          onClick={() => router.back()}
          style={btnGray}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

/* styles */
const th = {
  borderBottom: "1px solid #ddd",
  padding: "10px",
  textAlign: "left" as const,
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

const btnGreen = {
  padding: "10px 16px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const btnRed = {
  padding: "10px 16px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const btnGray = {
  padding: "10px 16px",
  background: "#e5e7eb",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};