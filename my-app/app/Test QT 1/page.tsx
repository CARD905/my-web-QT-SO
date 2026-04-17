
// "use client";
// import { useEffect, useState } from "react";

// type Customer = {
//   customer_id: number;
//   customer_name: string;
//   customer_company: string;
//   customer_phone: string;
//   customer_address: string;
//   customer_email: string;
// };

// type Item = {
//   product_name: string;
//   description: string;
//   qty: number;
//   unit_price: number;
//   discount: number;
// };

// export default function Page() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

//   const [customerForm, setCustomerForm] = useState({
//     customer_name: "",
//     customer_company: "",
//     customer_phone: "",
//     customer_address: "",
//     customer_email: ""
//   });

//   const [items, setItems] = useState<Item[]>([
//     { product_name: "", description: "", qty: 1, unit_price: 0, discount: 0 }
//   ]);

//   const [date, setDate] = useState("");
//   const [expiry, setExpiry] = useState("");

//   useEffect(() => {
//     fetch("http://localhost:4000/customers")
//       .then(res => res.json())
//       .then(setCustomers);
//   }, []);

//   /* CUSTOMER */
//   const selectCustomer = (id: number) => {
//     const c = customers.find(c => c.customer_id === id);
//     if (!c) return;

//     setSelectedCustomer(c);
//     setCustomerForm({
//       customer_name: c.customer_name,
//       customer_company: c.customer_company,
//       customer_phone: c.customer_phone,
//       customer_address: c.customer_address,
//       customer_email: c.customer_email
//     });
//   };

//   const createCustomer = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/customers", {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify(customerForm)
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert("❌ " + data.error);
//         return;
//       }

//       setCustomers(prev => [data, ...prev]);
//       setSelectedCustomer(data);

//       alert("✅ บันทึกสำเร็จ");
//     } catch {
//       alert("❌ connect backend ไม่ได้");
//     }
//   };

//   /* ITEM */
//   const addRow = () => {
//     setItems([...items, { product_name: "", description: "", qty: 1, unit_price: 0, discount: 0 }]);
//   };

//   const deleteRow = (i: number) => {
//     setItems(items.filter((_, index) => index !== i));
//   };

//   const updateItem = <K extends keyof Item>(i: number, field: K, value: Item[K]) => {
//      const newItems = [...items];
//      newItems[i][field] = value;
//      setItems(newItems);
//    };

//   /* CALC */
//   const subtotal = items.reduce(
//     (sum, i) => sum + i.qty * i.unit_price * (1 - i.discount / 100),
//     0
//   );
//   const vat = subtotal * 0.07;
//   const total = subtotal + vat;

//   /* SUBMIT */
//         const submit = () => {
//         if (!selectedCustomer) {
//             alert("เลือก customer ก่อน");
//             return;
//         }

//         const validItems = items.filter(i => i.product_name);

//         if (validItems.length === 0) {
//             alert("กรอกสินค้าอย่างน้อย 1 รายการ");
//             return;
//         }

//         const data = {
//             customer: selectedCustomer,
//             issue_date: date,
//             expiry_date: expiry,
//             items: validItems
//         };

//         // 🔥 เก็บข้อมูลไว้ชั่วคราว
//         localStorage.setItem("qt_preview", JSON.stringify(data));

//         // 👉 ไปหน้า preview
//         window.location.href = "/preview";
//         };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen space-y-6">

//       {/* DOCUMENT */}
//       <div className="bg-white rounded-xl shadow p-6 grid grid-cols-2 gap-4">
//         <div>
//           <label className="text-xs text-gray-400">Issue Date</label>
//           <input type="date" value={date}
//             onChange={e => setDate(e.target.value)}
//             className="border p-2 rounded-lg w-full"/>
//         </div>

//         <div>
//           <label className="text-xs text-gray-400">Expiry Date</label>
//           <input type="date" value={expiry}
//             onChange={e => setExpiry(e.target.value)}
//             className="border p-2 rounded-lg w-full"/>
//         </div>
//       </div>

//       {/* CUSTOMER */}
//       <div className="bg-white rounded-xl shadow p-6 space-y-3">
//         <h3 className="text-xs text-gray-400">CUSTOMER INFORMATION</h3>

//         <select onChange={e => selectCustomer(Number(e.target.value))}
//           className="border p-2 w-full rounded-lg">
//           <option>Select customer...</option>
//           {customers.map(c => (
//             <option key={c.customer_id} value={c.customer_id}>
//               {c.customer_name}
//             </option>
//           ))}
//         </select>

//         <input value={customerForm.customer_name}
//           onChange={e => setCustomerForm({...customerForm, customer_name: e.target.value})}
//           placeholder="Customer Name"
//           className="border p-2 rounded-lg w-full"/>

