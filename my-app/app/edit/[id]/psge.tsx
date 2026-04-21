// page-edit.tsx  →  app/edit/[id]/page.tsx
// หน้าแก้ไข Quotation — กด Edit จากหน้า Detail มาที่นี่
// กด Save → PUT /quotations/:id → กลับหน้า "/"

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/* ─── TYPES ─── */
type EditItem = {
  item_id?: string;
  product_name: string;
  description: string;
  qty: number;
  unit_price: number;
  discount: number;
  discount_type: "%" | "$";
};

type Customer = {
  customer_name: string;
  customer_company: string;
  customer_phone: string;
  customer_address: string;
  customer_email: string;
  customer_tax_id: string;
  customer_shipping_address: string;
};

type QuotationData = {
  quotation_id: string;
  quotation_no: string;
  issue_date: string;
  expiry_date: string;
  status: string;
  customer_id?: number;
  customer_name: string;
  customer_company: string;
  customer_phone: string;
  customer_address: string;
  customer_email: string;
  customer_tax_id?: string;
  customer_shipping_address?: string;
  items: any[];
  notes?: string;
  vat_enabled?: boolean;
};

/* ─── GLOBAL STYLES ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

[data-theme="dark"] {
  --bg-base: #0d0d14; --bg-surface: #13131e; --bg-elevated: #1a1a28; --bg-overlay: #20202f;
  --bg-muted: rgba(255,255,255,0.04); --bg-muted-hover: rgba(255,255,255,0.07);
  --text-primary: #eeeeff; --text-secondary: #9090b0; --text-tertiary: #555570; --text-placeholder: #444460;
  --border-subtle: rgba(255,255,255,0.06); --border-default: rgba(255,255,255,0.10); --border-strong: rgba(255,255,255,0.16);
  --accent: #9d7cf8; --accent-soft: rgba(157,124,248,0.14); --accent-glow: rgba(157,124,248,0.25);
  --green: #2ecc9a; --green-soft: rgba(46,204,154,0.12);
  --red: #f06a6a; --red-soft: rgba(240,106,106,0.12);
  --sidebar-bg: #0f0f18; --sidebar-w: 220px;
  --shadow-btn: 0 4px 20px rgba(157,124,248,0.35);
}
[data-theme="light"] {
  --bg-base: #f4f2ff; --bg-surface: #ffffff; --bg-elevated: #faf8ff; --bg-overlay: #f0eeff;
  --bg-muted: rgba(109,40,217,0.04); --bg-muted-hover: rgba(109,40,217,0.07);
  --text-primary: #1c1840; --text-secondary: #4e4878; --text-tertiary: #9088bb; --text-placeholder: #b0a8d8;
  --border-subtle: rgba(109,40,217,0.08); --border-default: rgba(109,40,217,0.13); --border-strong: rgba(109,40,217,0.22);
  --accent: #7c3aed; --accent-soft: rgba(124,58,237,0.10); --accent-glow: rgba(124,58,237,0.20);
  --green: #0a9e74; --green-soft: rgba(10,158,116,0.10);
  --red: #dc2626; --red-soft: rgba(220,38,38,0.10);
  --sidebar-bg: #faf9ff; --sidebar-w: 220px;
  --shadow-btn: 0 4px 20px rgba(124,58,237,0.25);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 14px; }
body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: var(--bg-base); color: var(--text-primary); -webkit-font-smoothing: antialiased; }
input, select, textarea, button { font-family: inherit; }
::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }

/* LAYOUT */
.eq-layout { display: flex; min-height: 100vh; }

