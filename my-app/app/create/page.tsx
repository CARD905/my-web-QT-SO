// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// /* ================= TYPES ================= */
// type Customer = {
//   customer_name: string;
//   customer_company: string;
//   customer_phone: string;
//   customer_address: string;
//   customer_email: string;
// };

// type CustomerDB = Customer & {
//   customer_id: number;
// };

// type Item = {
//   product_name: string;
//   description: string;
//   qty: number;
//   unit_price: number;
//   discount: number;
// };

// /* ================= PAGE ================= */
// export default function CreatePage() {
//   const router = useRouter();
//   const API = process.env.NEXT_PUBLIC_API_URL || "";

//   /* ================= STATE ================= */
//   const [customers, setCustomers] = useState<CustomerDB[]>([]);
//   const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

//   const [customer, setCustomer] = useState<Customer>({
//     customer_name: "",
//     customer_company: "",
//     customer_phone: "",
//     customer_address: "",
//     customer_email: "",
//   });

//   const [items, setItems] = useState<Item[]>([
//     {
//       product_name: "",
//       description: "",
//       qty: 1,
//       unit_price: 0,
//       discount: 0,
//     },
//   ]);

//   const [date, setDate] = useState("");
//   const [expiry, setExpiry] = useState("");

//   /* ================= INIT ================= */
//   useEffect(() => {
//     // โหลดลูกค้า
//     fetch(`${API}/customers`)
//       .then(res => res.json())
//       .then(setCustomers);

//     // set วันที่
//     const today = new Date();
//     const next = new Date();
//     next.setDate(today.getDate() + 30);

//     const f = (d: Date) => d.toISOString().split("T")[0];

//     setDate(f(today));
//     setExpiry(f(next));
//   }, []);

//   /* ================= SELECT CUSTOMER ================= */
//   const selectCustomer = (id: number) => {
//     setSelectedCustomerId(id);

//     const c = customers.find(c => c.customer_id === id);
//     if (!c) return;

//     // 🔥 autofill
//     setCustomer({
//       customer_name: c.customer_name,
//       customer_company: c.customer_company,
//       customer_phone: c.customer_phone,
//       customer_address: c.customer_address,
//       customer_email: c.customer_email,
//     });
//   };

//   /* ================= ITEM ================= */
//   const addRow = () => {
//     setItems([
//       ...items,
//       {
//         product_name: "",
//         description: "",
//         qty: 1,
//         unit_price: 0,
//         discount: 0,
//       },
//     ]);
//   };

//   const deleteRow = (i: number) => {
//     setItems(items.filter((_, index) => index !== i));
//   };

//   const updateItem = <K extends keyof Item>(
//     i: number,
//     field: K,
//     value: Item[K]
//   ) => {
//     const newItems = [...items];
//     newItems[i][field] = value;
//     setItems(newItems);
//   };

//   /* ================= CALC ================= */
//   const subtotal = items.reduce(
//     (sum, i) =>
//       sum + i.qty * i.unit_price * (1 - i.discount / 100),
//     0
//   );

//   const vat = subtotal * 0.07;
//   const total = subtotal + vat;

//   const money = (n: number) =>
//     n.toLocaleString("th-TH", {
//       style: "currency",
//       currency: "THB",
//     });

//   /* ================= SUBMIT ================= */
//   const submit = async () => {
//   if (!customer.customer_name) {
//     return alert("กรอกชื่อลูกค้า");
//   }

//   const validItems = items.filter(i => i.product_name);
//   if (validItems.length === 0) {
//     return alert("กรอกสินค้าอย่างน้อย 1 รายการ");
//   }

//   try {
//     const res = await fetch(`${API}/quotations`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         customer_id: selectedCustomerId,
//         customer,
//         issue_date: date,
//         expiry_date: expiry,
//         items: validItems,
//       }),
//     });

//     if (!res.ok) {
//       throw new Error("Create failed");
//     }

//     await res.json();

//     alert("สร้างสำเร็จ ✅");

//     router.push("/"); // 🔥 กลับหน้า list

//   } catch (err) {
//     console.error("Create error:", err);
//     alert("สร้างไม่สำเร็จ ❌");
//   }
// };

//   /* ================= UI ================= */
//   return (
//     <div className="p-8 bg-gray-100 min-h-screen space-y-6">
      
