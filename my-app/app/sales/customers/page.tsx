"use client";
/* ================================================================
   app/customers/page.tsx
   - Grid card view with avatar, company, email, phone
   - Search by name/company/email
   - Add / Edit (modal) / Delete
   - API: GET/POST/PUT/DELETE /customers
   ================================================================ */
import { useEffect, useState } from "react";
import { SidebarLayout, useLang } from "@/components/SidebarLayout";

type Customer = {
  customer_id: number;
  customer_name: string;
  customer_company: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  tax_id?: string;
};

const empty: Omit<Customer, "customer_id"> = {
  customer_name: "", customer_company: "", customer_email: "",
  customer_phone: "", customer_address: "", tax_id: "",
};

const COLORS = ["#7c3aed","#0891b2","#059669","#d97706","#db2777","#6366f1","#0ea5e9","#10b981"];
const getColor = (name: string) => COLORS[name.charCodeAt(0) % COLORS.length];

const inputStyle: React.CSSProperties = { width:"100%", padding:"10px 14px", border:"1px solid var(--border)", borderRadius:"10px", fontSize:"13.5px", background:"var(--input-bg)", color:"var(--text-primary)", outline:"none", fontFamily:"var(--font-body)", transition:"border-color 0.2s, box-shadow 0.2s" };
const focusFn = (e:React.FocusEvent<any>) => { e.target.style.borderColor="var(--border-hover)"; e.target.style.boxShadow="0 0 0 3px var(--accent-glow)"; };
const blurFn  = (e:React.FocusEvent<any>) => { e.target.style.borderColor="var(--border)"; e.target.style.boxShadow="none"; };

function Field({ label, children }: { label:string; children:React.ReactNode }) {
  return <div style={{marginBottom:"14px"}}><label style={{display:"block",fontSize:"11.5px",fontWeight:600,color:"var(--text-muted)",marginBottom:"6px",letterSpacing:"0.03em"}}>{label}</label>{children}</div>;
}

