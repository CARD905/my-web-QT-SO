"use client";
/* ================================================================
   app/products/page.tsx
   - Table view: SKU | Product | Description | Unit Price
   - Search by name/SKU
   - Add / Edit (modal) / Delete
   - API: GET/POST/PUT/DELETE /products
   - Auto-fill integration: products list is fetched in create/edit
     quotation pages to populate product dropdowns
   ================================================================ */
import { useEffect, useState } from "react";
import { SidebarLayout, useLang } from "@/components/SidebarLayout";

type Product = {
  product_id: number;
  product_name: string;
  sku?: string;
  description: string;
  unit_price: number;
  category?: string;
};

const emptyProduct: Omit<Product,"product_id"> = {
  product_name: "", sku: "", description: "", unit_price: 0, category: "",
};

const inputStyle: React.CSSProperties = { width:"100%", padding:"10px 14px", border:"1px solid var(--border)", borderRadius:"10px", fontSize:"13.5px", background:"var(--input-bg)", color:"var(--text-primary)", outline:"none", fontFamily:"var(--font-body)", transition:"border-color 0.2s, box-shadow 0.2s" };
const focusFn = (e:React.FocusEvent<any>) => { e.target.style.borderColor="var(--border-hover)"; e.target.style.boxShadow="0 0 0 3px var(--accent-glow)"; };
const blurFn  = (e:React.FocusEvent<any>) => { e.target.style.borderColor="var(--border)"; e.target.style.boxShadow="none"; };

function Field({ label, children }: { label:string; children:React.ReactNode }) {
  return <div style={{marginBottom:"14px"}}><label style={{display:"block",fontSize:"11.5px",fontWeight:600,color:"var(--text-muted)",marginBottom:"6px",letterSpacing:"0.03em"}}>{label}</label>{children}</div>;
}

const CATEGORY_COLORS: Record<string,string> = {
  software:    "#7c3aed",
  service:     "#0891b2",
  hardware:    "#059669",
  training:    "#d97706",
  support:     "#db2777",
  other:       "#6366f1",
};
const getCatColor = (cat?: string) => CATEGORY_COLORS[(cat||"").toLowerCase()] || "#6366f1";

