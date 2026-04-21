"use client";
/* ================================================================
   app/edit/[id]/page.tsx
   Full edit page — same layout as Create, loads existing data
   Save → PUT /quotations/:id → redirect to "/"
   ================================================================ */
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SidebarLayout, useLang } from "@/components/SidebarLayout";

type Customer = { customer_name:string; customer_company:string; customer_phone:string; customer_address:string; customer_email:string; };
type CustomerDB = Customer & { customer_id:number; tax_id?:string };
type Item = { item_id?:number; product_name:string; description:string; qty:number; unit_price:number; discount:number; discount_type?:string };

const inputStyle: React.CSSProperties = { width:"100%", padding:"10px 14px", border:"1px solid var(--border)", borderRadius:"10px", fontSize:"13.5px", background:"var(--input-bg)", color:"var(--text-primary)", outline:"none", fontFamily:"var(--font-body)", transition:"border-color 0.2s, box-shadow 0.2s" };
const focusFn = (e:React.FocusEvent<any>) => { e.target.style.borderColor="var(--border-hover)"; e.target.style.boxShadow="0 0 0 3px var(--accent-glow)"; };
const blurFn  = (e:React.FocusEvent<any>) => { e.target.style.borderColor="var(--border)"; e.target.style.boxShadow="none"; };

function Field({ label, children }: { label:string; children:React.ReactNode }) {
  return <div><label style={{ display:"block", fontSize:"11.5px", fontWeight:600, color:"var(--text-muted)", marginBottom:"6px", letterSpacing:"0.03em" }}>{label}</label>{children}</div>;
}

