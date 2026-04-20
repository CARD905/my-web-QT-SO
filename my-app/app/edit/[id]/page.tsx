"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SidebarLayout } from "@/components/SidebarLayout";

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "";

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API}/quotations/${id}`)
      .then(res => res.json())
      .then(setData);
  }, [id]);

  if (!data) return <div>Loading...</div>;

  /* ================= UPDATE ITEM ================= */
  const updateItem = (i: number, field: string, value: any) => {
    const newItems = [...data.items];
    newItems[i][field] = value;
    setData({ ...data, items: newItems });
  };

  /* ================= SAVE ================= */
  const save = async () => {
    const res = await fetch(`${API}/quotations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) return alert("❌ save error");

    alert("✅ saved");
    router.push(`/detail/${id}`);
  };

  return (
    <SidebarLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl shadow flex justify-between">
          <div>
            <h1 className="text-xl font-bold">Edit Quotation</h1>
            <p className="text-gray-400">{data.quotation_no}</p>
          </div>

          <button
            onClick={save}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </div>

        {/* DOCUMENT */}
        <div className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4">
          <div>
            <label>Issue Date</label>
            <input
              type="date"
              value={data.issue_date}
              onChange={e =>
                setData({ ...data, issue_date: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label>Expiry Date</label>
            <input
              type="date"
              value={data.expiry_date}
              onChange={e =>
                setData({ ...data, expiry_date: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4">
          <input
            placeholder="Customer Name"
            value={data.customer_name}
            onChange={e =>
              setData({ ...data, customer_name: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Company"
            value={data.customer_company}
            onChange={e =>
              setData({ ...data, customer_company: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Email"
            value={data.customer_email}
            onChange={e =>
              setData({ ...data, customer_email: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Phone"
            value={data.customer_phone}
            onChange={e =>
              setData({ ...data, customer_phone: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Address"
            value={data.customer_address}
            onChange={e =>
              setData({ ...data, customer_address: e.target.value })
            }
            className="border p-2 rounded col-span-2"
          />
        </div>

        {/* ITEMS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th>Product</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount</th>
              </tr>
            </thead>

            <tbody>
              {data.items.map((item: any, i: number) => (
                <tr key={i}>
                  <td>
                    <input
                      value={item.product_name}
                      onChange={e =>
                        updateItem(i, "product_name", e.target.value)
                      }
                      className="border p-1"
                    />
                  </td>

                  <td>
                    <input
                      value={item.description}
                      onChange={e =>
                        updateItem(i, "description", e.target.value)
                      }
                      className="border p-1"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={e =>
                        updateItem(i, "qty", Number(e.target.value))
                      }
                      className="border p-1 w-16"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={e =>
                        updateItem(i, "unit_price", Number(e.target.value))
                      }
                      className="border p-1 w-24"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.discount_percent}
                      onChange={e =>
                        updateItem(i, "discount_percent", Number(e.target.value))
                      }
                      className="border p-1 w-20"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </SidebarLayout>
  );
}