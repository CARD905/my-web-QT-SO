"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
type Customer = {
  customer_name: string;
  customer_company: string;
  customer_phone: string;
  customer_address: string;
  customer_email: string;
};

type CustomerDB = Customer & {
  customer_id: number;
};

type Item = {
  product_name: string;
  description: string;
  qty: number;
  unit_price: number;
  discount: number;
};

/* ================= PAGE ================= */
export default function CreatePage() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  /* ================= STATE ================= */
  const [customers, setCustomers] = useState<CustomerDB[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  const [customer, setCustomer] = useState<Customer>({
    customer_name: "",
    customer_company: "",
    customer_phone: "",
    customer_address: "",
    customer_email: "",
  });

  const [items, setItems] = useState<Item[]>([
    {
      product_name: "",
      description: "",
      qty: 1,
      unit_price: 0,
      discount: 0,
    },
  ]);

  const [date, setDate] = useState("");
  const [expiry, setExpiry] = useState("");

  /* ================= INIT ================= */
  useEffect(() => {
    // โหลดลูกค้า
    fetch(`${API}/customers`)
      .then(res => res.json())
      .then(setCustomers);

    // set วันที่
    const today = new Date();
    const next = new Date();
    next.setDate(today.getDate() + 30);

    const f = (d: Date) => d.toISOString().split("T")[0];

    setDate(f(today));
    setExpiry(f(next));
  }, []);

  /* ================= SELECT CUSTOMER ================= */
  const selectCustomer = (id: number) => {
    setSelectedCustomerId(id);

    const c = customers.find(c => c.customer_id === id);
    if (!c) return;

    // 🔥 autofill
    setCustomer({
      customer_name: c.customer_name,
      customer_company: c.customer_company,
      customer_phone: c.customer_phone,
      customer_address: c.customer_address,
      customer_email: c.customer_email,
    });
  };

  /* ================= ITEM ================= */
  const addRow = () => {
    setItems([
      ...items,
      {
        product_name: "",
        description: "",
        qty: 1,
        unit_price: 0,
        discount: 0,
      },
    ]);
  };

  const deleteRow = (i: number) => {
    setItems(items.filter((_, index) => index !== i));
  };

  const updateItem = <K extends keyof Item>(
    i: number,
    field: K,
    value: Item[K]
  ) => {
    const newItems = [...items];
    newItems[i][field] = value;
    setItems(newItems);
  };

  /* ================= CALC ================= */
  const subtotal = items.reduce(
    (sum, i) =>
      sum + i.qty * i.unit_price * (1 - i.discount / 100),
    0
  );

  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  const money = (n: number) =>
    n.toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
    });

  /* ================= SUBMIT ================= */
  const submit = async () => {
  if (!customer.customer_name) {
    return alert("กรอกชื่อลูกค้า");
  }

  const validItems = items.filter(i => i.product_name);
  if (validItems.length === 0) {
    return alert("กรอกสินค้าอย่างน้อย 1 รายการ");
  }

  try {
    const res = await fetch(`${API}/quotations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: selectedCustomerId,
        customer,
        issue_date: date,
        expiry_date: expiry,
        items: validItems,
      }),
    });

    if (!res.ok) {
      throw new Error("Create failed");
    }

    await res.json();

    alert("สร้างสำเร็จ ✅");

    router.push("/"); // 🔥 กลับหน้า list

  } catch (err) {
    console.error("Create error:", err);
    alert("สร้างไม่สำเร็จ ❌");
  }
};

  /* ================= UI ================= */
  return (
    <div className="p-8 bg-gray-100 min-h-screen space-y-6">
      
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow flex justify-between">
        <div>
          <h1 className="text-xl font-bold">Create Quotation</h1>
          <p className="text-gray-400 text-sm">
            Enterprise Sales System
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border p-2 rounded-lg"
          />
          <input
            type="date"
            value={expiry}
            onChange={e => setExpiry(e.target.value)}
            className="border p-2 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="col-span-2 space-y-6">

          {/* CUSTOMER */}
          <div className="bg-white p-6 rounded-xl shadow space-y-3">
            <h2 className="font-semibold">
              Customer Information
            </h2>

            {/* 🔽 SELECT CUSTOMER */}
            <select
              value={selectedCustomerId || ""}
              onChange={e => selectCustomer(Number(e.target.value))}
              className="border p-2 rounded-lg w-full bg-gray-50"
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
              value={customer.customer_name}
              onChange={e =>
                setCustomer({ ...customer, customer_name: e.target.value })
              }
              className="border p-2 rounded-lg w-full"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Company"
                value={customer.customer_company}
                onChange={e =>
                  setCustomer({ ...customer, customer_company: e.target.value })
                }
                className="border p-2 rounded-lg"
              />

              <input
                placeholder="Phone"
                value={customer.customer_phone}
                onChange={e =>
                  setCustomer({ ...customer, customer_phone: e.target.value })
                }
                className="border p-2 rounded-lg"
              />
            </div>

            <input
              placeholder="Address"
              value={customer.customer_address}
              onChange={e =>
                setCustomer({ ...customer, customer_address: e.target.value })
              }
              className="border p-2 rounded-lg w-full"
            />

            <input
              placeholder="Email"
              value={customer.customer_email}
              onChange={e =>
                setCustomer({ ...customer, customer_email: e.target.value })
              }
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
                        onChange={e =>
                          updateItem(i, "product_name", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </td>

                    <td className="p-2">
                      <input
                        value={item.description}
                        onChange={e =>
                          updateItem(i, "description", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </td>

                    <td className="p-2">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={e =>
                          updateItem(i, "qty", Number(e.target.value))
                        }
                        className="w-20 p-2 border rounded-lg"
                      />
                    </td>

                    <td className="p-2">
                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={e =>
                          updateItem(i, "unit_price", Number(e.target.value))
                        }
                        className="w-28 p-2 border rounded-lg"
                      />
                    </td>

                    <td className="p-2">
                      <input
                        type="number"
                        value={item.discount}
                        onChange={e =>
                          updateItem(i, "discount", Number(e.target.value))
                        }
                        className="w-20 p-2 border rounded-lg"
                      />
                    </td>

                    <td className="p-2 text-right font-semibold">
                      {money(
                        item.qty *
                          item.unit_price *
                          (1 - item.discount / 100)
                      )}
                    </td>

                    <td className="p-2">
                      <button
                        onClick={() => deleteRow(i)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
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
            Save Quotation
          </button>
        </div>
      </div>
    </div>
  );
}