/* ---- Custom Dropdown (same as create page) ---- */
function CustomerDropdown({ customers, selected, onSelect, placeholder }: { customers:CustomerDB[]; selected:number|null; onSelect:(id:number)=>void; placeholder:string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = customers.filter(c => c.customer_name.toLowerCase().includes(q.toLowerCase()) || (c.customer_company||"").toLowerCase().includes(q.toLowerCase()));
  const selectedC = customers.find(c => c.customer_id===selected);
  useEffect(() => { const h = (e:MouseEvent) => { if(ref.current&&!ref.current.contains(e.target as Node)) setOpen(false); }; document.addEventListener("mousedown",h); return ()=>document.removeEventListener("mousedown",h); }, []);
  useEffect(() => { if(open&&inputRef.current) inputRef.current.focus(); }, [open]);
  return (
    <div ref={ref} style={{position:"relative"}}>
      <button type="button" onClick={()=>setOpen(!open)} style={{...inputStyle,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",textAlign:"left",border:"1px solid var(--border)",transition:"all 0.2s"}}
        onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="var(--border-hover)"}
        onMouseLeave={e=>{if(!open)(e.currentTarget as HTMLElement).style.borderColor="var(--border)";}}
      >
        <span style={{color:selectedC?"var(--text-primary)":"var(--text-muted)",fontSize:"13.5px"}}>{selectedC?`${selectedC.customer_name}${selectedC.customer_company?` — ${selectedC.customer_company}`:""}`:placeholder}</span>
        <svg style={{transform:open?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s",flexShrink:0}} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,zIndex:200,background:"var(--bg-sidebar)",border:"1px solid var(--border)",borderRadius:"12px",boxShadow:"0 8px 32px rgba(0,0,0,0.3)",overflow:"hidden",opacity:open?1:0,transform:open?"translateY(0) scaleY(1)":"translateY(-6px) scaleY(0.96)",transformOrigin:"top",transition:"opacity 0.18s ease,transform 0.18s ease",pointerEvents:open?"auto":"none",backdropFilter:"blur(20px)"}}>
        <div style={{padding:"10px",borderBottom:"1px solid var(--border)"}}>
          <div style={{position:"relative"}}>
            <svg style={{position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)"}} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>
            <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." style={{width:"100%",padding:"7px 10px 7px 30px",border:"1px solid var(--border)",borderRadius:"8px",fontSize:"13px",background:"var(--input-bg)",color:"var(--text-primary)",outline:"none",fontFamily:"var(--font-body)"}}/>
          </div>
        </div>
        <div style={{maxHeight:"220px",overflowY:"auto"}}>
          {filtered.length===0&&<div style={{padding:"20px",textAlign:"center",color:"var(--text-muted)",fontSize:"13px"}}>No customers found</div>}
          {filtered.map(c=>(
            <button key={c.customer_id} type="button" onClick={()=>{onSelect(c.customer_id);setOpen(false);setQ("");}} style={{display:"flex",alignItems:"center",gap:"10px",width:"100%",padding:"10px 14px",border:"none",background:selected===c.customer_id?"rgba(124,58,237,0.1)":"transparent",cursor:"pointer",textAlign:"left",transition:"background 0.15s",fontFamily:"var(--font-body)"}}
              onMouseEnter={e=>{if(selected!==c.customer_id)(e.currentTarget as HTMLElement).style.background="var(--bg-card-hover)";}}
              onMouseLeave={e=>{if(selected!==c.customer_id)(e.currentTarget as HTMLElement).style.background="transparent";}}
            >
              <div style={{width:"28px",height:"28px",borderRadius:"8px",background:selected===c.customer_id?"linear-gradient(135deg,#7c3aed,#db2777)":"rgba(124,58,237,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:"11px",fontWeight:700,color:selected===c.customer_id?"white":"var(--accent)"}}>{c.customer_name[0]?.toUpperCase()}</span>
              </div>
              <div>
                <div style={{fontSize:"13.5px",fontWeight:600,color:"var(--text-primary)"}}>{c.customer_name}</div>
                {c.customer_company&&<div style={{fontSize:"11px",color:"var(--text-muted)"}}>{c.customer_company}</div>}
              </div>
              {selected===c.customer_id&&<svg style={{marginLeft:"auto",color:"var(--accent)"}} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- VAT Toggle ---- */
function VatToggle({ enabled, onChange, amount, moneyFn }: { enabled:boolean; onChange:(v:boolean)=>void; amount:number; moneyFn:(n:number)=>string }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <button type="button" onClick={()=>onChange(!enabled)} style={{display:"flex",alignItems:"center",gap:"10px",background:"none",border:"none",cursor:"pointer",padding:0}}>
        <div style={{width:"40px",height:"22px",borderRadius:"11px",background:enabled?"linear-gradient(135deg,var(--accent),var(--accent-2))":"var(--border)",position:"relative",transition:"background 0.25s ease",flexShrink:0,boxShadow:enabled?"0 0 12px rgba(124,58,237,0.4)":"none"}}>
          <div style={{position:"absolute",top:"3px",left:enabled?"21px":"3px",width:"16px",height:"16px",borderRadius:"50%",background:"white",transition:"left 0.25s ease",boxShadow:"0 1px 4px rgba(0,0,0,0.25)"}}/>
        </div>
        <span style={{fontSize:"13.5px",color:enabled?"var(--text-primary)":"var(--text-muted)",fontWeight:enabled?600:400,transition:"color 0.2s"}}>VAT (7%)</span>
      </button>
      <span style={{fontSize:"13.5px",color:enabled?"var(--text-secondary)":"var(--text-muted)",fontFamily:"var(--font-mono)",fontWeight:600,transition:"color 0.2s"}}>{enabled?moneyFn(amount):"—"}</span>
    </div>
  );
}

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLang();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  const [allCustomers, setAllCustomers] = useState<CustomerDB[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number|null>(null);
  const [customer, setCustomer] = useState<Customer>({ customer_name:"", customer_company:"", customer_phone:"", customer_address:"", customer_email:"" });
  const [items, setItems] = useState<Item[]>([]);
  const [date, setDate] = useState("");
  const [expiry, setExpiry] = useState("");
  const [status, setStatus] = useState("draft");
  const [vatEnabled, setVatEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* Load existing quotation + customers */
  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`${API}/customers`).then(r=>r.json()).catch(()=>[]),
      fetch(`${API}/quotations/${id}`).then(r=>{ if(!r.ok) throw new Error(); return r.json(); }).catch(()=>null),
    ]).then(([custs, qt]) => {
      setAllCustomers(custs||[]);
      if (qt) {
        setCustomer({ customer_name:qt.customer_name||"", customer_company:qt.customer_company||"", customer_phone:qt.customer_phone||"", customer_address:qt.customer_address||"", customer_email:qt.customer_email||"" });
        setSelectedCustomerId(qt.customer_id||null);
        setDate(qt.issue_date||"");
        setExpiry(qt.expiry_date||"");
        setStatus(qt.status||"draft");
        setItems((qt.items||[]).map((i:any) => ({
          item_id: i.item_id, product_name: i.product_name||"",
          description: i.description||"", qty: i.qty||1,
          unit_price: i.unit_price||0,
          discount: i.discount_percent||i.discount||0,
          discount_type: i.discount_type||"%",
        })));
      }
      setLoading(false);
    });
  }, [id]);

  const selectCustomer = (cid:number) => {
    setSelectedCustomerId(cid);
    const c = allCustomers.find(c=>c.customer_id===cid); if(!c) return;
    setCustomer({ customer_name:c.customer_name, customer_company:c.customer_company, customer_phone:c.customer_phone, customer_address:c.customer_address, customer_email:c.customer_email });
  };

  const addRow = () => setItems([...items,{product_name:"",description:"",qty:1,unit_price:0,discount:0,discount_type:"%"}]);
  const deleteRow = (i:number) => setItems(items.filter((_,idx)=>idx!==i));
  const updateItem = <K extends keyof Item>(i:number,field:K,value:Item[K]) => { const n=[...items]; n[i][field]=value; setItems(n); };

  const subtotal = items.reduce((s,i)=>s+i.qty*i.unit_price*(1-i.discount/100),0);
  const totalDiscount = items.reduce((s,i)=>s+i.qty*i.unit_price*(i.discount/100),0);
  const vat = vatEnabled ? subtotal*0.07 : 0;
  const total = subtotal+vat;
  const money = (n:number) => n.toLocaleString("en-US",{style:"currency",currency:"USD"});

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/quotations/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ customer_id:selectedCustomerId, customer, issue_date:date, expiry_date:expiry, status, items: items.map(i=>({ ...i, discount_percent:i.discount })) }),
      });
      if(!res.ok) throw new Error();
      router.push("/");
    } catch { alert("บันทึกไม่สำเร็จ ❌"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <SidebarLayout>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}>
        <div style={{textAlign:"center"}}>
          <div style={{width:"40px",height:"40px",margin:"0 auto 16px",border:"3px solid var(--border)",borderTopColor:"var(--accent)",borderRadius:"50%",animation:"spin-slow 0.8s linear infinite"}}/>
          <p style={{color:"var(--text-muted)",fontSize:"14px"}}>{t("loading")}</p>
        </div>
      </div>
    </SidebarLayout>
  );

  return (
    <SidebarLayout>
      <div style={{padding:"32px 36px 60px"}}>

        {/* HEADER */}
        <div className="fade-up" style={{marginBottom:"28px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"10px"}}>
            <button onClick={()=>router.push(`/detail/${id}`)} style={{display:"flex",alignItems:"center",gap:"5px",background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)",fontSize:"12.5px",fontWeight:500,fontFamily:"var(--font-body)",padding:"4px 0",transition:"color 0.2s"}}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--accent)"}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--text-muted)"}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              {t("quotationDetails")}
            </button>
            <span style={{color:"var(--border)",fontSize:"12px"}}>/</span>
            <span style={{color:"var(--text-secondary)",fontSize:"12.5px",fontFamily:"var(--font-mono)"}}>{`QT-${id}`}</span>
            <span style={{color:"var(--border)",fontSize:"12px"}}>/</span>
            <span style={{color:"var(--accent)",fontSize:"12.5px",fontWeight:600}}>{t("edit")}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <h1 style={{fontFamily:"var(--font-display)",fontSize:"28px",fontWeight:800,letterSpacing:"-0.04em",color:"var(--text-primary)"}}>{t("edit")} Quotation</h1>
            <span style={{padding:"4px 12px",borderRadius:"20px",background:"rgba(251,191,36,0.12)",color:"#f59e0b",fontSize:"11.5px",fontWeight:700,border:"1px solid rgba(251,191,36,0.25)"}}>✎ Editing</span>
          </div>
        </div>

        {/* ORDER DETAILS BAR */}
        <div className="fade-up fade-up-1" style={{background:"var(--bg-card)",borderRadius:"14px",border:"1px solid var(--border)",padding:"20px 24px",marginBottom:"20px",backdropFilter:"blur(12px)"}}>
          <h3 style={{fontFamily:"var(--font-display)",fontSize:"13px",fontWeight:700,color:"var(--text-muted)",letterSpacing:"0.08em",marginBottom:"16px"}}>{t("docDetails").toUpperCase()}</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px"}}>
            <div>
              <label style={{display:"block",fontSize:"10.5px",color:"var(--text-muted)",fontWeight:600,marginBottom:"5px",letterSpacing:"0.04em"}}>{t("docNumber").toUpperCase()}</label>
              <div style={{...inputStyle,background:"var(--border)",color:"var(--text-muted)",padding:"10px 14px",cursor:"not-allowed"}}>QT-{id}</div>
            </div>
            <div>
              <label style={{display:"block",fontSize:"10.5px",color:"var(--text-muted)",fontWeight:600,marginBottom:"5px",letterSpacing:"0.04em"}}>{t("issueDate").toUpperCase()}</label>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inputStyle} onFocus={focusFn} onBlur={blurFn}/>
            </div>
            <div>
              <label style={{display:"block",fontSize:"10.5px",color:"var(--text-muted)",fontWeight:600,marginBottom:"5px",letterSpacing:"0.04em"}}>{t("expiryDate").toUpperCase()}</label>
              <input type="date" value={expiry} onChange={e=>setExpiry(e.target.value)} style={inputStyle} onFocus={focusFn} onBlur={blurFn}/>
            </div>
            <div>
              <label style={{display:"block",fontSize:"10.5px",color:"var(--text-muted)",fontWeight:600,marginBottom:"5px",letterSpacing:"0.04em"}}>{t("status").toUpperCase()}</label>
              <select value={status} onChange={e=>setStatus(e.target.value)} style={{...inputStyle,cursor:"pointer"}} onFocus={focusFn} onBlur={blurFn}>
                <option value="draft">{t("draft")}</option>
                <option value="sent">{t("sent")}</option>
                <option value="confirmed">{t("confirmed")}</option>
                <option value="cancel">{t("cancelled")}</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:"20px",alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>

            {/* CUSTOMER */}
            <div className="fade-up fade-up-1" style={{background:"var(--bg-card)",borderRadius:"14px",border:"1px solid var(--border)",padding:"24px",backdropFilter:"blur(12px)",boxShadow:"var(--shadow-card)"}}>
              <h2 style={{fontFamily:"var(--font-display)",fontSize:"15px",fontWeight:700,color:"var(--text-primary)",marginBottom:"18px",display:"flex",alignItems:"center",gap:"8px"}}>
                <span style={{width:"28px",height:"28px",borderRadius:"8px",background:"rgba(124,58,237,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </span>
                {t("customerInfo")}
              </h2>
              <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                <Field label={t("selectCustomer").toUpperCase()}>
                  <CustomerDropdown customers={allCustomers} selected={selectedCustomerId} onSelect={selectCustomer} placeholder={t("selectCustomer")}/>
                </Field>
                <Field label={t("customerName")}>
                  <input value={customer.customer_name} onChange={e=>setCustomer({...customer,customer_name:e.target.value})} style={inputStyle} onFocus={focusFn} onBlur={blurFn}/>
                </Field>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
                  <Field label={t("company")}><input value={customer.customer_company} onChange={e=>setCustomer({...customer,customer_company:e.target.value})} style={inputStyle} onFocus={focusFn} onBlur={blurFn}/></Field>
                  <Field label={t("phone")}><input value={customer.customer_phone} onChange={e=>setCustomer({...customer,customer_phone:e.target.value})} style={inputStyle} onFocus={focusFn} onBlur={blurFn}/></Field>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
                  <Field label={t("billingAddr")}><input value={customer.customer_address} onChange={e=>setCustomer({...customer,customer_address:e.target.value})} style={inputStyle} onFocus={focusFn} onBlur={blurFn}/></Field>
                  <Field label={t("shippingAddr")}><input value={customer.customer_address} onChange={e=>setCustomer({...customer,customer_address:e.target.value})} style={inputStyle} onFocus={focusFn} onBlur={blurFn}/></Field>
                </div>
                <Field label={t("email")}><input type="email" value={customer.customer_email} onChange={e=>setCustomer({...customer,customer_email:e.target.value})} style={inputStyle} onFocus={focusFn} onBlur={blurFn}/></Field>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="fade-up fade-up-2" style={{background:"var(--bg-card)",borderRadius:"14px",border:"1px solid var(--border)",padding:"24px",backdropFilter:"blur(12px)",boxShadow:"var(--shadow-card)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}>
                <h2 style={{fontFamily:"var(--font-display)",fontSize:"15px",fontWeight:700,color:"var(--text-primary)",display:"flex",alignItems:"center",gap:"8px"}}>
                  <span style={{width:"28px",height:"28px",borderRadius:"8px",background:"rgba(124,58,237,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  </span>
                  {t("products")}
                </h2>
                <button onClick={addRow} style={{display:"flex",alignItems:"center",gap:"6px",padding:"8px 16px",borderRadius:"10px",background:"rgba(124,58,237,0.12)",color:"var(--accent)",fontSize:"13px",fontWeight:700,fontFamily:"var(--font-body)",cursor:"pointer",transition:"all 0.2s",border:"1px solid rgba(124,58,237,0.2)"}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(124,58,237,0.2)";(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="rgba(124,58,237,0.12)";(e.currentTarget as HTMLElement).style.transform="translateY(0)";}}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                  {t("addItem")}
                </button>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid var(--border)"}}>
                      {[t("product"),t("description"),t("qty"),t("unitPrice"),t("discount"),t("type"),t("lineTotal"),""].map((h,i)=>(
                        <th key={i} style={{padding:"8px 10px",textAlign:i>=2?"center":"left",fontSize:"10.5px",fontWeight:700,color:"var(--text-muted)",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.length===0&&<tr><td colSpan={8} style={{padding:"40px",textAlign:"center",color:"var(--text-muted)",fontSize:"13.5px"}}>{t("noItems")}</td></tr>}
                    {items.map((item,i)=>{
                      const lineTotal=item.qty*item.unit_price*(1-item.discount/100);
                      return (
                        <tr key={i} style={{borderBottom:"1px solid var(--border)"}}>
                          <td style={{padding:"8px 6px"}}><input value={item.product_name} onChange={e=>updateItem(i,"product_name",e.target.value)} placeholder={t("product")} style={{...inputStyle,width:"140px",padding:"8px 10px",fontSize:"13px"}} onFocus={focusFn} onBlur={blurFn}/></td>
                          <td style={{padding:"8px 6px"}}><input value={item.description} onChange={e=>updateItem(i,"description",e.target.value)} placeholder={t("description")} style={{...inputStyle,width:"160px",padding:"8px 10px",fontSize:"13px"}} onFocus={focusFn} onBlur={blurFn}/></td>
                          <td style={{padding:"8px 6px"}}><input type="number" value={item.qty} onChange={e=>updateItem(i,"qty",Number(e.target.value))} style={{...inputStyle,width:"62px",padding:"8px 10px",fontSize:"13px",textAlign:"center"}} onFocus={focusFn} onBlur={blurFn}/></td>
                          <td style={{padding:"8px 6px"}}><input type="number" value={item.unit_price} onChange={e=>updateItem(i,"unit_price",Number(e.target.value))} style={{...inputStyle,width:"100px",padding:"8px 10px",fontSize:"13px",textAlign:"right"}} onFocus={focusFn} onBlur={blurFn}/></td>
                          <td style={{padding:"8px 6px"}}><input type="number" value={item.discount} onChange={e=>updateItem(i,"discount",Number(e.target.value))} style={{...inputStyle,width:"70px",padding:"8px 10px",fontSize:"13px",textAlign:"center"}} onFocus={focusFn} onBlur={blurFn}/></td>
                          <td style={{padding:"8px 6px"}}>
                            <select value={item.discount_type||"%"} onChange={e=>updateItem(i,"discount_type",e.target.value)} style={{...inputStyle,width:"70px",padding:"8px 8px",fontSize:"12px"}}>
                              <option>%</option><option>$</option>
                            </select>
                          </td>
                          <td style={{padding:"8px 12px",textAlign:"right",fontWeight:700,fontFamily:"var(--font-mono)",fontSize:"13px",color:"var(--text-primary)",whiteSpace:"nowrap"}}>{money(lineTotal)}</td>
                          <td style={{padding:"8px 6px"}}>
                            <button onClick={()=>deleteRow(i)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)",padding:"6px",borderRadius:"6px",display:"flex",alignItems:"center",transition:"all 0.15s"}}
                              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#f87171";(e.currentTarget as HTMLElement).style.background="rgba(239,68,68,0.1)";}}
                              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--text-muted)";(e.currentTarget as HTMLElement).style.background="none";}}
                            ><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="fade-up fade-up-3" style={{position:"sticky",top:"76px",background:"var(--bg-card)",borderRadius:"14px",border:"1px solid var(--border)",padding:"24px",backdropFilter:"blur(12px)",boxShadow:"var(--shadow-card)"}}>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:"13px",fontWeight:700,color:"var(--text-muted)",letterSpacing:"0.08em",marginBottom:"20px"}}>{t("summary")}</h2>
            <div style={{display:"flex",flexDirection:"column",gap:"12px",marginBottom:"20px"}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:"13.5px",color:"var(--text-secondary)",fontWeight:500}}>{t("subtotal")}</span>
                <span style={{fontSize:"13.5px",color:"var(--text-secondary)",fontWeight:600,fontFamily:"var(--font-mono)"}}>{money(subtotal+totalDiscount)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:"13.5px",color:"var(--text-secondary)",fontWeight:500}}>{t("discountRow")}</span>
                <span style={{fontSize:"13.5px",color:"#f87171",fontWeight:600,fontFamily:"var(--font-mono)"}}>-{money(totalDiscount)}</span>
              </div>
              <VatToggle enabled={vatEnabled} onChange={setVatEnabled} amount={vat} moneyFn={money}/>
            </div>
            <div style={{borderTop:"1px solid var(--border)",paddingTop:"16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
              <span style={{fontSize:"14px",fontWeight:800,fontFamily:"var(--font-display)",color:"var(--text-primary)",letterSpacing:"-0.02em"}}>{t("grandTotal")}</span>
              <span style={{fontSize:"22px",fontWeight:900,fontFamily:"var(--font-mono)",letterSpacing:"-0.03em",background:"linear-gradient(135deg,var(--accent),var(--accent-2))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{money(total)}</span>
            </div>
            {/* Save button */}
            <button onClick={save} disabled={saving} style={{width:"100%",padding:"13px",borderRadius:"12px",border:"none",background:saving?"var(--border)":"linear-gradient(135deg,#7c3aed,#db2777)",color:"white",fontSize:"14px",fontWeight:800,fontFamily:"var(--font-display)",letterSpacing:"-0.01em",cursor:saving?"not-allowed":"pointer",boxShadow:saving?"none":"0 4px 20px rgba(124,58,237,0.4)",transition:"all 0.2s ease",marginBottom:"10px"}}
              onMouseEnter={e=>{if(!saving){(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLElement).style.boxShadow="0 8px 28px rgba(124,58,237,0.5)";}}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(0)";(e.currentTarget as HTMLElement).style.boxShadow="0 4px 20px rgba(124,58,237,0.4)";}}
            >
              {saving ? t("saving") : `✦ ${t("save")} Changes`}
            </button>
            {/* Cancel edit */}
            <button onClick={()=>router.push(`/detail/${id}`)} style={{width:"100%",padding:"11px",borderRadius:"12px",border:"1px solid var(--border)",background:"transparent",color:"var(--text-secondary)",fontSize:"13.5px",fontWeight:600,fontFamily:"var(--font-body)",cursor:"pointer",transition:"all 0.2s"}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border-hover)";(e.currentTarget as HTMLElement).style.color="var(--text-primary)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)";(e.currentTarget as HTMLElement).style.color="var(--text-secondary)";}}
            >
              {t("cancel")} {t("edit")}
            </button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}