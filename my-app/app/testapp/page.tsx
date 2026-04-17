"use client";

import { useEffect, useState } from "react";

type Customer = {
  customer_id: number;
  customer_name: string;
  customer_company: string;
  customer_phone: string;
  customer_address: string;
  customer_email: string;
};

export default function Page() {
  const [items, setItems] = useState<Customer[]>([]);
  const [form, setForm] = useState<Partial<Customer>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    const res = await fetch("http://localhost:4000/customers");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // CREATE / UPDATE
  const handleSubmit = async () => {
    if (!form.customer_name) {
      alert("กรอกชื่อ");
      return;
    }

    if (editingId) {
      await fetch(`http://localhost:4000/customers/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("http://localhost:4000/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({});
    setEditingId(null);
    fetchItems();
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("ลบจริง?")) return;

    await fetch(`http://localhost:4000/customers/${id}`, {
      method: "DELETE",
    });

    fetchItems();
  };

  // EDIT
  const handleEdit = (item: Customer) => {
    setForm(item);
    setEditingId(item.customer_id);
  };

  // SEARCH
  const filtered = items.filter(
    (item) =>
      item.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      item.customer_id.toString().includes(search)
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Customer Management</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="grid grid-cols-3 gap-3">
          <input placeholder="Name"
            value={form.customer_name || ""}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            className="border p-2 rounded" />

          <input placeholder="Company"
            value={form.customer_company || ""}
            onChange={(e) => setForm({ ...form, customer_company: e.target.value })}
            className="border p-2 rounded" />

          <input placeholder="Phone"
            value={form.customer_phone || ""}
            onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
            className="border p-2 rounded" />

          <input placeholder="Address"
            value={form.customer_address || ""}
            onChange={(e) => setForm({ ...form, customer_address: e.target.value })}
            className="border p-2 rounded" />

          <input placeholder="Email"
            value={form.customer_email || ""}
            onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
            className="border p-2 rounded" />
        </div>

        <button onClick={handleSubmit}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Create"}
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="ค้นหา..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Company</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Address</th>
            <th className="p-2">Email</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((c) => (
            <tr key={c.customer_id} className="border">
              <td className="p-2">{c.customer_id}</td>
              <td className="p-2">{c.customer_name}</td>
              <td className="p-2">{c.customer_company}</td>
              <td className="p-2">{c.customer_phone}</td>
              <td className="p-2">{c.customer_address}</td>
              <td className="p-2">{c.customer_email}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleEdit(c)} className="bg-yellow-400 px-2 py-1">Edit</button>
                <button onClick={() => handleDelete(c.customer_id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}