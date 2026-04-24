"use client";
/* ================================================================
   app/approver/review/[id]/page.tsx
   - Shows full quotation detail (read-only)
   - Approve / Reject / Cancel with required comment
   - Live comment thread
   ================================================================ */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Comment = {
  comment_id: number;
  author_role: "sale" | "approver";
  author_id: number;
  message: string;
  created_at: string;
  author_name?: string;
};

type QuotationDetail = {
  quotation_id: number;
  quotation_no: string;
  customer_name: string;
  customer_company: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  issue_date: string;
  expiry_date: string;
  subtotal: number;
  discount_amt: number;
  vat_amt: number;
  total: number;
  status: string;
  created_by_name: string;
  submit_note: string;
  review_note: string;
  request_id: number;
  approval_status: string;
  items: {
    item_id: number;
    product_name: string;
    description: string;
    qty: number;
    unit_price: number;
    discount_percent: number;
    line_total: number;
  }[];
  comments: Comment[];
};

const ACTION_STYLES = {
  approved: { bg: "linear-gradient(135deg,#059669,#047857)", shadow: "rgba(5,150,105,0.4)", label: "✅ Approve Quotation" },
  rejected: { bg: "linear-gradient(135deg,#dc2626,#b91c1c)", shadow: "rgba(220,38,38,0.4)", label: "❌ Reject Quotation" },
  cancelled:{ bg: "linear-gradient(135deg,#64748b,#475569)", shadow: "rgba(100,116,139,0.3)", label: "🚫 Cancel Quotation" },
};