export default function ProductsPage() {
  const { lang } = useLang();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product,"product_id">>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch(`${API}/products`)
      .then(r => r.ok ? r.json() : [])
      .then(d => setProducts(d || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = products.filter(p =>
    (p.product_name||"").toLowerCase().includes(search.toLowerCase()) ||
    (p.sku||"").toLowerCase().includes(search.toLowerCase()) ||
    (p.category||"").toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(emptyProduct); setShowModal(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ product_name:p.product_name, sku:p.sku||"", description:p.description, unit_price:p.unit_price, category:p.category||"" }); setShowModal(true); };

  const save = async () => {
    setSaving(true);
    try {
      const url = editing ? `${API}/products/${editing.product_id}` : `${API}/products`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setShowModal(false);
      load();
    } catch { alert(lang==="th"?"บันทึกไม่สำเร็จ":"Save failed"); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm(lang==="th"?"ต้องการลบสินค้านี้?":"Delete this product?")) return;
    setDeletingId(id);
    try {
      await fetch(`${API}/products/${id}`, { method:"DELETE" });
      setProducts(prev => prev.filter(p => p.product_id !== id));
    } catch { alert("Delete failed"); }
    finally { setDeletingId(null); }
  };

  const money = (n:number) => n.toLocaleString("en-US",{style:"currency",currency:"USD"});

  const totalValue = products.reduce((s,p)=>s+p.unit_price,0);

  return (
    <SidebarLayout>
      <div style={{padding:"36px 36px 60px"}}>

        {/* HEADER */}
        <div className="fade-up" style={{marginBottom:"28px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"12px"}}>
            <span style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"3px 10px 3px 8px",borderRadius:"20px",background:"rgba(5,150,105,0.1)",border:"1px solid rgba(5,150,105,0.25)",fontSize:"11px",fontWeight:600,color:"#059669",letterSpacing:"0.04em"}}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              {lang==="th"?"สินค้า":"PRODUCTS"}
            </span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div>
              <h1 style={{fontFamily:"var(--font-display)",fontSize:"32px",fontWeight:800,letterSpacing:"-0.04em",color:"var(--text-primary)",lineHeight:1,marginBottom:"6px"}}>
                {lang==="th"?"แคตตาล็อกสินค้า":"Product Catalog"}
              </h1>
              <p style={{fontSize:"13.5px",color:"var(--text-muted)",fontWeight:500}}>
                {filtered.length} {lang==="th"?"สินค้าที่มีในระบบ":"products available"}
              </p>
            </div>
            <button onClick={openAdd} style={{display:"flex",alignItems:"center",gap:"8px",padding:"11px 22px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#059669,#047857)",color:"white",fontSize:"14px",fontWeight:700,fontFamily:"var(--font-display)",cursor:"pointer",boxShadow:"0 4px 20px rgba(5,150,105,0.35)",transition:"all 0.2s"}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLElement).style.boxShadow="0 8px 28px rgba(5,150,105,0.5)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(0)";(e.currentTarget as HTMLElement).style.boxShadow="0 4px 20px rgba(5,150,105,0.35)";}}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              {lang==="th"?"เพิ่มสินค้า":"New Product"}
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="fade-up fade-up-1" style={{marginBottom:"20px",position:"relative",maxWidth:"480px"}}>
          <svg style={{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)"}} width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>
          <input type="text" placeholder={lang==="th"?"ค้นหาชื่อสินค้าหรือ SKU...":"Search by name or SKU..."} value={search} onChange={e=>setSearch(e.target.value)} style={{...inputStyle,paddingLeft:"42px"}} onFocus={focusFn} onBlur={blurFn}/>
        </div>

        {/* TABLE */}
        <div className="fade-up fade-up-2" style={{background:"var(--bg-card)",borderRadius:"16px",border:"1px solid var(--border)",overflow:"hidden",backdropFilter:"blur(16px)",boxShadow:"var(--shadow-card)"}}>
          {/* Table header */}
          <div style={{display:"grid",gridTemplateColumns:"150px 1fr 1fr 140px 80px",padding:"12px 24px",borderBottom:"1px solid var(--border)"}}>
            {[lang==="th"?"รหัสสินค้า":"SKU", lang==="th"?"ชื่อสินค้า":"PRODUCT", lang==="th"?"รายละเอียด":"DESCRIPTION", lang==="th"?"ราคาต่อหน่วย":"UNIT PRICE",""].map((h,i)=>(
              <div key={i} style={{fontSize:"10.5px",fontWeight:700,color:"#059669",letterSpacing:"0.08em",textAlign:i>=3?"right":"left"}}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"160px"}}>
              <div style={{width:"32px",height:"32px",border:"3px solid var(--border)",borderTopColor:"#059669",borderRadius:"50%",animation:"spin-slow 0.8s linear infinite"}}/>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{padding:"64px",textAlign:"center"}}>
              <div style={{fontSize:"36px",marginBottom:"12px"}}>📦</div>
              <p style={{color:"var(--text-muted)",fontSize:"14px"}}>{lang==="th"?"ไม่พบสินค้า":"No products found."}</p>
            </div>
          ) : (
            filtered.map((p,idx) => {
              const catColor = getCatColor(p.category);
              const isHovered = hoveredRow === p.product_id;
              return (
                <div key={p.product_id} className="fade-up"
                  onMouseEnter={()=>setHoveredRow(p.product_id)}
                  onMouseLeave={()=>setHoveredRow(null)}
                  style={{display:"grid",gridTemplateColumns:"150px 1fr 1fr 140px 80px",padding:"16px 24px",borderBottom:idx<filtered.length-1?"1px solid var(--border)":"none",alignItems:"center",transition:"background 0.15s",background:isHovered?"var(--bg-card-hover)":"transparent",animationDelay:`${idx*0.03}s`,position:"relative"}}
                >
                  {isHovered && <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:"linear-gradient(to bottom,#059669,#047857)",borderRadius:"0 2px 2px 0"}}/>}

                  {/* SKU */}
                  <div>
                    {p.sku ? (
                      <span style={{display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:"8px",background:`${catColor}15`,border:`1px solid ${catColor}25`,fontSize:"12px",fontWeight:700,color:catColor,fontFamily:"var(--font-mono)",letterSpacing:"0.04em"}}>
                        {p.sku}
                      </span>
                    ) : <span style={{color:"var(--text-muted)",fontSize:"12px"}}>—</span>}
                  </div>

                  {/* Product name */}
                  <div>
                    <p style={{fontSize:"14px",fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.01em",marginBottom:"2px"}}>{p.product_name}</p>
                    {p.category && (
                      <span style={{fontSize:"10.5px",fontWeight:600,color:catColor,background:`${catColor}15`,padding:"1px 7px",borderRadius:"6px"}}>
                        {p.category}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div style={{fontSize:"13px",color:"var(--text-muted)",paddingRight:"16px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {p.description||"—"}
                  </div>

                  {/* Unit price */}
                  <div style={{textAlign:"right",fontSize:"15px",fontWeight:800,color:"var(--text-primary)",fontFamily:"var(--font-mono)",letterSpacing:"-0.02em"}}>
                    {money(p.unit_price)}
                  </div>

                  {/* Actions */}
                  <div style={{textAlign:"right",display:"flex",justifyContent:"flex-end",gap:"4px"}}>
                    <button onClick={()=>openEdit(p)} style={{width:"28px",height:"28px",borderRadius:"7px",border:"1px solid var(--border)",background:"var(--input-bg)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-muted)",transition:"all 0.15s"}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--accent)";(e.currentTarget as HTMLElement).style.borderColor="var(--border-hover)";}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--text-muted)";(e.currentTarget as HTMLElement).style.borderColor="var(--border)";}}
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z"/></svg>
                    </button>
                    <button onClick={()=>del(p.product_id)} disabled={deletingId===p.product_id} style={{width:"28px",height:"28px",borderRadius:"7px",border:"1px solid var(--border)",background:"var(--input-bg)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-muted)",transition:"all 0.15s"}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#f87171";(e.currentTarget as HTMLElement).style.borderColor="rgba(239,68,68,0.3)";(e.currentTarget as HTMLElement).style.background="rgba(239,68,68,0.08)";}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--text-muted)";(e.currentTarget as HTMLElement).style.borderColor="var(--border)";(e.currentTarget as HTMLElement).style.background="var(--input-bg)";}}
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Footer total */}
          {products.length > 0 && (
            <div style={{display:"grid",gridTemplateColumns:"150px 1fr 1fr 140px 80px",padding:"14px 24px",borderTop:"1px solid var(--border)",background:"var(--input-bg)"}}>
              <div style={{fontSize:"11.5px",fontWeight:700,color:"var(--text-muted)",letterSpacing:"0.04em",gridColumn:"1/4"}}>
                {filtered.length} {lang==="th"?"รายการ":"items"}
              </div>
              <div style={{textAlign:"right",fontSize:"13px",fontWeight:700,color:"#059669",fontFamily:"var(--font-mono)"}}>
                {lang==="th"?"รวม":"Total"}: {money(filtered.reduce((s,p)=>s+p.unit_price,0))}
              </div>
              <div/>
            </div>
          )}
        </div>

      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)"}} onClick={e=>{if(e.target===e.currentTarget)setShowModal(false);}}>
          <div className="fade-up" style={{background:"var(--bg-sidebar)",border:"1px solid var(--border)",borderRadius:"20px",padding:"32px",width:"480px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.4)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
              <div>
                <h2 style={{fontFamily:"var(--font-display)",fontSize:"20px",fontWeight:800,color:"var(--text-primary)",letterSpacing:"-0.03em"}}>
                  {editing ? (lang==="th"?"แก้ไขสินค้า":"Edit Product") : (lang==="th"?"เพิ่มสินค้า":"New Product")}
                </h2>
                <p style={{fontSize:"12px",color:"var(--text-muted)",marginTop:"2px"}}>{editing?.product_name||""}</p>
              </div>
              <button onClick={()=>setShowModal(false)} style={{width:"32px",height:"32px",borderRadius:"50%",border:"1px solid var(--border)",background:"var(--input-bg)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-muted)",transition:"all 0.15s"}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="var(--text-primary)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="var(--text-muted)";}}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <Field label={lang==="th"?"ชื่อสินค้า*":"Product Name*"}>
              <input value={form.product_name} onChange={e=>setForm({...form,product_name:e.target.value})} placeholder="e.g. Enterprise Software License" style={inputStyle} onFocus={focusFn} onBlur={blurFn}/>
            </Field>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <Field label="SKU">
                <input value={form.sku||""} onChange={e=>setForm({...form,sku:e.target.value})} placeholder="e.g. SW-ENT-001" style={inputStyle} onFocus={focusFn} onBlur={blurFn}/>
              </Field>
              <Field label={lang==="th"?"หมวดหมู่":"Category"}>
                <select value={form.category||""} onChange={e=>setForm({...form,category:e.target.value})} style={{...inputStyle,cursor:"pointer"}} onFocus={focusFn} onBlur={blurFn}>
                  <option value="">{lang==="th"?"เลือกหมวดหมู่":"Select category"}</option>
                  {["Software","Service","Hardware","Training","Support","Other"].map(c=><option key={c} value={c.toLowerCase()}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label={lang==="th"?"รายละเอียด":"Description"}>
              <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Product description..." rows={3} style={{...inputStyle,resize:"vertical",minHeight:"80px"}} onFocus={focusFn} onBlur={blurFn}/>
            </Field>
            <Field label={lang==="th"?"ราคาต่อหน่วย (USD)*":"Unit Price (USD)*"}>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)",fontSize:"14px",fontWeight:600}}>$</span>
                <input type="number" min={0} step={0.01} value={form.unit_price} onChange={e=>setForm({...form,unit_price:Number(e.target.value)})} placeholder="0.00" style={{...inputStyle,paddingLeft:"28px"}} onFocus={focusFn} onBlur={blurFn}/>
              </div>
            </Field>

            <div style={{display:"flex",gap:"12px",marginTop:"8px"}}>
              <button onClick={()=>setShowModal(false)} style={{flex:1,padding:"11px",borderRadius:"12px",border:"1px solid var(--border)",background:"transparent",color:"var(--text-secondary)",fontSize:"13.5px",fontWeight:600,fontFamily:"var(--font-body)",cursor:"pointer",transition:"all 0.2s"}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border-hover)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)";}}
              >
                {lang==="th"?"ยกเลิก":"Cancel"}
              </button>
              <button onClick={save} disabled={saving} style={{flex:2,padding:"11px",borderRadius:"12px",border:"none",background:saving?"var(--border)":"linear-gradient(135deg,#059669,#047857)",color:"white",fontSize:"13.5px",fontWeight:700,fontFamily:"var(--font-display)",cursor:saving?"not-allowed":"pointer",boxShadow:saving?"none":"0 4px 16px rgba(5,150,105,0.35)",transition:"all 0.2s"}}
                onMouseEnter={e=>{if(!saving){(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(5,150,105,0.45)";}}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(0)";(e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(5,150,105,0.35)";}}
              >
                {saving ? (lang==="th"?"กำลังบันทึก...":"Saving...") : (editing ? (lang==="th"?"บันทึกการเปลี่ยนแปลง":"Save Changes") : (lang==="th"?"เพิ่มสินค้า":"Add Product"))}
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}