//       {/* HEADER */}
//       <div className="bg-white p-6 rounded-xl shadow flex justify-between">
//         <div>
//           <h1 className="text-xl font-bold">Create Quotation</h1>
//           <p className="text-gray-400 text-sm">
//             Enterprise Sales System
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <input
//             type="date"
//             value={date}
//             onChange={e => setDate(e.target.value)}
//             className="border p-2 rounded-lg"
//           />
//           <input
//             type="date"
//             value={expiry}
//             onChange={e => setExpiry(e.target.value)}
//             className="border p-2 rounded-lg"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-3 gap-6">

//         {/* LEFT */}
//         <div className="col-span-2 space-y-6">

//           {/* CUSTOMER */}
//           <div className="bg-white p-6 rounded-xl shadow space-y-3">
//             <h2 className="font-semibold">
//               Customer Information
//             </h2>

//             {/* 🔽 SELECT CUSTOMER */}
//             <select
//               value={selectedCustomerId || ""}
//               onChange={e => selectCustomer(Number(e.target.value))}
//               className="border p-2 rounded-lg w-full bg-gray-50"
//             >
//               <option value="">-- Select Customer --</option>
//               {customers.map(c => (
//                 <option key={c.customer_id} value={c.customer_id}>
//                   {c.customer_name}
//                 </option>
//               ))}
//             </select>

//             <input
//               placeholder="Customer Name"
//               value={customer.customer_name}
//               onChange={e =>
//                 setCustomer({ ...customer, customer_name: e.target.value })
//               }
//               className="border p-2 rounded-lg w-full"
//             />

//             <div className="grid grid-cols-2 gap-3">
//               <input
//                 placeholder="Company"
//                 value={customer.customer_company}
//                 onChange={e =>
//                   setCustomer({ ...customer, customer_company: e.target.value })
//                 }
//                 className="border p-2 rounded-lg"
//               />

//               <input
//                 placeholder="Phone"
//                 value={customer.customer_phone}
//                 onChange={e =>
//                   setCustomer({ ...customer, customer_phone: e.target.value })
//                 }
//                 className="border p-2 rounded-lg"
//               />
//             </div>

//             <input
//               placeholder="Address"
//               value={customer.customer_address}
//               onChange={e =>
//                 setCustomer({ ...customer, customer_address: e.target.value })
//               }
//               className="border p-2 rounded-lg w-full"
//             />

//             <input
//               placeholder="Email"
//               value={customer.customer_email}
//               onChange={e =>
//                 setCustomer({ ...customer, customer_email: e.target.value })
//               }
//               className="border p-2 rounded-lg w-full"
//             />
//           </div>

//           {/* PRODUCTS */}
//           <div className="bg-white p-6 rounded-xl shadow">
//             <div className="flex justify-between mb-4">
//               <h2 className="font-semibold text-lg">Products</h2>
//               <button
//                 onClick={addRow}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//               >
//                 + Add Product
//               </button>
//             </div>

//             <table className="w-full text-sm border">
//               <thead className="bg-gray-100 text-gray-500">
//                 <tr>
//                   <th className="p-3 text-left">Product</th>
//                   <th className="p-3 text-left">Description</th>
//                   <th className="p-3">Qty</th>
//                   <th className="p-3">Price</th>
//                   <th className="p-3">Disc%</th>
//                   <th className="p-3">Total</th>
//                   <th></th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {items.map((item, i) => (
//                   <tr key={i} className="border-t">
//                     <td className="p-2">
//                       <input
//                         value={item.product_name}
//                         onChange={e =>
//                           updateItem(i, "product_name", e.target.value)
//                         }
//                         className="w-full p-2 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2">
//                       <input
//                         value={item.description}
//                         onChange={e =>
//                           updateItem(i, "description", e.target.value)
//                         }
//                         className="w-full p-2 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={item.qty}
//                         onChange={e =>
//                           updateItem(i, "qty", Number(e.target.value))
//                         }
//                         className="w-20 p-2 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={item.unit_price}
//                         onChange={e =>
//                           updateItem(i, "unit_price", Number(e.target.value))
//                         }
//                         className="w-28 p-2 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={item.discount}
//                         onChange={e =>
//                           updateItem(i, "discount", Number(e.target.value))
//                         }
//                         className="w-20 p-2 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2 text-right font-semibold">
//                       {money(
//                         item.qty *
//                           item.unit_price *
//                           (1 - item.discount / 100)
//                       )}
//                     </td>

//                     <td className="p-2">
//                       <button
//                         onClick={() => deleteRow(i)}
//                         className="text-red-500"
//                       >
//                         ✕
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* RIGHT SUMMARY */}
//         <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-6">
//           <h2 className="font-semibold mb-4">Summary</h2>