export default function CustomersPage() {
  const { t, lang } = useLang();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<Omit<Customer,"customer_id">>(empty);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch(`${API}/customers`)
      .then(r => r.ok ? r.json() : [])
      .then(d => setCustomers(d || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = customers.filter(c =>
    (c.customer_name||"").toLowerCase().includes(search.toLowerCase()) ||
    (c.customer_company||"").toLowerCase().includes(search.toLowerCase()) ||
    (c.customer_email||"").toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (c: Customer) => { setEditing(c); setForm({ customer_name:c.customer_name, customer_company:c.customer_company, customer_email:c.customer_email, customer_phone:c.customer_phone, customer_address:c.customer_address, tax_id:c.tax_id||"" }); setShowModal(true); };

  const save = async () => {
    setSaving(true);
    try {
      const url = editing ? `${API}/customers/${editing.customer_id}` : `${API}/customers`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setShowModal(false);
      load();
    } catch { alert(lang==="th"?"บันทึกไม่สำเร็จ":"Save failed"); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm(lang==="th"?"ต้องการลบลูกค้านี้?":"Delete this customer?")) return;
    setDeletingId(id);
    try {
      await fetch(`${API}/customers/${id}`, { method:"DELETE" });
      setCustomers(prev => prev.filter(c => c.customer_id !== id));
    } catch { alert("Delete failed"); }
    finally { setDeletingId(null); }
  };

  return (
    <SidebarLayout>
      <div style={{padding:"36px 36px 60px"}}>

        {/* HEADER */}
        <div className="fade-up" style={{marginBottom:"28px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"12px"}}>
            <span style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"3px 10px 3px 8px",borderRadius:"20px",background:"rgba(8,145,178,0.1)",border:"1px solid rgba(8,145,178,0.25)",fontSize:"11px",fontWeight:600,color:"#0891b2",letterSpacing:"0.04em"}}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {lang==="th"?"ลูกค้า":"CUSTOMERS"}
            </span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div>
              <h1 style={{fontFamily:"var(--font-display)",fontSize:"32px",fontWeight:800,letterSpacing:"-0.04em",color:"var(--text-primary)",lineHeight:1,marginBottom:"6px"}}>
                {lang==="th"?"ลูกค้าทั้งหมด":"All Customers"}
              </h1>
              <p style={{fontSize:"13.5px",color:"var(--text-muted)",fontWeight:500}}>
                {filtered.length} {lang==="th"?"ลูกค้าในระบบ CRM":"customers in your CRM"}
              </p>
            </div>
            <button onClick={openAdd} style={{display:"flex",alignItems:"center",gap:"8px",padding:"11px 22px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#0891b2,#0e7490)",color:"white",fontSize:"14px",fontWeight:700,fontFamily:"var(--font-display)",cursor:"pointer",boxShadow:"0 4px 20px rgba(8,145,178,0.35)",transition:"all 0.2s"}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLElement).style.boxShadow="0 8px 28px rgba(8,145,178,0.5)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(0)";(e.currentTarget as HTMLElement).style.boxShadow="0 4px 20px rgba(8,145,178,0.35)";}}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              {lang==="th"?"เพิ่มลูกค้า":"New Customer"}
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="fade-up fade-up-1" style={{marginBottom:"24px",position:"relative",maxWidth:"480px"}}>
          <svg style={{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)"}} width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>
          <input type="text" placeholder={lang==="th"?"ค้นหาชื่อ บริษัท หรืออีเมล...":"Search by name, company or email..."} value={search} onChange={e=>setSearch(e.target.value)} style={{...inputStyle,paddingLeft:"42px"}} onFocus={focusFn} onBlur={blurFn}/>
        </div>

        {/* GRID */}
        {loading ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"200px"}}>
            <div style={{width:"36px",height:"36px",border:"3px solid var(--border)",borderTopColor:"#0891b2",borderRadius:"50%",animation:"spin-slow 0.8s linear infinite"}}/>
          </div>
        ) : (
          <div className="fade-up fade-up-2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"16px"}}>
            {filtered.length === 0 && (
              <div style={{gridColumn:"1/-1",padding:"64px",textAlign:"center"}}>
                <div style={{fontSize:"40px",marginBottom:"12px"}}>👤</div>
                <p style={{color:"var(--text-muted)",fontSize:"14px"}}>{lang==="th"?"ไม่พบลูกค้า":"No customers found."}</p>
              </div>
            )}
            {filtered.map((c,idx) => {
              const color = getColor(c.customer_name||"A");
              const isHovered = hoveredId === c.customer_id;
              return (
                <div key={c.customer_id} className="fade-up"
                  onMouseEnter={()=>setHoveredId(c.customer_id)}
                  onMouseLeave={()=>setHoveredId(null)}
                  style={{background:"var(--bg-card)",borderRadius:"16px",border:"1px solid var(--border)",padding:"22px",backdropFilter:"blur(12px)",boxShadow:isHovered?`0 8px 28px ${color}25, var(--shadow-card)`:"var(--shadow-card)",transition:"all 0.25s ease",transform:isHovered?"translateY(-3px)":"translateY(0)",borderColor:isHovered?`${color}40`:"var(--border)",animationDelay:`${idx*0.05}s`}}
                >
                  {/* Avatar + actions */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"14px"}}>
                    <div style={{width:"48px",height:"48px",borderRadius:"14px",background:`linear-gradient(135deg,${color},${color}aa)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",fontWeight:800,color:"white",fontFamily:"var(--font-display)",boxShadow:`0 4px 14px ${color}40`}}>
                      {(c.customer_name||"?")[0].toUpperCase()}
                    </div>
                    <div style={{display:"flex",gap:"6px"}}>
                      <button onClick={()=>openEdit(c)} style={{width:"30px",height:"30px",borderRadius:"8px",border:"1px solid var(--border)",background:"var(--input-bg)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-muted)",transition:"all 0.15s"}}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--accent)";(e.currentTarget as HTMLElement).style.borderColor="var(--border-hover)";}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--text-muted)";(e.currentTarget as HTMLElement).style.borderColor="var(--border)";}}
                      >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z"/></svg>
                      </button>
                      <button onClick={()=>del(c.customer_id)} disabled={deletingId===c.customer_id} style={{width:"30px",height:"30px",borderRadius:"8px",border:"1px solid var(--border)",background:"var(--input-bg)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-muted)",transition:"all 0.15s"}}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#f87171";(e.currentTarget as HTMLElement).style.borderColor="rgba(239,68,68,0.3)";(e.currentTarget as HTMLElement).style.background="rgba(239,68,68,0.08)";}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--text-muted)";(e.currentTarget as HTMLElement).style.borderColor="var(--border)";(e.currentTarget as HTMLElement).style.background="var(--input-bg)";}}
                      >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>

                  {/* Name + company */}
                  <h3 style={{fontFamily:"var(--font-display)",fontSize:"16px",fontWeight:700,color:"var(--text-primary)",marginBottom:"3px",letterSpacing:"-0.02em"}}>{c.customer_name}</h3>
                  {c.customer_company && (
                    <div style={{display:"flex",alignItems:"center",gap:"5px",marginBottom:"14px"}}>
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                      <span style={{fontSize:"12.5px",color:"var(--text-muted)",fontWeight:500}}>{c.customer_company}</span>
                    </div>
                  )}

                  <div style={{borderTop:"1px solid var(--border)",paddingTop:"14px",display:"flex",flexDirection:"column",gap:"8px"}}>
                    {c.customer_email && (
                      <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                        <div style={{width:"22px",height:"22px",borderRadius:"6px",background:`${color}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <span style={{fontSize:"12.5px",color:"var(--text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.customer_email}</span>
                      </div>
                    )}
                    {c.customer_phone && (
                      <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                        <div style={{width:"22px",height:"22px",borderRadius:"6px",background:`${color}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        </div>
                        <span style={{fontSize:"12.5px",color:"var(--text-secondary)"}}>{c.customer_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)"}} onClick={e=>{if(e.target===e.currentTarget)setShowModal(false);}}>
          <div className="fade-up" style={{background:"var(--bg-sidebar)",border:"1px solid var(--border)",borderRadius:"20px",padding:"32px",width:"480px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.4)"}}>
            {/* Modal header */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
              <div>
                <h2 style={{fontFamily:"var(--font-display)",fontSize:"20px",fontWeight:800,color:"var(--text-primary)",letterSpacing:"-0.03em"}}>
                  {editing ? (lang==="th"?"แก้ไขลูกค้า":"Edit Customer") : (lang==="th"?"เพิ่มลูกค้า":"New Customer")}
                </h2>
                <p style={{fontSize:"12px",color:"var(--text-muted)",marginTop:"2px"}}>{editing?.customer_name||""}</p>
              </div>
              <button onClick={()=>setShowModal(false)} style={{width:"32px",height:"32px",borderRadius:"50%",border:"1px solid var(--border)",background:"var(--input-bg)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-muted)",transition:"all 0.15s"}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--text-primary)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--text-muted)";}}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <Field label={lang==="th"?"ชื่อ*":"Name*"}>
              <input value={form.customer_name} onChange={e=>setForm({...form,customer_name:e.target.value})} placeholder="Full name" style={inputStyle} onFocus={focusFn} onBlur={blurFn}/>
            </Field>
            <Field label={lang==="th"?"บริษัท":"Company"}>
              <input value={form.customer_company} onChange={e=>setForm({...form,customer_company:e.target.value})} placeholder="Company name" style={inputStyle} onFocus={focusFn} onBlur={blurFn}/>
            </Field>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <Field label={lang==="th"?"อีเมล":"Email"}>
                <input type="email" value={form.customer_email} onChange={e=>setForm({...form,customer_email:e.target.value})} placeholder="email@company.com" style={inputStyle} onFocus={focusFn} onBlur={blurFn}/>
              </Field>
              <Field label={lang==="th"?"โทรศัพท์":"Phone"}>
                <input value={form.customer_phone} onChange={e=>setForm({...form,customer_phone:e.target.value})} placeholder="+1 000 000 0000" style={inputStyle} onFocus={focusFn} onBlur={blurFn}/>
              </Field>
            </div>
            <Field label={lang==="th"?"ที่อยู่":"Address"}>
              <input value={form.customer_address} onChange={e=>setForm({...form,customer_address:e.target.value})} placeholder="Billing address" style={inputStyle} onFocus={focusFn} onBlur={blurFn}/>
            </Field>
            <Field label={lang==="th"?"เลขประจำตัวผู้เสียภาษี":"Tax ID"}>
              <input value={form.tax_id||""} onChange={e=>setForm({...form,tax_id:e.target.value})} placeholder="Tax ID number" style={inputStyle} onFocus={focusFn} onBlur={blurFn}/>
            </Field>

            <div style={{display:"flex",gap:"12px",marginTop:"8px"}}>
              <button onClick={()=>setShowModal(false)} style={{flex:1,padding:"11px",borderRadius:"12px",border:"1px solid var(--border)",background:"transparent",color:"var(--text-secondary)",fontSize:"13.5px",fontWeight:600,fontFamily:"var(--font-body)",cursor:"pointer",transition:"all 0.2s"}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border-hover)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)";}}
              >
                {lang==="th"?"ยกเลิก":"Cancel"}
              </button>
              <button onClick={save} disabled={saving} style={{flex:2,padding:"11px",borderRadius:"12px",border:"none",background:saving?"var(--border)":"linear-gradient(135deg,#0891b2,#0e7490)",color:"white",fontSize:"13.5px",fontWeight:700,fontFamily:"var(--font-display)",cursor:saving?"not-allowed":"pointer",boxShadow:saving?"none":"0 4px 16px rgba(8,145,178,0.35)",transition:"all 0.2s"}}
                onMouseEnter={e=>{if(!saving){(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(8,145,178,0.45)";}}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(0)";(e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(8,145,178,0.35)";}}
              >
                {saving ? (lang==="th"?"กำลังบันทึก...":"Saving...") : (editing ? (lang==="th"?"บันทึกการเปลี่ยนแปลง":"Save Changes") : (lang==="th"?"เพิ่มลูกค้า":"Add Customer"))}
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}