/* SIDEBAR */
.eq-sidebar { width: var(--sidebar-w); min-height: 100vh; background: var(--sidebar-bg); border-right: 1px solid var(--border-subtle); display: flex; flex-direction: column; position: fixed; top:0; left:0; bottom:0; z-index:50; }
.eq-sidebar-logo { display:flex; align-items:center; gap:10px; padding:18px 20px 16px; border-bottom:1px solid var(--border-subtle); }
.eq-sidebar-logo-icon { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,#a855f7,#ec4899); display:flex; align-items:center; justify-content:center; }
.eq-sidebar-logo-icon svg { width:15px; height:15px; stroke:white; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.eq-sidebar-logo-text { font-size:15px; font-weight:700; color:var(--text-primary); letter-spacing:-0.02em; }
.eq-sidebar-section { padding:14px 12px 4px; }
.eq-sidebar-label { font-size:10px; font-weight:600; color:var(--text-tertiary); letter-spacing:.08em; text-transform:uppercase; padding:0 8px; margin-bottom:4px; }
.eq-nav-item { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:8px; font-size:13.5px; font-weight:500; color:var(--text-secondary); cursor:pointer; transition:background .15s,color .15s; margin-bottom:2px; }
.eq-nav-item:hover { background:var(--bg-muted-hover); color:var(--text-primary); }
.eq-nav-item.active { background:var(--accent-soft); color:var(--accent); }
.eq-nav-item svg { width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; flex-shrink:0; }
.eq-sidebar-footer { margin-top:auto; padding:14px 16px; border-top:1px solid var(--border-subtle); font-size:11.5px; color:var(--text-tertiary); }
.eq-sidebar-footer strong { color:var(--accent); }

/* TOPBAR */
.eq-topbar { height:52px; display:flex; align-items:center; justify-content:space-between; padding:0 24px; background:var(--bg-surface); border-bottom:1px solid var(--border-subtle); position:sticky; top:0; z-index:40; }
.eq-topbar-left { display:flex; align-items:center; gap:8px; font-size:13.5px; color:var(--text-tertiary); }
.eq-topbar-left span.curr { color:var(--text-primary); font-weight:600; }
.eq-topbar-sep { color:var(--text-tertiary); }
.eq-topbar-right { display:flex; align-items:center; gap:10px; }
.eq-live { display:flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; background:rgba(46,204,154,0.1); border:1px solid rgba(46,204,154,0.2); font-size:11px; font-weight:700; color:var(--green); letter-spacing:.06em; }
.eq-live-dot { width:5px; height:5px; border-radius:50%; background:var(--green); animation:livepulse 2s infinite; }
@keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:.4} }
.eq-icon-btn { width:34px; height:34px; border-radius:8px; border:1px solid var(--border-default); background:var(--bg-muted); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-secondary); transition:background .15s,color .15s; }
.eq-icon-btn:hover { background:var(--bg-muted-hover); color:var(--text-primary); }
.eq-icon-btn svg { width:15px; height:15px; stroke:currentColor; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.eq-avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,#a855f7,#ec4899); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:white; cursor:pointer; }

/* CONTENT */
.eq-content { margin-left:var(--sidebar-w); flex:1; display:flex; flex-direction:column; }
.eq-page { flex:1; padding:24px; }

/* DOC HEADER */
.eq-doc-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
.eq-doc-left { display:flex; align-items:center; gap:14px; }
.eq-back-btn { background:none; border:none; color:var(--text-secondary); cursor:pointer; padding:4px; display:flex; align-items:center; transition:color .15s; }
.eq-back-btn:hover { color:var(--text-primary); }
.eq-back-btn svg { width:18px; height:18px; stroke:currentColor; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.eq-doc-no { font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:700; color:var(--text-primary); letter-spacing:-0.01em; }
.eq-doc-sub { font-size:12px; color:var(--text-tertiary); margin-top:2px; }
.eq-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; }
.eq-badge-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }
.badge-draft { background:rgba(136,136,168,0.12); color:#8888a8; } .badge-draft .eq-badge-dot { background:#8888a8; }
.badge-sent { background:rgba(90,171,248,0.12); color:#5aabf8; } .badge-sent .eq-badge-dot { background:#5aabf8; }
.badge-confirmed { background:rgba(46,204,154,0.12); color:var(--green); } .badge-confirmed .eq-badge-dot { background:var(--green); }
.badge-cancel { background:rgba(240,106,106,0.12); color:var(--red); } .badge-cancel .eq-badge-dot { background:var(--red); }
.eq-doc-actions { display:flex; gap:10px; flex-wrap:wrap; }

/* BUTTONS */
.eq-btn { display:inline-flex; align-items:center; gap:7px; padding:8px 16px; border-radius:9px; border:none; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; transition:transform .15s,opacity .15s,box-shadow .15s; white-space:nowrap; }
.eq-btn:hover { transform:translateY(-1px); opacity:.92; }
.eq-btn:active { transform:scale(0.97); opacity:1; }
.eq-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
.eq-btn svg { width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round; flex-shrink:0; }
.btn-primary { position:relative; overflow:hidden; color:white; background:linear-gradient(115deg,#a855f7 0%,#ec4899 55%,#60a5fa 100%); background-size:200% 200%; animation:gradShift 5s ease infinite; box-shadow:var(--shadow-btn); }
@keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
.btn-primary::before { content:''; position:absolute; inset:0; background:linear-gradient(120deg,rgba(255,255,255,.18) 0%,transparent 55%); pointer-events:none; }
.btn-primary:hover { box-shadow:0 6px 28px rgba(168,85,247,.5); opacity:1; transform:translateY(-1px); }
.btn-ghost { background:none; border:1px solid var(--border-default); color:var(--text-secondary); }
.btn-ghost:hover { background:var(--bg-muted); color:var(--text-primary); opacity:1; }

/* SECTION CARD */
.eq-card { background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:12px; padding:20px 22px; box-shadow:0 1px 3px rgba(0,0,0,0.08); margin-bottom:14px; }
.eq-section-title { font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid var(--border-subtle); }

/* FORM */
.eq-label { font-size:11.5px; font-weight:600; color:var(--text-tertiary); letter-spacing:.03em; display:block; margin-bottom:5px; }
.eq-input, .eq-select {
  width:100%; padding:8px 11px;
  background:var(--bg-elevated); border:1px solid var(--border-default);
  border-radius:8px; color:var(--text-primary); font-size:13.5px;
  outline:none; transition:border .18s,box-shadow .18s;
}
.eq-input::placeholder { color:var(--text-placeholder); }
.eq-input:focus, .eq-select:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
.eq-input[readonly] { opacity:.6; cursor:default; background:var(--bg-overlay); }
.eq-select { appearance:none; cursor:pointer; }
.eq-select-wrap { position:relative; }
.eq-select-wrap svg { position:absolute; right:10px; top:50%; transform:translateY(-50%); pointer-events:none; color:var(--text-tertiary); width:13px; height:13px; }
.eq-row2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
.eq-row4 { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:14px; }
.eq-row1 { margin-bottom:14px; }

/* PRODUCTS TABLE */
.eq-prod-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; padding-bottom:12px; border-bottom:1px solid var(--border-subtle); }
.eq-table-wrap { overflow-x:auto; }
.eq-table { width:100%; border-collapse:collapse; font-size:13px; }
.eq-table thead tr { border-bottom:1px solid var(--border-default); }
.eq-table th { padding:7px 10px; text-align:left; font-size:10px; font-weight:700; color:var(--text-tertiary); letter-spacing:.07em; text-transform:uppercase; white-space:nowrap; }
.eq-table th.r { text-align:right; }
.eq-table tbody tr { border-bottom:1px solid var(--border-subtle); }
.eq-table tbody tr:last-child { border-bottom:none; }
.eq-table td { padding:7px 10px; vertical-align:middle; }
.eq-row-input { width:100%; padding:6px 9px; background:var(--bg-elevated); border:1px solid var(--border-default); border-radius:7px; color:var(--text-primary); font-size:13px; outline:none; transition:border .15s; }
.eq-row-input:focus { border-color:var(--accent); }
.eq-disc-wrap { display:flex; gap:4px; align-items:center; }
.eq-disc-type { width:52px; padding:6px 4px 6px 7px; background:var(--bg-elevated); border:1px solid var(--border-default); border-radius:7px; color:var(--text-primary); font-size:13px; outline:none; appearance:none; cursor:pointer; }
.eq-del-row { background:none; border:none; color:var(--text-tertiary); cursor:pointer; padding:5px; border-radius:6px; display:flex; align-items:center; transition:color .15s,background .15s; }
.eq-del-row:hover { color:var(--red); background:var(--red-soft); }
.eq-del-row svg { width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.eq-line-total { text-align:right; font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:500; color:var(--text-primary); }
.eq-add-btn { display:flex; align-items:center; gap:6px; padding:6px 14px; border:1px dashed rgba(157,124,248,.35); border-radius:8px; background:var(--accent-soft); color:var(--accent); font-size:12.5px; font-weight:500; cursor:pointer; font-family:inherit; transition:background .15s,border-color .15s; }
.eq-add-btn:hover { background:rgba(157,124,248,.2); border-color:rgba(157,124,248,.55); }
.eq-add-btn svg { width:13px; height:13px; stroke:currentColor; fill:none; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; }

/* SUMMARY */
.eq-summary-outer { display:flex; justify-content:flex-end; }
.eq-summary-box { width:300px; }
.eq-sum-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; font-size:13.5px; color:var(--text-secondary); border-bottom:1px solid var(--border-subtle); }
.eq-sum-row:last-of-type { border-bottom:none; }
.eq-sum-val { font-family:'JetBrains Mono',monospace; font-size:13px; }
.eq-sum-disc { color:var(--red) !important; }
.eq-sum-total { display:flex; justify-content:space-between; align-items:center; padding:12px 0 0; border-top:1px solid var(--border-strong); margin-top:4px; }
.eq-sum-total-label { font-size:13px; font-weight:700; color:var(--text-primary); letter-spacing:.06em; text-transform:uppercase; }
.eq-sum-total-val { font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:700; color:var(--accent); }

/* TOGGLE */
.eq-toggle-row { display:flex; align-items:center; gap:10px; }
.eq-toggle { width:38px; height:21px; border-radius:11px; background:var(--border-strong); cursor:pointer; position:relative; transition:background .2s; border:none; flex-shrink:0; }
.eq-toggle.on { background:var(--accent); }
.eq-toggle-knob { position:absolute; top:2.5px; left:2.5px; width:16px; height:16px; border-radius:50%; background:white; transition:transform .2s cubic-bezier(.34,1.56,.64,1); box-shadow:0 1px 3px rgba(0,0,0,0.2); }
.eq-toggle.on .eq-toggle-knob { transform:translateX(17px); }

@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
.a0{animation:fadeUp .32s ease both} .a1{animation:fadeUp .32s .05s ease both} .a2{animation:fadeUp .32s .10s ease both}
.a3{animation:fadeUp .32s .15s ease both} .a4{animation:fadeUp .32s .20s ease both} .a5{animation:fadeUp .32s .25s ease both}
`;

/* ─── ICONS ─── */
const I = {
  back: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  save: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  discard: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  doc: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  grid: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  nav: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
  cart: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  sun: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  plus: <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  x: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  chevDown: <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
};

/* ─── COMPONENT ─── */
export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const API    = process.env.NEXT_PUBLIC_API_URL || "";

  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  /* form state */
  const [docNo,   setDocNo]   = useState("");
  const [status,  setStatus]  = useState("draft");
  const [date,    setDate]    = useState("");
  const [expiry,  setExpiry]  = useState("");
  const [customer, setCustomer] = useState<Customer>({
    customer_name:"", customer_company:"", customer_phone:"",
    customer_address:"", customer_email:"",
    customer_tax_id:"", customer_shipping_address:"",
  });
  const [items, setItems]   = useState<EditItem[]>([]);
  const [vatOn, setVatOn]   = useState(true);
  const [notes, setNotes]   = useState("");

  /* load theme preference */
  useEffect(() => {
    const saved = localStorage.getItem("qf-theme");
    if (saved) setIsDark(saved === "dark");
  }, []);

  const toggleTheme = () => {
    setIsDark(v => {
      localStorage.setItem("qf-theme", !v ? "dark" : "light");
      return !v;
    });
  };

  /* fetch existing quotation */
  useEffect(() => {
    if (!id) return;
    fetch(`${API}/quotations/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: QuotationData) => {
        setDocNo(d.quotation_no);
        setStatus(d.status ?? "draft");
        setDate(d.issue_date ?? "");
        setExpiry(d.expiry_date ?? "");
        setCustomer({
          customer_name:             d.customer_name ?? "",
          customer_company:          d.customer_company ?? "",
          customer_phone:            d.customer_phone ?? "",
          customer_address:          d.customer_address ?? "",
          customer_email:            d.customer_email ?? "",
          customer_tax_id:           d.customer_tax_id ?? "",
          customer_shipping_address: d.customer_shipping_address ?? d.customer_address ?? "",
        });
        setItems((d.items ?? []).map((it: any) => ({
          item_id:       it.item_id ?? it.id,
          product_name:  it.product_name ?? "",
          description:   it.description ?? "",
          qty:           it.qty ?? 1,
          unit_price:    it.unit_price ?? 0,
          discount:      it.discount_percent ?? it.discount ?? 0,
          discount_type: it.discount_type ?? "%",
        })));
        setVatOn(d.vat_enabled !== false);
        setNotes(d.notes ?? "");
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [id]);

  /* item helpers */
  const addItem = () => setItems(p => [...p, { product_name:"", description:"", qty:1, unit_price:0, discount:0, discount_type:"%" }]);
  const delItem = (i: number) => setItems(p => p.filter((_,idx) => idx !== i));
  const updItem = <K extends keyof EditItem>(i: number, k: K, v: EditItem[K]) => {
    setItems(p => { const n=[...p]; n[i]={...n[i],[k]:v}; return n; });
  };

  /* calc */
  const calcLine = (it: EditItem) => {
    const gross = it.qty * it.unit_price;
    if (it.discount_type === "%") return gross * (1 - it.discount / 100);
    return gross - it.discount;
  };
  const calcDisc = (it: EditItem) => {
    const gross = it.qty * it.unit_price;
    if (it.discount_type === "%") return gross * (it.discount / 100);
    return it.discount;
  };
  const subtotal     = items.reduce((s,i) => s + calcLine(i), 0);
  const totalDisc    = items.reduce((s,i) => s + calcDisc(i), 0);
  const vat          = vatOn ? subtotal * 0.07 : 0;
  const grandTotal   = subtotal + vat;
  const fmt          = (n: number) => n.toLocaleString("en-US", { style:"currency", currency:"USD" });

  /* save */
  const handleSave = async () => {
    if (!customer.customer_name.trim()) return alert("Please enter customer name");
    const validItems = items.filter(i => i.product_name.trim());
    if (validItems.length === 0) return alert("Please add at least 1 product");
    try {
      setSaving(true);
      const body = {
        issue_date:   date,
        expiry_date:  expiry,
        status,
        customer,
        items: validItems.map(i => ({
          item_id:       i.item_id,
          product_name:  i.product_name,
          description:   i.description,
          qty:           i.qty,
          unit_price:    i.unit_price,
          discount:      i.discount,
          discount_type: i.discount_type,
        })),
        vat_enabled: vatOn,
        notes,
      };
      const res = await fetch(`${API}/quotations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Save failed ❌");
    } finally {
      setSaving(false);
    }
  };

  const statusMap: Record<string, string> = {
    draft:"badge-draft", sent:"badge-sent", confirmed:"badge-confirmed", cancel:"badge-cancel",
  };
  const statusLabels: Record<string, string> = {
    draft:"DRAFT", sent:"SENT", confirmed:"APPROVED", cancel:"CANCELLED",
  };

  /* ── LOADING ── */
  if (loading) return (
    <>
      <style>{CSS}</style>
      <div data-theme={isDark?"dark":"light"}>
        <div className="eq-layout">
          <aside className="eq-sidebar">
            <div className="eq-sidebar-logo">
              <div className="eq-sidebar-logo-icon">{I.doc}</div>
              <span className="eq-sidebar-logo-text">SalesPro</span>
            </div>
          </aside>
          <div className="eq-content">
            <header className="eq-topbar"><div className="eq-topbar-left"><span>Loading...</span></div></header>
            <div className="eq-page" style={{display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-tertiary)",fontSize:"13.5px"}}>
              Loading quotation...
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div data-theme={isDark ? "dark" : "light"}>
        <div className="eq-layout">

          {/* ─── SIDEBAR ─── */}
          <aside className="eq-sidebar">
            <div className="eq-sidebar-logo">
              <div className="eq-sidebar-logo-icon">{I.doc}</div>
              <span className="eq-sidebar-logo-text">SalesPro</span>
            </div>
            <div className="eq-sidebar-section">
              <div className="eq-sidebar-label">WORKSPACE</div>
              <div className="eq-nav-item" onClick={() => router.push("/dashboard")}>{I.grid} Dashboard</div>
              <div className="eq-nav-item active" onClick={() => router.push("/")}>{I.nav} Quotations</div>
              <div className="eq-nav-item" onClick={() => router.push("/orders")}>{I.cart} Sales Orders</div>
            </div>
            <div className="eq-sidebar-footer">
              <strong>Pro Tip 💡</strong><br />Convert quotes to orders in one click.
            </div>
          </aside>

          {/* ─── CONTENT ─── */}
          <div className="eq-content">

            {/* TOPBAR */}
            <header className="eq-topbar">
              <div className="eq-topbar-left">
                <span style={{color:"var(--text-tertiary)"}}>Quotations</span>
                <span className="eq-topbar-sep">/</span>
                <span style={{color:"var(--text-tertiary)"}}>{docNo}</span>
                <span className="eq-topbar-sep">/</span>
                <span className="curr">Edit</span>
              </div>
              <div className="eq-topbar-right">
                <div className="eq-live"><span className="eq-live-dot"/>LIVE</div>
                <button className="eq-icon-btn" onClick={toggleTheme} title="Toggle theme">
                  {isDark ? I.sun : I.moon}
                </button>
                <div className="eq-avatar">S</div>
              </div>
            </header>

            <div className="eq-page">

              {/* ─── DOC HEADER ─── */}
              <div className="eq-doc-header a0">
                <div className="eq-doc-left">
                  <button className="eq-back-btn" onClick={() => router.back()}>{I.back}</button>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                      <span className="eq-doc-no">{docNo}</span>
                      <span className={`eq-badge ${statusMap[status]??statusMap.draft}`}>
                        <span className="eq-badge-dot"/>
                        {statusLabels[status]??"DRAFT"}
                      </span>
                    </div>
                    <div className="eq-doc-sub">Edit Quotation</div>
                  </div>
                </div>
                <div className="eq-doc-actions">
                  <button className="eq-btn btn-ghost" onClick={() => router.back()} disabled={saving}>
                    {I.discard} Discard
                  </button>
                  <button className="eq-btn btn-primary" onClick={handleSave} disabled={saving}>
                    {I.save}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              {/* ─── DOCUMENT DETAILS ─── */}
              <div className="eq-card a1">
                <div className="eq-section-title">Document Details</div>
                <div className="eq-row4">
                  <div>
                    <label className="eq-label">Document Number</label>
                    <input className="eq-input" value={docNo} readOnly/>
                  </div>
                  <div>
                    <label className="eq-label">Date</label>
                    <input type="date" className="eq-input" value={date} onChange={e => setDate(e.target.value)}/>
                  </div>
                  <div>
                    <label className="eq-label">Expiry Date</label>
                    <input type="date" className="eq-input" value={expiry} onChange={e => setExpiry(e.target.value)}/>
                  </div>
                  <div>
                    <label className="eq-label">Status</label>
                    <div className="eq-select-wrap">
                      <select className="eq-input eq-select" value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancel">Cancelled</option>
                      </select>
                      {I.chevDown}
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── CUSTOMER INFORMATION ─── */}
              <div className="eq-card a2">
                <div className="eq-section-title">Customer Information</div>
                <div className="eq-row2">
                  <div>
                    <label className="eq-label">Customer</label>
                    <input className="eq-input" placeholder="Customer name" value={customer.customer_name} onChange={e => setCustomer({...customer, customer_name:e.target.value})}/>
                  </div>
                  <div>
                    <label className="eq-label">Company</label>
                    <input className="eq-input" placeholder="Company name" value={customer.customer_company} onChange={e => setCustomer({...customer, customer_company:e.target.value})}/>
                  </div>
                </div>
                <div className="eq-row2">
                  <div>
                    <label className="eq-label">Tax ID</label>
                    <input className="eq-input" placeholder="Tax ID number" value={customer.customer_tax_id} onChange={e => setCustomer({...customer, customer_tax_id:e.target.value})}/>
                  </div>
                  <div>
                    <label className="eq-label">Phone</label>
                    <input className="eq-input" placeholder="+1 xxx-xxx-xxxx" value={customer.customer_phone} onChange={e => setCustomer({...customer, customer_phone:e.target.value})}/>
                  </div>
                </div>
                <div className="eq-row1">
                  <label className="eq-label">Email</label>
                  <input type="email" className="eq-input" placeholder="email@company.com" value={customer.customer_email} onChange={e => setCustomer({...customer, customer_email:e.target.value})}/>
                </div>
                <div className="eq-row2">
                  <div>
                    <label className="eq-label">Billing Address</label>
                    <input className="eq-input" placeholder="Billing address" value={customer.customer_address} onChange={e => setCustomer({...customer, customer_address:e.target.value})}/>
                  </div>
                  <div>
                    <label className="eq-label">Shipping Address</label>
                    <input className="eq-input" placeholder="Shipping address" value={customer.customer_shipping_address} onChange={e => setCustomer({...customer, customer_shipping_address:e.target.value})}/>
                  </div>
                </div>
              </div>

              {/* ─── PRODUCTS ─── */}
              <div className="eq-card a3">
                <div className="eq-prod-header">
                  <span className="eq-section-title" style={{margin:0,padding:0,border:"none"}}>Products</span>
                  <button className="eq-add-btn" onClick={addItem}>
                    {I.plus} Add Item
                  </button>
                </div>

                {items.length === 0 ? (
                  <div style={{padding:"32px",textAlign:"center",color:"var(--text-tertiary)",fontSize:"13.5px"}}>
                    No items yet. Click "Add Item" to begin.
                  </div>
                ) : (
                  <div className="eq-table-wrap">
                    <table className="eq-table">
                      <thead>
                        <tr>
                          <th style={{width:"20%"}}>Product</th>
                          <th style={{width:"22%"}}>Description</th>
                          <th style={{width:"8%"}}>Qty</th>
                          <th style={{width:"13%"}}>Unit Price</th>
                          <th style={{width:"15%"}}>Discount</th>
                          <th style={{width:"9%"}}>Type</th>
                          <th className="r" style={{width:"10%"}}>Line Total</th>
                          <th style={{width:"3%"}}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, i) => (
                          <tr key={i}>
                            <td>
                              <input className="eq-row-input" value={item.product_name} onChange={e => updItem(i,"product_name",e.target.value)} placeholder="Product name"/>
                            </td>
                            <td>
                              <input className="eq-row-input" value={item.description} onChange={e => updItem(i,"description",e.target.value)} placeholder="Description"/>
                            </td>
                            <td>
                              <input type="number" min="0" className="eq-row-input" value={item.qty} onChange={e => updItem(i,"qty",Number(e.target.value))}/>
                            </td>
                            <td>
                              <input type="number" min="0" className="eq-row-input" value={item.unit_price} onChange={e => updItem(i,"unit_price",Number(e.target.value))}/>
                            </td>
                            <td>
                              <input type="number" min="0" className="eq-row-input" value={item.discount} onChange={e => updItem(i,"discount",Number(e.target.value))}/>
                            </td>
                            <td>
                              <div className="eq-disc-wrap">
                                <div className="eq-select-wrap" style={{flex:1}}>
                                  <select className="eq-disc-type eq-input" style={{width:"100%"}} value={item.discount_type} onChange={e => updItem(i,"discount_type",e.target.value as "%"|"$")}>
                                    <option value="%">%</option>
                                    <option value="$">$</option>
                                  </select>
                                </div>
                              </div>
                            </td>
                            <td className="eq-line-total">{fmt(calcLine(item))}</td>
                            <td>
                              <button className="eq-del-row" onClick={() => delItem(i)}>{I.x}</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ─── SUMMARY ─── */}
              <div className="eq-card a4">
                <div className="eq-section-title">Summary</div>
                <div className="eq-summary-outer">
                  <div className="eq-summary-box">
                    <div className="eq-sum-row">
                      <span>Subtotal</span>
                      <span className="eq-sum-val">{fmt(subtotal + totalDisc)}</span>
                    </div>
                    <div className="eq-sum-row">
                      <span>Discount</span>
                      <span className="eq-sum-val eq-sum-disc">-{fmt(totalDisc)}</span>
                    </div>
                    <div className="eq-sum-row">
                      <div className="eq-toggle-row">
                        <span>VAT (7%)</span>
                        <button
                          className={`eq-toggle ${vatOn ? "on" : ""}`}
                          onClick={() => setVatOn(v => !v)}
                          title={vatOn ? "Click to disable VAT" : "Click to enable VAT"}
                        >
                          <div className="eq-toggle-knob"/>
                        </button>
                      </div>
                      <span className="eq-sum-val" style={{color: vatOn ? "var(--text-primary)" : "var(--text-tertiary)"}}>
                        {vatOn ? fmt(vat) : "$0.00"}
                      </span>
                    </div>
                    <div className="eq-sum-total">
                      <span className="eq-sum-total-label">Grand Total</span>
                      <span className="eq-sum-total-val">{fmt(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── NOTES ─── */}
              <div className="eq-card a5">
                <div className="eq-section-title">Notes</div>
                <textarea
                  className="eq-input"
                  rows={4}
                  placeholder="Additional remarks..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{resize:"vertical", lineHeight:"1.6"}}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}