export default function ApproverReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  const [data, setData] = useState<QuotationDetail | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* decision modal state */
  const [modalAction, setModalAction] = useState<"approved"|"rejected"|"cancelled"|null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* new comment */
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("wisdom-token");
    const role  = localStorage.getItem("wisdom-role");
    const u     = localStorage.getItem("wisdom-user");
    if (!token || role !== "approver") { router.replace("/login"); return; }
    setUser(u ? JSON.parse(u) : null);

    fetch(`${API}/approver/quotations/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const token = () => localStorage.getItem("wisdom-token") || "";
  const money = (n: number) => n?.toLocaleString("en-US", { style: "currency", currency: "USD" }) ?? "—";

  const submitDecision = async () => {
    if (!modalAction) return;
    if ((modalAction === "rejected" || modalAction === "cancelled") && !comment.trim()) {
      alert("Please add a comment explaining your decision."); return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/approver/quotations/${id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ action: modalAction, comment: comment.trim() }),
      });
      if (!res.ok) throw new Error();
      setModalAction(null);
      setComment("");
      router.push("/approver");
    } catch { alert("Failed to submit decision. Please try again."); }
    finally { setSubmitting(false); }
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    setPostingComment(true);
    try {
      const res = await fetch(`${API}/approver/quotations/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ message: newComment.trim() }),
      });
      if (!res.ok) throw new Error();
      const added = await res.json();
      setData(prev => prev ? { ...prev, comments: [...(prev.comments || []), { ...added, author_name: user?.full_name, author_role: "approver" }] } : prev);
      setNewComment("");
    } catch { alert("Failed to post comment."); }
    finally { setPostingComment(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "10px",
    fontSize: "13.5px", background: "var(--input-bg)", color: "var(--text-primary)", outline: "none",
    fontFamily: "var(--font-body)", transition: "border-color 0.2s, box-shadow 0.2s",
  };

  function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return <div style={{ background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)", padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)", ...style }}>{children}</div>;
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "44px", height: "44px", margin: "0 auto 16px", border: "3px solid var(--border)", borderTopColor: "#059669", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading quotation...</p>
      </div>
    </div>
  );

  if (!data) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>😕</div>
        <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>Quotation not found.</p>
        <button onClick={() => router.push("/approver")} style={{ marginTop: "16px", padding: "10px 20px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "13.5px" }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );

  const isPending = data.approval_status === "pending";
  const statusMap: Record<string, { color: string; bg: string; label: string }> = {
    pending:   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Pending Review" },
    approved:  { color: "#22c55e", bg: "rgba(34,197,94,0.12)",  label: "Approved" },
    rejected:  { color: "#f87171", bg: "rgba(239,68,68,0.12)",  label: "Rejected" },
    cancelled: { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", label: "Cancelled" },
  };
  const stl = statusMap[data.approval_status] ?? statusMap["pending"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* BG */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(5,150,105,0.12) 0%, transparent 60%)", zIndex: 0 }} />

      {/* TOP NAV */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", background: "var(--bg-sidebar)", borderBottom: "1px solid var(--border)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => router.push("/approver")}
            style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "12.5px", fontWeight: 500, fontFamily: "var(--font-body)", padding: "4px 0", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#059669"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Approver Dashboard
          </button>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ color: "var(--text-secondary)", fontSize: "12.5px", fontFamily: "var(--font-mono)" }}>{data.quotation_no}</span>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ color: "#059669", fontSize: "12.5px", fontWeight: 600 }}>Review</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg,#059669,#047857)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "white" }}>
            {user?.full_name?.[0] || "A"}
          </div>
          <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>{user?.full_name}</span>
        </div>
      </header>

      <div style={{ padding: "28px 36px 60px", maxWidth: "1100px", position: "relative", zIndex: 1 }}>

        {/* HEADER CARD */}
        <Card style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,rgba(5,150,105,0.2),rgba(4,120,87,0.15))", border: "1px solid rgba(5,150,105,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h1 style={{ fontFamily: "var(--font-mono)", fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>{data.quotation_no}</h1>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: stl.bg, color: stl.color, padding: "4px 11px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, border: `1px solid ${stl.color}30` }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: stl.color, boxShadow: `0 0 6px ${stl.color}` }} />
                    {stl.label}
                  </span>
                </div>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>Submitted by {data.created_by_name}</p>
              </div>
            </div>

            {/* ACTION BUTTONS — only if pending */}
            {isPending && (
              <div style={{ display: "flex", gap: "8px" }}>
                {(["rejected","cancelled","approved"] as const).map(action => {
                  const s = ACTION_STYLES[action];
                  return (
                    <button key={action} onClick={() => { setModalAction(action); setComment(""); }}
                      style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", border: "none", background: s.bg, color: "white", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-body)", cursor: "pointer", boxShadow: `0 4px 14px ${s.shadow}`, transition: "all 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 22px ${s.shadow}`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 14px ${s.shadow}`; }}
                    >{s.label}</button>
                  );
                })}
              </div>
            )}

            {/* Already decided */}
            {!isPending && data.review_note && (
              <div style={{ maxWidth: "300px", padding: "12px 16px", borderRadius: "12px", background: `${stl.bg}`, border: `1px solid ${stl.color}30` }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: stl.color, marginBottom: "4px" }}>Decision Note</p>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{data.review_note}</p>
              </div>
            )}
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "16px" }}>
          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* SUBMIT NOTE */}
            {data.submit_note && (
              <div style={{ padding: "16px 20px", borderRadius: "14px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#f59e0b", marginBottom: "6px" }}>📝 Note from Sales Team</p>
                <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{data.submit_note}</p>
              </div>
            )}

            {/* DOC DETAILS */}
            <Card>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "18px" }}>DOCUMENT DETAILS</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
                {[
                  { label: "DOCUMENT NO", value: data.quotation_no },
                  { label: "ISSUE DATE",  value: data.issue_date },
                  { label: "EXPIRY DATE", value: data.expiry_date || "—" },
                ].map(f => (
                  <div key={f.label}>
                    <p style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: "4px" }}>{f.label}</p>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", fontFamily: f.label === "DOCUMENT NO" ? "var(--font-mono)" : "var(--font-body)" }}>{f.value}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* CUSTOMER */}
            <Card>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "18px" }}>CUSTOMER INFORMATION</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 40px" }}>
                {[
                  { label: "NAME",    value: data.customer_name },
                  { label: "COMPANY", value: data.customer_company },
                  { label: "EMAIL",   value: data.customer_email },
                  { label: "PHONE",   value: data.customer_phone },
                  { label: "BILLING ADDRESS", value: data.customer_address },
                ].map(f => (
                  <div key={f.label}>
                    <p style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: "4px" }}>{f.label}</p>
                    <p style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>{f.value || "—"}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* ITEMS */}
            <Card>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "18px" }}>LINE ITEMS</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Product", "Description", "Qty", "Unit Price", "Disc%", "Line Total"].map((h, i) => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: i >= 2 ? "right" : "left", fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", paddingBottom: "12px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, i) => (
                    <tr key={item.item_id} style={{ borderBottom: i < data.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "14px 12px", fontWeight: 600, color: "var(--text-primary)" }}>{item.product_name}</td>
                      <td style={{ padding: "14px 12px", color: "var(--text-muted)", fontSize: "13px" }}>{item.description || "—"}</td>
                      <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-secondary)" }}>{item.qty}</td>
                      <td style={{ padding: "14px 12px", textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{money(item.unit_price)}</td>
                      <td style={{ padding: "14px 12px", textAlign: "right", color: item.discount_percent > 0 ? "#f87171" : "var(--text-muted)" }}>
                        {item.discount_percent > 0 ? `-${item.discount_percent}%` : "—"}
                      </td>
                      <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{money(item.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* COMMENT THREAD */}
            <Card>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "18px" }}>
                💬 COMMENT THREAD ({(data.comments || []).length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {(data.comments || []).length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "13.5px", textAlign: "center", padding: "20px" }}>No comments yet. Start the conversation.</p>
                ) : (
                  (data.comments || []).map(c => {
                    const isApprover = c.author_role === "approver";
                    return (
                      <div key={c.comment_id} style={{ display: "flex", gap: "10px", justifyContent: isApprover ? "flex-end" : "flex-start" }}>
                        {!isApprover && (
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#db2777)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "white", flexShrink: 0 }}>
                            {(c.author_name || "S")[0].toUpperCase()}
                          </div>
                        )}
                        <div style={{ maxWidth: "70%" }}>
                          <p style={{ fontSize: "10.5px", color: "var(--text-muted)", marginBottom: "4px", textAlign: isApprover ? "right" : "left" }}>
                            {c.author_name || (isApprover ? "Approver" : "Sales")} · {new Date(c.created_at).toLocaleString()}
                          </p>
                          <div style={{ padding: "10px 14px", borderRadius: isApprover ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: isApprover ? "linear-gradient(135deg,rgba(5,150,105,0.15),rgba(4,120,87,0.1))" : "var(--input-bg)", border: isApprover ? "1px solid rgba(5,150,105,0.25)" : "1px solid var(--border)" }}>
                            <p style={{ fontSize: "13.5px", color: "var(--text-primary)", lineHeight: 1.5 }}>{c.message}</p>
                          </div>
                        </div>
                        {isApprover && (
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#059669,#047857)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "white", flexShrink: 0 }}>
                            {user?.full_name?.[0] || "A"}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              {/* New comment input */}
              <div style={{ display: "flex", gap: "8px" }}>
                <textarea
                  value={newComment} onChange={e => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  style={{ ...inputStyle, flex: 1, resize: "none" }}
                  onFocus={e => { e.target.style.borderColor = "var(--border-hover)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                  onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); postComment(); } }}
                />
                <button onClick={postComment} disabled={postingComment || !newComment.trim()}
                  style={{ padding: "10px 16px", borderRadius: "10px", border: "none", background: newComment.trim() ? "linear-gradient(135deg,#059669,#047857)" : "var(--border)", color: "white", fontSize: "13px", fontWeight: 700, cursor: newComment.trim() ? "pointer" : "not-allowed", transition: "all 0.2s", alignSelf: "flex-end" }}
                >
                  {postingComment ? "..." : "Send"}
                </button>
              </div>
            </Card>
          </div>

          {/* RIGHT SUMMARY */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Financial summary */}
            <Card>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "18px" }}>FINANCIAL SUMMARY</h3>
              {[
                { label: "Subtotal",   value: money(data.subtotal + data.discount_amt), color: "var(--text-secondary)" },
                { label: "Discount",   value: `-${money(data.discount_amt)}`,           color: "#f87171" },
                { label: "VAT (7%)",   value: money(data.vat_amt),                      color: "var(--text-secondary)" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>{r.label}</span>
                  <span style={{ fontSize: "13.5px", color: r.color, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{r.value}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Grand Total</span>
                <span style={{ fontSize: "22px", fontWeight: 900, fontFamily: "var(--font-mono)", background: "linear-gradient(135deg,var(--accent),var(--accent-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {money(data.total)}
                </span>
              </div>
            </Card>

            {/* Quick action panel (if pending) */}
            {isPending && (
              <Card style={{ border: "1px solid rgba(5,150,105,0.3)", background: "linear-gradient(135deg,rgba(5,150,105,0.06),rgba(4,120,87,0.03))" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "#059669", marginBottom: "16px" }}>⚡ Quick Decision</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button onClick={() => { setModalAction("approved"); setComment(""); }}
                    style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#059669,#047857)", color: "white", fontSize: "13.5px", fontWeight: 700, fontFamily: "var(--font-body)", cursor: "pointer", boxShadow: "0 4px 14px rgba(5,150,105,0.35)", transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                  >✅ Approve</button>
                  <button onClick={() => { setModalAction("rejected"); setComment(""); }}
                    style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#f87171", fontSize: "13.5px", fontWeight: 700, fontFamily: "var(--font-body)", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.14)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
                  >❌ Reject</button>
                  <button onClick={() => { setModalAction("cancelled"); setComment(""); }}
                    style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: "13.5px", fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-card-hover)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >🚫 Cancel</button>
                </div>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.5 }}>
                  * Comment is required for Reject and Cancel actions.
                </p>
              </Card>
            )}

            {/* Checklist */}
            <Card>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "14px" }}>REVIEW CHECKLIST</h3>
              {[
                { label: "Customer info verified",   done: !!data.customer_name },
                { label: "All items have prices",    done: data.items.every(i => i.unit_price > 0) },
                { label: "Expiry date is set",       done: !!data.expiry_date },
                { label: "No zero-qty items",        done: data.items.every(i => i.qty > 0) },
                { label: "Discount within policy",   done: data.items.every(i => i.discount_percent <= 30) },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "5px", background: c.done ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.1)", border: `1px solid ${c.done ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {c.done
                      ? <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      : <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    }
                  </div>
                  <span style={{ fontSize: "12.5px", color: c.done ? "var(--text-secondary)" : "#f87171" }}>{c.label}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>

      {/* ═══ DECISION MODAL ═══ */}
      {modalAction && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) setModalAction(null); }}
        >
          <div style={{ background: "var(--bg-sidebar)", border: "1px solid var(--border)", borderRadius: "20px", padding: "32px", width: "480px", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                  {ACTION_STYLES[modalAction].label}
                </h2>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{data.quotation_no} · {data.customer_name}</p>
              </div>
              <button onClick={() => setModalAction(null)} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--border)", background: "var(--input-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", transition: "all 0.15s" }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Confirm info box */}
            {modalAction === "approved" && (
              <div style={{ padding: "14px", borderRadius: "12px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#22c55e", fontWeight: 600, marginBottom: "4px" }}>✅ This action will:</p>
                <ul style={{ fontSize: "12.5px", color: "var(--text-secondary)", paddingLeft: "16px", lineHeight: 1.8 }}>
                  <li>Mark quotation as Approved</li>
                  <li>Create a Sale Order automatically</li>
                  <li>Notify the sales team</li>
                </ul>
              </div>
            )}
            {(modalAction === "rejected" || modalAction === "cancelled") && (
              <div style={{ padding: "14px", borderRadius: "12px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#f87171", fontWeight: 600, marginBottom: "4px" }}>
                  {modalAction === "rejected" ? "❌ This will reject the quotation" : "🚫 This will cancel the quotation"}
                </p>
                <ul style={{ fontSize: "12.5px", color: "var(--text-secondary)", paddingLeft: "16px", lineHeight: 1.8 }}>
                  {modalAction === "rejected" && <li>Sale team can revise and resubmit</li>}
                  <li>Your comment will be visible to the sales team</li>
                  <li>A comment is <strong style={{ color: "#f87171" }}>required</strong> for this action</li>
                </ul>
              </div>
            )}

            {/* Comment textarea */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", marginBottom: "7px" }}>
                {modalAction === "approved" ? "COMMENT (OPTIONAL)" : "COMMENT (REQUIRED) *"}
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={
                  modalAction === "approved" ? "Add any notes for the sales team (optional)..."
                  : modalAction === "rejected" ? "Please explain why you are rejecting this quotation..."
                  : "Please explain why you are cancelling this quotation..."
                }
                rows={4}
                style={{ ...inputStyle, resize: "none" }}
                onFocus={e => { e.target.style.borderColor = "var(--border-hover)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
              {(modalAction === "rejected" || modalAction === "cancelled") && comment.length < 10 && (
                <p style={{ fontSize: "11px", color: "#f87171", marginTop: "4px" }}>
                  ⚠ Please write at least 10 characters explaining your decision.
                </p>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setModalAction(null)} style={{ flex: 1, padding: "11px", borderRadius: "12px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: "13.5px", fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", transition: "all 0.2s" }}>
                Back
              </button>
              <button onClick={submitDecision} disabled={submitting || ((modalAction === "rejected" || modalAction === "cancelled") && comment.trim().length < 10)}
                style={{ flex: 2, padding: "11px", borderRadius: "12px", border: "none", background: (submitting || ((modalAction !== "approved") && comment.trim().length < 10)) ? "var(--border)" : ACTION_STYLES[modalAction].bg, color: "white", fontSize: "13.5px", fontWeight: 800, fontFamily: "var(--font-display)", cursor: (submitting || ((modalAction !== "approved") && comment.trim().length < 10)) ? "not-allowed" : "pointer", boxShadow: `0 4px 16px ${ACTION_STYLES[modalAction].shadow}`, transition: "all 0.2s" }}
              >
                {submitting ? "Processing..." : `Confirm ${modalAction === "approved" ? "Approval" : modalAction === "rejected" ? "Rejection" : "Cancellation"}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.45); } 70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
      `}</style>
    </div>
  );
}