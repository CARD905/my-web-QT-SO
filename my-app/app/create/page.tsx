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

type Customer = {
  customer_name: string;
  customer_company: string;
  customer_phone: string;
  customer_address: string;
  customer_email: string;
};
type CustomerDB = Customer & { customer_id: number; };
type Item = { product_name: string; description: string; qty: number; unit_price: number; discount: number; };

export default function CreatePage() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const [isDark, setIsDark] = useState(true);

  const [customers, setCustomers] = useState<CustomerDB[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [customer, setCustomer] = useState<Customer>({ customer_name: "", customer_company: "", customer_phone: "", customer_address: "", customer_email: "" });
  const [items, setItems] = useState<Item[]>([{ product_name: "", description: "", qty: 1, unit_price: 0, discount: 0 }]);
  const [date, setDate] = useState("");
  const [expiry, setExpiry] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/customers`).then(res => res.json()).then(setCustomers);
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

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.unit_price * (1 - i.discount / 100), 0);
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const submit = async () => {
    if (!customer.customer_name) return alert("Please enter customer name");
    const validItems = items.filter(i => i.product_name);
    if (validItems.length === 0) return alert("Please add at least 1 product");
    try {
      setSaving(true);
      const res = await fetch(`${API}/quotations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: selectedCustomerId, customer, issue_date: date, expiry_date: expiry, items: validItems }),
      });
      if (!res.ok) throw new Error("Create failed");
      await res.json();
      router.push("/");
    } catch (err) { console.error(err); alert("Create failed ❌"); }
    finally { setSaving(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

        :root.dark {
          --bg0:#07070f; --bg1:#0f0f1a; --bg2:#15151f; --bg3:#1c1c2a;
          --text1:#f0eeff; --text2:#9896b8; --text3:#555570;
          --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
          --card:rgba(255,255,255,0.04); --input-bg:#15151f;
          --accent:#a78bfa; --accent-dim:rgba(167,139,250,0.15);
          --red:#f87171; --red-bg:rgba(248,113,113,0.1);
        }
        :root.light {
          --bg0:#f0eeff; --bg1:#ffffff; --bg2:#f7f5ff; --bg3:#ede9fe;
          --text1:#1e1b4b; --text2:#4c4577; --text3:#9088bb;
          --border:rgba(109,40,217,0.1); --border2:rgba(109,40,217,0.18);
          --card:rgba(109,40,217,0.04); --input-bg:#ffffff;
          --accent:#7c3aed; --accent-dim:rgba(124,58,237,0.1);
          --red:#dc2626; --red-bg:rgba(220,38,38,0.08);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cr-app { background: var(--bg0); color: var(--text1); min-height: 100vh; font-family: 'Outfit', sans-serif; transition: background .3s, color .3s; }

        /* TOPBAR */
        .cr-topbar { display:flex; align-items:center; justify-content:space-between; padding:14px 32px; border-bottom:1px solid var(--border); background:var(--bg1); position:sticky; top:0; z-index:100; }
        .cr-logo { display:flex; align-items:center; gap:10px; }
        .cr-logo-icon { width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg,#a78bfa,#ec4899); display:flex; align-items:center; justify-content:center; }
        .cr-logo-icon svg { width:17px; height:17px; stroke:white; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
        .cr-logo-text { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; letter-spacing:-0.02em; color:var(--text1); }
        .cr-topbar-right { display:flex; align-items:center; gap:12px; }
        .cr-theme-btn { width:52px; height:28px; border-radius:14px; border:1px solid var(--border2); background:var(--bg3); cursor:pointer; position:relative; padding:3px; display:flex; align-items:center; transition:background .3s; }
        .cr-theme-knob { width:22px; height:22px; border-radius:50%; background:linear-gradient(135deg,#a78bfa,#ec4899); transition:transform .35s cubic-bezier(.34,1.56,.64,1); display:flex; align-items:center; justify-content:center; font-size:11px; }
        .light .cr-theme-knob { transform:translateX(24px); }
        .cr-back-btn { display:flex; align-items:center; gap:6px; padding:7px 14px; border:1px solid var(--border); border-radius:10px; background:none; color:var(--text2); font-size:13px; cursor:pointer; font-family:'Outfit',sans-serif; transition:background .15s,color .15s; }
        .cr-back-btn:hover { background:var(--card); color:var(--text1); }
        .cr-back-btn svg { width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }

        /* MAIN */
        .cr-main { padding:32px; max-width:1100px; margin:0 auto; }

        /* BREADCRUMB */
        .cr-breadcrumb { font-size:12px; color:var(--text3); margin-bottom:20px; display:flex; align-items:center; gap:6px; }
        .cr-breadcrumb a { color:var(--accent); cursor:pointer; text-decoration:none; }
        .cr-breadcrumb a:hover { text-decoration:underline; }

        /* PAGE HEADER */
        .cr-page-header { margin-bottom:24px; }
        .cr-page-header h1 { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; letter-spacing:-0.03em; color:var(--text1); }
        .cr-page-header p { font-size:13.5px; color:var(--text2); margin-top:4px; }

        /* CARDS */
        .cr-card { background:var(--bg1); border:1px solid var(--border); border-radius:18px; padding:24px; }
        .cr-card-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:600; color:var(--accent); letter-spacing:.08em; text-transform:uppercase; margin-bottom:18px; display:flex; align-items:center; gap:8px; }
        .cr-card-title::before { content:''; width:3px; height:14px; border-radius:2px; background:linear-gradient(to bottom,#a855f7,#ec4899); display:inline-block; }

        /* LAYOUT */
        .cr-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .cr-col-full { grid-column:1/-1; }

        /* DATE ROW */
        .cr-date-row { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:24px; }
        .cr-date-field { flex:1; min-width:180px; }
        .cr-label { font-size:11.5px; font-weight:500; color:var(--text3); margin-bottom:6px; display:block; letter-spacing:.04em; text-transform:uppercase; }

        /* INPUTS */
        .cr-input, .cr-select {
          width:100%; padding:10px 14px; background:var(--input-bg);
          border:1px solid var(--border); border-radius:11px;
          color:var(--text1); font-size:13.5px; outline:none;
          font-family:'Outfit',sans-serif; transition:border .2s,box-shadow .2s;
        }
        .cr-input::placeholder { color:var(--text3); }
        .cr-input:focus, .cr-select:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim); }
        .cr-select { appearance:none; cursor:pointer; }

        /* PRODUCTS TABLE */
        .cr-products-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .cr-add-btn {
          display:flex; align-items:center; gap:6px;
          padding:8px 16px; border:1px dashed rgba(167,139,250,.4);
          border-radius:10px; background:var(--accent-dim);
          color:var(--accent); font-size:13px; font-weight:500;
          cursor:pointer; font-family:'Outfit',sans-serif;
          transition:background .15s,border-color .15s;
        }
        .cr-add-btn:hover { background:rgba(167,139,250,.2); border-color:rgba(167,139,250,.6); }
        .cr-add-btn svg { width:13px; height:13px; stroke:currentColor; fill:none; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; }

        .cr-table-wrap { overflow-x:auto; }
        .cr-table { width:100%; border-collapse:collapse; font-size:13px; }
        .cr-table thead tr { border-bottom:1px solid var(--border); }
        .cr-table th { padding:8px 10px; text-align:left; font-size:10.5px; font-weight:600; color:var(--accent); letter-spacing:.07em; text-transform:uppercase; white-space:nowrap; }
        .cr-table th.r { text-align:right; }
        .cr-table tbody tr { border-bottom:1px solid var(--border); transition:background .15s; }
        .cr-table tbody tr:hover { background:var(--card); }
        .cr-table tbody tr:last-child { border-bottom:none; }
        .cr-table td { padding:8px 10px; }
        .cr-table td.r { text-align:right; font-family:'DM Mono',monospace; font-weight:500; color:var(--text1); }
        .cr-row-input {
          width:100%; padding:8px 10px; background:var(--bg2);
          border:1px solid var(--border); border-radius:8px;
          color:var(--text1); font-size:13px; outline:none;
          font-family:'Outfit',sans-serif; transition:border .15s;
        }
        .cr-row-input:focus { border-color:var(--accent); }
        .cr-del-row { background:none; border:none; color:var(--text3); cursor:pointer; padding:5px; border-radius:6px; display:flex; align-items:center; transition:color .15s,background .15s; }
        .cr-del-row:hover { color:var(--red); background:var(--red-bg); }
        .cr-del-row svg { width:14px; height:14px; stroke:currentColor; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }

        /* SUMMARY */
        .cr-summary { background:var(--bg1); border:1px solid var(--border); border-radius:18px; padding:24px; position:sticky; top:80px; }
        .cr-summary-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:600; color:var(--accent); letter-spacing:.08em; text-transform:uppercase; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
        .cr-summary-title::before { content:''; width:3px; height:14px; border-radius:2px; background:linear-gradient(to bottom,#a855f7,#ec4899); display:inline-block; }
        .cr-sum-row { display:flex; justify-content:space-between; align-items:center; padding:7px 0; font-size:13.5px; color:var(--text2); border-bottom:1px solid var(--border); }
        .cr-sum-row:last-of-type { border-bottom:none; }
        .cr-sum-val { font-family:'DM Mono',monospace; font-size:13px; }
        .cr-sum-total { display:flex; justify-content:space-between; align-items:center; padding:14px 0 0; }
        .cr-sum-total-label { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:var(--text1); }
        .cr-sum-total-val { font-family:'DM Mono',monospace; font-size:18px; font-weight:700; color:var(--accent); }

        /* SAVE BUTTON */
        .cr-save-btn {
          position:relative; width:100%; display:flex; align-items:center; justify-content:center; gap:8px;
          margin-top:20px; padding:13px 24px; border:none; border-radius:14px;
          font-family:'Syne',sans-serif; font-size:15px; font-weight:700;
          cursor:pointer; overflow:hidden; color:white; letter-spacing:.01em;
          background:linear-gradient(120deg,#a855f7 0%,#ec4899 50%,#60a5fa 100%);
          background-size:200% 200%; animation:btnShimmer 4s ease infinite;
          transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,opacity .2s;
        }
        @keyframes btnShimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .cr-save-btn:hover { transform:translateY(-2px) scale(1.01); box-shadow:0 8px 30px rgba(168,85,247,.5); }
        .cr-save-btn:active { transform:scale(0.98); }
        .cr-save-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .cr-save-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(120deg,rgba(255,255,255,.18) 0%,transparent 60%); pointer-events:none; }
        .cr-save-btn .btn-glow { position:absolute; inset:-2px; border-radius:16px; z-index:-1; background:linear-gradient(120deg,#a855f7,#ec4899,#60a5fa); background-size:200% 200%; animation:btnShimmer 4s ease infinite; opacity:0; filter:blur(8px); transition:opacity .2s; }
        .cr-save-btn:hover .btn-glow { opacity:.8; }
        .cr-save-btn svg { width:16px; height:16px; stroke:white; fill:none; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; }

        /* LAYOUT */
        .cr-body { display:grid; grid-template-columns:1fr 300px; gap:20px; align-items:start; }
        .cr-left { display:flex; flex-direction:column; gap:16px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .fade-up { animation:fadeUp .4s ease both; }
        .fade-up-1 { animation-delay:.06s; }
        .fade-up-2 { animation-delay:.12s; }
        .fade-up-3 { animation-delay:.18s; }
      `}</style>

      <div className={`cr-app ${isDark ? "dark" : "light"}`}>

        {/* TOPBAR */}
        <div className="cr-topbar">
          <div className="cr-logo">
            <div className="cr-logo-icon">
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <span className="cr-logo-text">QuoteFlow</span>
          </div>
          <div className="cr-topbar-right">
            <button className="cr-back-btn" onClick={() => router.push("/")}>
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <button className="cr-theme-btn" onClick={() => setIsDark(!isDark)}>
              <div className="cr-theme-knob">{isDark ? "☀" : "🌙"}</div>
            </button>
          </div>
        </div>

        <div className="cr-main">

          {/* BREADCRUMB */}
          <div className="cr-breadcrumb fade-up">
            <a onClick={() => router.push("/")}>Quotations</a>
            <span>›</span>
            <span>New Quotation</span>
          </div>

          {/* PAGE HEADER */}
          <div className="cr-page-header fade-up fade-up-1">
            <h1>Create Quotation</h1>
            <p>Fill in the details below to generate a new quotation document</p>
          </div>

          <div className="cr-body">
            <div className="cr-left">

              {/* DATES */}
              <div className="cr-card fade-up fade-up-1">
                <div className="cr-card-title">Document Dates</div>
                <div className="cr-date-row">
                  <div className="cr-date-field">
                    <label className="cr-label">Issue Date</label>
                    <input type="date" className="cr-input" value={date} onChange={e => setDate(e.target.value)} />
                  </div>
                  <div className="cr-date-field">
                    <label className="cr-label">Expiry Date</label>
                    <input type="date" className="cr-input" value={expiry} onChange={e => setExpiry(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* CUSTOMER */}
              <div className="cr-card fade-up fade-up-2">
                <div className="cr-card-title">Customer Information</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label className="cr-label">Select Existing Customer</label>
                    <div style={{ position: "relative" }}>
                      <select
                        className="cr-select cr-input"
                        value={selectedCustomerId || ""}
                        onChange={e => selectCustomer(Number(e.target.value))}
                      >
                        <option value="">— Select customer —</option>
                        {customers.map(c => (
                          <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="cr-label">Customer Name *</label>
                    <input className="cr-input" placeholder="Full name" value={customer.customer_name} onChange={e => setCustomer({ ...customer, customer_name: e.target.value })} />
                  </div>
                  <div className="cr-grid">
                    <div>
                      <label className="cr-label">Company</label>
                      <input className="cr-input" placeholder="Company name" value={customer.customer_company} onChange={e => setCustomer({ ...customer, customer_company: e.target.value })} />
                    </div>
                    <div>
                      <label className="cr-label">Phone</label>
                      <input className="cr-input" placeholder="+66 8x xxx xxxx" value={customer.customer_phone} onChange={e => setCustomer({ ...customer, customer_phone: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="cr-label">Address</label>
                    <input className="cr-input" placeholder="Billing address" value={customer.customer_address} onChange={e => setCustomer({ ...customer, customer_address: e.target.value })} />
                  </div>
                  <div>
                    <label className="cr-label">Email</label>
                    <input className="cr-input" type="email" placeholder="email@company.com" value={customer.customer_email} onChange={e => setCustomer({ ...customer, customer_email: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* PRODUCTS */}
              <div className="cr-card fade-up fade-up-3">
                <div className="cr-products-header">
                  <div className="cr-card-title" style={{ margin: 0 }}>Products & Services</div>
                  <button className="cr-add-btn" onClick={addRow}>
                    <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Product
                  </button>
                </div>
                <div className="cr-table-wrap">
                  <table className="cr-table">
                    <thead>
                      <tr>
                        <th style={{ width: "22%" }}>Product</th>
                        <th style={{ width: "28%" }}>Description</th>
                        <th style={{ width: "9%" }}>Qty</th>
                        <th style={{ width: "14%" }}>Unit Price</th>
                        <th style={{ width: "9%" }}>Disc%</th>
                        <th className="r" style={{ width: "14%" }}>Total</th>
                        <th style={{ width: "4%" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={i}>
                          <td><input className="cr-row-input" value={item.product_name} onChange={e => updateItem(i, "product_name", e.target.value)} /></td>
                          <td><input className="cr-row-input" value={item.description} onChange={e => updateItem(i, "description", e.target.value)} /></td>
                          <td><input type="number" className="cr-row-input" value={item.qty} onChange={e => updateItem(i, "qty", Number(e.target.value))} /></td>
                          <td><input type="number" className="cr-row-input" value={item.unit_price} onChange={e => updateItem(i, "unit_price", Number(e.target.value))} /></td>
                          <td><input type="number" className="cr-row-input" value={item.discount} onChange={e => updateItem(i, "discount", Number(e.target.value))} /></td>
                          <td className="r">{money(item.qty * item.unit_price * (1 - item.discount / 100))}</td>
                          <td>
                            <button className="cr-del-row" onClick={() => deleteRow(i)}>
                              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* SUMMARY */}
            <div className="cr-summary fade-up fade-up-2">
              <div className="cr-summary-title">Summary</div>
              <div className="cr-sum-row"><span>Subtotal</span><span className="cr-sum-val">{money(subtotal)}</span></div>
              <div className="cr-sum-row"><span>VAT 7%</span><span className="cr-sum-val">{money(vat)}</span></div>
              <div className="cr-sum-total">
                <span className="cr-sum-total-label">Total</span>
                <span className="cr-sum-total-val">{money(total)}</span>
              </div>
              <button className="cr-save-btn" onClick={submit} disabled={saving}>
                <span className="btn-glow" />
                {saving ? (
                  <svg viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                )}
                {saving ? "Saving..." : "Save Quotation"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}