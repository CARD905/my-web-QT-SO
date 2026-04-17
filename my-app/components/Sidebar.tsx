"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  const menu = [
    { name: "Quotations", path: "/" },
    { name: "Sales Orders", path: "/sale-order" },
  ];

  return (
    <aside
      style={{
        width: "220px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0d1117 0%, #0a0f1a 60%, #050810 100%)",
        position: "fixed",
        top: 0, left: 0, bottom: 0,
      }}
    >
      {/* LOGO */}
      <div style={{ padding: "28px 20px" }}>
        <div style={{ color: "white", fontWeight: 600 }}>
          Wisdom QT SO
        </div>
      </div>

      {/* MENU */}
      <nav style={{ padding: "0 10px" }}>
        {menu.map((m) => {
          const isActive = pathname === m.path;
          return (
            <div
              key={m.path}
              onClick={() => router.push(m.path)}
              style={{
                padding: "10px",
                cursor: "pointer",
                color: isActive ? "white" : "#aaa",
                background: isActive ? "#1e293b" : "transparent",
                borderRadius: "6px",
                marginBottom: "4px"
              }}
            >
              {m.name}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}