//         <div className="grid grid-cols-2 gap-3">
//           <input value={customerForm.customer_company}
//             onChange={e => setCustomerForm({...customerForm, customer_company: e.target.value})}
//             placeholder="Company"
//             className="border p-2 rounded-lg"/>
//           <input value={customerForm.customer_phone}
//             onChange={e => setCustomerForm({...customerForm, customer_phone: e.target.value})}
//             placeholder="Phone"
//             className="border p-2 rounded-lg"/>
//         </div>

//         <input value={customerForm.customer_address}
//           onChange={e => setCustomerForm({...customerForm, customer_address: e.target.value})}
//           placeholder="Address"
//           className="border p-2 rounded-lg w-full"/>

//         <input value={customerForm.customer_email}
//           onChange={e => setCustomerForm({...customerForm, customer_email: e.target.value})}
//           placeholder="Email"
//           className="border p-2 rounded-lg w-full"/>

//         <button onClick={createCustomer}
//           className="bg-green-500 text-white px-4 py-2 rounded-lg">
//           Save Customer
//         </button>
//       </div>

//       {/* PRODUCTS */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <div className="flex justify-between mb-4">
//           <h3 className="text-xs text-gray-400">PRODUCTS</h3>
//           <button onClick={addRow}
//             className="border px-3 py-1 rounded-lg text-sm">
//             + Add Row
//           </button>
//         </div>

//         {items.map((item, i) => (
//           <div key={i} className="mb-4 border rounded-lg p-4 space-y-3">
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-gray-400">

//               <div>
//                 <label>Product Name</label>
//                 <input value={item.product_name}
//                   onChange={e => updateItem(i,"product_name",e.target.value)}
//                   className="border p-2 rounded-lg w-full"/>
//               </div>

//               <div>
//                 <label>Description</label>
//                 <input value={item.description}
//                   onChange={e => updateItem(i,"description",e.target.value)}
//                   className="border p-2 rounded-lg w-full"/>
//               </div>

//               <div>
//                 <label>Quantity</label>
//                 <input type="number" value={item.qty}
//                   onChange={e => updateItem(i,"qty",Number(e.target.value))}
//                   className="border p-2 rounded-lg w-full"/>
//               </div>

//               <div>
//                 <label>Unit Price</label>
//                 <input type="number" value={item.unit_price}
//                   onChange={e => updateItem(i,"unit_price",Number(e.target.value))}
//                   className="border p-2 rounded-lg w-full"/>
//               </div>

//               <div>
//                 <label>Discount (%)</label>
//                 <input type="number" value={item.discount}
//                   onChange={e => updateItem(i,"discount",Number(e.target.value))}
//                   className="border p-2 rounded-lg w-full"/>
//               </div>

//               <div>
//                 <label>Total</label>
//                 <div className="border p-2 rounded-lg bg-gray-50">
//                   {(item.qty * item.unit_price * (1 - item.discount / 100)).toFixed(2)}
//                 </div>
//               </div>

//             </div>

//             <div className="flex justify-end">
//               <button onClick={() => deleteRow(i)} className="text-red-500 text-sm">
//                 🗑 ลบรายการ
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* SUMMARY */}
//       <div className="bg-white rounded-xl shadow p-6 text-right space-y-2">
//         <div>Subtotal: {subtotal.toFixed(2)}</div>
//         <div>VAT (7%): {vat.toFixed(2)}</div>
//         <div className="font-bold text-blue-600 text-lg">
//           Total: {total.toFixed(2)}
//         </div>
//       </div>

//       {/* ACTION */}
//       <div className="flex justify-end gap-2">
//         <button className="border px-4 py-2 rounded-lg">Cancel</button>
//         <button onClick={submit}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg">
//           Submit
//         </button>
//       </div>

//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";

/* ================= TYPE ================= */
type Customer = {
  customer_id?: number;
  customer_name: string;
  customer_company: string;
  customer_phone: string;
  customer_address: string;
  customer_email: string;
};

type Item = {
  product_name: string;
  description: string;
  qty: number;
  unit_price: number;
  discount: number;
};

