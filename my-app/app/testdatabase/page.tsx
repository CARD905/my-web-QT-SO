"use client";
import { useEffect, useState } from "react";

type Item = {
  item_no: number;
  item_code: string;
  item_name: string;
  description: string;
  unit_cost: number;
  unit_price: number;
  uom: string;
  status: string;
};

export default function ItemPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Partial<Item>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    const res = await fetch("http://localhost:4000/items");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ================= ADD / UPDATE =================
  const handleSubmit = async () => {
    if (!form.item_code || !form.item_name) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    if (editingId) {
      // UPDATE
      await fetch(`http://localhost:4000/items/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      // CREATE
      await fetch("http://localhost:4000/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({});
    setEditingId(null);
    fetchItems();
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    if (!confirm("ลบจริง?")) return;

    await fetch(`http://localhost:4000/items/${id}`, {
      method: "DELETE",
    });

    fetchItems();
  };

  // ================= EDIT =================
  const handleEdit = (item: Item) => {
    setForm(item);
    setEditingId(item.item_no);
  };

  // ================= SEARCH =================
  const filtered = items.filter(
    (item) =>
      item.item_code.toLowerCase().includes(search.toLowerCase()) ||
      item.item_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">Item Master</h1>

        {/* ===== FORM ===== */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold">
            {editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <input placeholder="Code"
              value={form.item_code || ""}
              onChange={(e) => setForm({ ...form, item_code: e.target.value })}
              className="border p-2 rounded" />

            <input placeholder="Name"
              value={form.item_name || ""}
              onChange={(e) => setForm({ ...form, item_name: e.target.value })}
              className="border p-2 rounded" />

            <input placeholder="Description"
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border p-2 rounded" />

            <input placeholder="Cost"
              type="number"
              value={form.unit_cost || ""}
              onChange={(e) => setForm({ ...form, unit_cost: Number(e.target.value) })}
              className="border p-2 rounded" />

            <input placeholder="Price"
              type="number"
              value={form.unit_price || ""}
              onChange={(e) => setForm({ ...form, unit_price: Number(e.target.value) })}
              className="border p-2 rounded" />

            <input placeholder="UOM"
              value={form.uom || ""}
              onChange={(e) => setForm({ ...form, uom: e.target.value })}
              className="border p-2 rounded" />

            <select
              value={form.status || "ACTIVE"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editingId ? "Update" : "Create"}
            </button>

            {editingId && (
              <button
                onClick={() => {
                  setForm({});
                  setEditingId(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* ===== SEARCH ===== */}
        <input
          placeholder="ค้นหา..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {/* ===== TABLE ===== */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Name</th>
                <th className="p-3">Cost</th>
                <th className="p-3">Price</th>
                <th className="p-3">UOM</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr key={item.item_no} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.item_code}</td>
                  <td className="p-3">{item.item_name}</td>
                  <td className="p-3">{item.unit_cost}</td>
                  <td className="p-3">{item.unit_price}</td>
                  <td className="p-3">{item.uom}</td>
                  <td className="p-3">
                    {item.status === "ACTIVE" ? "✅" : "❌"}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-400 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.item_no)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}