"use client";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Home() {
  const [data, setData] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:4000/users");
    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!name || !email) {
      alert("กรอกข้อมูลก่อน");
      return;
    }

    await fetch("http://localhost:4000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    setName("");
    setEmail("");
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800">
          User Management
        </h1>

        {/* Form Card */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">เพิ่มผู้ใช้</h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="ชื่อ"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            บันทึก
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">รายการผู้ใช้</h2>

          {loading ? (
            <p>กำลังโหลด...</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                </tr>
              </thead>

              <tbody>
                {data.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}