export default function Page() {

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [customerForm, setCustomerForm] = useState<Customer>({
    customer_name: "",
    customer_company: "",
    customer_phone: "",
    customer_address: "",
    customer_email: ""
  });

  const [items, setItems] = useState<Item[]>([
    { product_name: "", description: "", qty: 1, unit_price: 0, discount: 0 }
  ]);

  const [date, setDate] = useState("");
  const [expiry, setExpiry] = useState("");

  /* ================= LOAD ================= */
  useEffect(() => {
    fetch("http://127.0.0.1:4000/customers")
      .then(res => res.json())
      .then(setCustomers);

    const today = new Date();
    const next = new Date();
    next.setDate(today.getDate() + 30);

    const f = (d: Date) => d.toISOString().split("T")[0];
    setDate(f(today));
    setExpiry(f(next));
  }, []);

  /* ================= SELECT CUSTOMER ================= */
  const selectCustomer = (id: number) => {
    const c = customers.find(c => c.customer_id === id);
    if (!c) return;

    setSelectedCustomer(c);
    setCustomerForm(c);
  };

  /* ================= ITEM ================= */
  const addRow = () => {
    setItems([...items, { product_name: "", description: "", qty: 1, unit_price: 0, discount: 0 }]);
  };

  const deleteRow = (i: number) => {
    setItems(items.filter((_, index) => index !== i));
  };

  const updateItem = (i: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    newItems[i] = { ...newItems[i], [field]: value };
    setItems(newItems);
  };

  /* ================= CALC ================= */
  const subtotal = items.reduce(
    (sum, i) => sum + i.qty * i.unit_price * (1 - i.discount / 100),
    0
  );

  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  const money = (n: number) =>
    n.toLocaleString("th-TH", { style: "currency", currency: "THB" });

  /* ================= SUBMIT ================= */
  const submit = async () => {
    const validItems = items.filter(i => i.product_name);

    if (!customerForm.customer_name) {
      return alert("กรอกชื่อลูกค้า");
    }

    if (validItems.length === 0) {
      return alert("กรอกสินค้าอย่างน้อย 1 รายการ");
    }

    const res = await fetch("http://127.0.0.1:4000/quotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: selectedCustomer || customerForm,
        issue_date: date,
        expiry_date: expiry,
        items: validItems
      })
    });

    if (!res.ok) return alert("❌ error");

    alert("✅ บันทึกสำเร็จ");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Create Quotation</h1>
          <p className="text-gray-400 text-sm">Enterprise Sales System</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input type="date" value={date}
            onChange={e => setDate(e.target.value)}
            className="border p-2 rounded-lg" />

          <input type="date" value={expiry}
            onChange={e => setExpiry(e.target.value)}
            className="border p-2 rounded-lg" />
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-3 gap-6">

        {/* ================= LEFT ================= */}
        <div className="col-span-2 space-y-6">

          {/* CUSTOMER */}
          <div className="bg-white p-6 rounded-xl shadow space-y-3">
            <h2 className="font-semibold">Customer Information</h2>

            {/* SELECT */}
            <select
              onChange={e => selectCustomer(Number(e.target.value))}
              className="border p-3 rounded-lg w-full bg-gray-50"
            >
              <option value="">-- Select Customer --</option>
              {customers.map(c => (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.customer_name}
                </option>
              ))}
            </select>

            <input
              placeholder="Customer Name"
              value={customerForm.customer_name}
              onChange={e => setCustomerForm({ ...customerForm, customer_name: e.target.value })}
              className="border p-2 rounded-lg w-full"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Company"
                value={customerForm.customer_company}
                onChange={e => setCustomerForm({ ...customerForm, customer_company: e.target.value })}
                className="border p-2 rounded-lg"
              />
              <input
                placeholder="Phone"
                value={customerForm.customer_phone}
                onChange={e => setCustomerForm({ ...customerForm, customer_phone: e.target.value })}
                className="border p-2 rounded-lg"
              />
            </div>

            <input
              placeholder="Address"
              value={customerForm.customer_address}
              onChange={e => setCustomerForm({ ...customerForm, customer_address: e.target.value })}
              className="border p-2 rounded-lg w-full"
            />

            <input
              placeholder="Email"
              value={customerForm.customer_email}
              onChange={e => setCustomerForm({ ...customerForm, customer_email: e.target.value })}
              className="border p-2 rounded-lg w-full"
            />
          </div>

          {/* PRODUCTS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">Products</h2>
              <button
                onClick={addRow}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                + Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100 text-gray-500">
                  <tr>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Disc%</th>
                    <th className="p-3">Total</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">
                        <input
                          value={item.product_name}
                          onChange={e => updateItem(i, "product_name", e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          value={item.description}
                          onChange={e => updateItem(i, "description", e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={e => updateItem(i, "qty", Number(e.target.value))}
                          className="w-20 p-2 border rounded-lg"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={e => updateItem(i, "unit_price", Number(e.target.value))}
                          className="w-28 p-2 border rounded-lg"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="number"
                          value={item.discount}
                          onChange={e => updateItem(i, "discount", Number(e.target.value))}
                          className="w-20 p-2 border rounded-lg"
                        />
                      </td>

                      <td className="p-2 text-right font-semibold">
                        {money(item.qty * item.unit_price * (1 - item.discount / 100))}
                      </td>

                      <td className="p-2">
                        <button onClick={() => deleteRow(i)} className="text-red-500">
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-6">
          <h2 className="font-semibold mb-4">Summary</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>VAT 7%</span>
              <span>{money(vat)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg text-blue-600">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>

          <button
            onClick={submit}
            className="bg-blue-600 text-white w-full mt-6 py-3 rounded-lg"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}