//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>{money(subtotal)}</span>
//             </div>

//             <div className="flex justify-between">
//               <span>VAT 7%</span>
//               <span>{money(vat)}</span>
//             </div>

//             <div className="flex justify-between font-bold text-lg text-blue-600">
//               <span>Total</span>
//               <span>{money(total)}</span>
//             </div>
//           </div>

//           <button
//             onClick={submit}
//             className="bg-blue-600 text-white w-full mt-6 py-3 rounded-lg"
//           >
//             Save Quotation
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarLayout } from "@/components/SidebarLayout";

type Customer = {
  customer_name: string;
  customer_company: string;
  customer_phone: string;
  customer_address: string;
  customer_email: string;
};
type CustomerDB = Customer & { customer_id: number };
type Item = {
  product_name: string;
  description: string;
  qty: number;
  unit_price: number;
  discount: number;
};

/* ---- reusable input style ---- */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  fontSize: "13.5px",
  background: "var(--input-bg)",
  color: "var(--text-primary)",
  outline: "none",
  fontFamily: "var(--font-body)",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.03em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CreatePage() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  const [customers, setCustomers] = useState<CustomerDB[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [customer, setCustomer] = useState<Customer>({
    customer_name: "", customer_company: "", customer_phone: "",
    customer_address: "", customer_email: "",
  });
  const [items, setItems] = useState<Item[]>([{ product_name: "", description: "", qty: 1, unit_price: 0, discount: 0 }]);
  const [date, setDate] = useState("");
  const [expiry, setExpiry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API}/customers`).then(r => r.json()).then(setCustomers);
    const today = new Date();
    const next = new Date(); next.setDate(today.getDate() + 30);
    const f = (d: Date) => d.toISOString().split("T")[0];
    setDate(f(today)); setExpiry(f(next));
  }, []);

  const selectCustomer = (id: number) => {
    setSelectedCustomerId(id);
    const c = customers.find(c => c.customer_id === id);
    if (!c) return;
    setCustomer({ customer_name: c.customer_name, customer_company: c.customer_company, customer_phone: c.customer_phone, customer_address: c.customer_address, customer_email: c.customer_email });
  };

  const addRow = () => setItems([...items, { product_name: "", description: "", qty: 1, unit_price: 0, discount: 0 }]);
  const deleteRow = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = <K extends keyof Item>(i: number, field: K, value: Item[K]) => {
    const n = [...items]; n[i][field] = value; setItems(n);
  };

  const subtotal = items.reduce((s, i) => s + i.qty * i.unit_price * (1 - i.discount / 100), 0);
  const vat = subtotal * 0.07;
  const total = subtotal + vat;
  const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const submit = async () => {
    if (!customer.customer_name) return alert("กรอกชื่อลูกค้า");
    const validItems = items.filter(i => i.product_name);
    if (!validItems.length) return alert("กรอกสินค้าอย่างน้อย 1 รายการ");
    try {
      setSubmitting(true);
      const res = await fetch(`${API}/quotations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: selectedCustomerId, customer, issue_date: date, expiry_date: expiry, items: validItems }),
      });
      if (!res.ok) throw new Error("Create failed");
      await res.json();
      alert("สร้างสำเร็จ ✅");
      router.push("/quotations");
    } catch { alert("สร้างไม่สำเร็จ ❌"); }
    finally { setSubmitting(false); }
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "var(--border-hover)";
    e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
  };

  return (
    <SidebarLayout>
      <div style={{ padding: "32px 36px 60px" }}>

        {/* ---- PAGE HEADER ---- */}
        <div className="fade-up" style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <button
              onClick={() => router.push("/quotations")}
              style={{
                display: "flex", alignItems: "center", gap: "5px",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-muted)", fontSize: "12.5px", fontWeight: 500,
                fontFamily: "var(--font-body)", padding: "4px 0",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Quotations
            </button>
            <span style={{ color: "var(--border)", fontSize: "12px" }}>/</span>
            <span style={{ color: "var(--text-secondary)", fontSize: "12.5px" }}>New</span>
            <span style={{ color: "var(--border)", fontSize: "12px" }}>/</span>
            <span style={{ color: "var(--text-secondary)", fontSize: "12.5px" }}>Edit</span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800,
            letterSpacing: "-0.04em", color: "var(--text-primary)",
          }}>Create Quotation</h1>
        </div>

        {/* ---- TOP DATE BAR ---- */}
        <div className="fade-up fade-up-1" style={{
          background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)",
          padding: "18px 24px", marginBottom: "20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          backdropFilter: "blur(12px)",
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
              New Quotation
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Enterprise Sales System</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { label: "Issue Date", value: date, onChange: setDate },
              { label: "Expiry Date", value: expiry, onChange: setExpiry },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: "block", fontSize: "10.5px", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px", letterSpacing: "0.04em" }}>{f.label}</label>
                <input
                  type="date" value={f.value}
                  onChange={e => f.onChange(e.target.value)}
                  style={{ ...inputStyle, width: "auto", padding: "8px 12px" }}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", alignItems: "start" }}>

          {/* ---- LEFT ---- */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* CUSTOMER CARD */}
            <div className="fade-up fade-up-1" style={{
              background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)",
              padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)",
            }}>
              <h2 style={{
                fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700,
                color: "var(--text-primary)", marginBottom: "18px",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span style={{
                  width: "28px", height: "28px", borderRadius: "8px",
                  background: "rgba(124,58,237,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                Customer Information
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <Field label="SELECT CUSTOMER">
                  <select
                    value={selectedCustomerId || ""}
                    onChange={e => selectCustomer(Number(e.target.value))}
                    style={{ ...inputStyle }}
                    onFocus={focusStyle} onBlur={blurStyle}
                  >
                    <option value="">Select customer...</option>
                    {customers.map(c => (
                      <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>
                    ))}
                  </select>
                </Field>

                <Field label="CUSTOMER NAME">
                  <input placeholder="Full name" value={customer.customer_name}
                    onChange={e => setCustomer({ ...customer, customer_name: e.target.value })}
                    style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </Field>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="COMPANY">
                    <input placeholder="Company name" value={customer.customer_company}
                      onChange={e => setCustomer({ ...customer, customer_company: e.target.value })}
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>
                  <Field label="PHONE">
                    <input placeholder="+1 000 000 0000" value={customer.customer_phone}
                      onChange={e => setCustomer({ ...customer, customer_phone: e.target.value })}
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="BILLING ADDRESS">
                    <input placeholder="Address" value={customer.customer_address}
                      onChange={e => setCustomer({ ...customer, customer_address: e.target.value })}
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>
                  <Field label="SHIPPING ADDRESS">
                    <input placeholder="Same as billing" value={customer.customer_address}
                      onChange={e => setCustomer({ ...customer, customer_address: e.target.value })}
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>
                </div>

                <Field label="EMAIL">
                  <input type="email" placeholder="email@company.com" value={customer.customer_email}
                    onChange={e => setCustomer({ ...customer, customer_email: e.target.value })}
                    style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </Field>
              </div>
            </div>

            {/* PRODUCTS CARD */}
            <div className="fade-up fade-up-2" style={{
              background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)",
              padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700,
                  color: "var(--text-primary)",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <span style={{
                    width: "28px", height: "28px", borderRadius: "8px",
                    background: "rgba(124,58,237,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </span>
                  Products
                </h2>
                <button
                  onClick={addRow}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "8px 16px", borderRadius: "10px", 
                    background: "rgba(124,58,237,0.12)",
                    color: "var(--accent)",
                    fontSize: "13px", fontWeight: 700,
                    fontFamily: "var(--font-body)",
                    cursor: "pointer", transition: "all 0.2s",
                    border: "1px solid rgba(124,58,237,0.2)" as any,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.2)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.12)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Item
                </button>
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {["Product", "Description", "Qty", "Unit Price", "Discount", "Type", "Line Total", ""].map((h, i) => (
                        <th key={i} style={{
                          padding: "8px 10px", textAlign: i >= 2 ? "center" : "left",
                          fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)",
                          letterSpacing: "0.06em", whiteSpace: "nowrap",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "13.5px" }}>
                          No items yet. Click "Add Item" to begin.
                        </td>
                      </tr>
                    )}
                    {items.map((item, i) => {
                      const lineTotal = item.qty * item.unit_price * (1 - item.discount / 100);
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "8px 6px" }}>
                            <input value={item.product_name}
                              onChange={e => updateItem(i, "product_name", e.target.value)}
                              placeholder="Product name"
                              style={{ ...inputStyle, width: "140px", padding: "8px 10px", fontSize: "13px" }}
                              onFocus={focusStyle} onBlur={blurStyle} />
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <input value={item.description}
                              onChange={e => updateItem(i, "description", e.target.value)}
                              placeholder="Description"
                              style={{ ...inputStyle, width: "160px", padding: "8px 10px", fontSize: "13px" }}
                              onFocus={focusStyle} onBlur={blurStyle} />
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <input type="number" value={item.qty}
                              onChange={e => updateItem(i, "qty", Number(e.target.value))}
                              style={{ ...inputStyle, width: "62px", padding: "8px 10px", fontSize: "13px", textAlign: "center" }}
                              onFocus={focusStyle} onBlur={blurStyle} />
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <input type="number" value={item.unit_price}
                              onChange={e => updateItem(i, "unit_price", Number(e.target.value))}
                              style={{ ...inputStyle, width: "100px", padding: "8px 10px", fontSize: "13px", textAlign: "right" }}
                              onFocus={focusStyle} onBlur={blurStyle} />
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <input type="number" value={item.discount}
                              onChange={e => updateItem(i, "discount", Number(e.target.value))}
                              style={{ ...inputStyle, width: "70px", padding: "8px 10px", fontSize: "13px", textAlign: "center" }}
                              onFocus={focusStyle} onBlur={blurStyle} />
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <select style={{ ...inputStyle, width: "70px", padding: "8px 8px", fontSize: "12px" }}>
                              <option>%</option>
                              <option>$</option>
                            </select>
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                            {money(lineTotal)}
                          </td>
                          <td style={{ padding: "8px 6px" }}>
                            <button onClick={() => deleteRow(i)} style={{
                              background: "none", border: "none", cursor: "pointer",
                              color: "var(--text-muted)", padding: "6px", borderRadius: "6px",
                              display: "flex", alignItems: "center", transition: "all 0.15s",
                            }}
                              onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.color = "#f87171";
                                (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)";
                              }}
                              onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                                (e.currentTarget as HTMLElement).style.background = "none";
                              }}
                            >
                              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ---- RIGHT SUMMARY ---- */}
          <div className="fade-up fade-up-3" style={{
            position: "sticky", top: "76px",
            background: "var(--bg-card)", borderRadius: "14px", border: "1px solid var(--border)",
            padding: "24px", backdropFilter: "blur(12px)", boxShadow: "var(--shadow-card)",
          }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700,
              color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: "20px",
            }}>SUMMARY</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {[
                { label: "Subtotal", value: subtotal, color: "var(--text-secondary)" },
                { label: "Discount", value: 0, color: "#f87171", prefix: "-" },
                { label: "VAT (7%)", value: vat, color: "var(--text-secondary)" },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "var(--text-secondary)", fontWeight: 500 }}>{row.label}</span>
                  <span style={{ fontSize: "13.5px", color: row.color, fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                    {row.prefix}{money(row.value)}
                  </span>
                </div>
              ))}

              {/* VAT toggle */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>VAT (7%)</span>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <div style={{
                    width: "38px", height: "22px", borderRadius: "11px",
                    background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                    position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", right: "3px", top: "3px",
                      width: "16px", height: "16px", borderRadius: "50%", background: "white",
                    }} />
                  </div>
                  <span style={{ fontSize: "13.5px", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{money(vat)}</span>
                </label>
              </div>
            </div>

            <div style={{
              borderTop: "1px solid var(--border)", paddingTop: "16px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "24px",
            }}>
              <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                GRAND TOTAL
              </span>
              <span style={{
                fontSize: "22px", fontWeight: 900,
                fontFamily: "var(--font-mono)",
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {money(total)}
              </span>
            </div>

            <button
              onClick={submit}
              disabled={submitting}
              style={{
                width: "100%", padding: "13px",
                borderRadius: "12px", border: "none",
                background: submitting ? "var(--border)" : "linear-gradient(135deg, #7c3aed, #db2777)",
                color: "white",
                fontSize: "14px", fontWeight: 800,
                fontFamily: "var(--font-display)", letterSpacing: "-0.01em",
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: submitting ? "none" : "0 4px 20px rgba(124,58,237,0.4), 0 1px 0 rgba(255,255,255,0.15) inset",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                if (!submitting) {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(124,58,237,0.5), 0 1px 0 rgba(255,255,255,0.15) inset";
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(124,58,237,0.4), 0 1px 0 rgba(255,255,255,0.15) inset";
              }}
            >
              {submitting ? "Saving..." : "✦ Save Quotation"}
            </button>
          </div>

        </div>
      </div>
    </SidebarLayout>
  );
}