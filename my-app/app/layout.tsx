// import "./globals.css";
// import Sidebar from "../components/Sidebar";
// import type { Metadata } from "next";

// // ✅ ใช้ metadata แทน <head>
// export const metadata: Metadata = {
//   title: "My App",
//   description: "My dashboard app",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body
//         style={{
//           margin: 0,
//           fontFamily: "DM Sans, sans-serif",
//         }}
//       >
//         {/* ✅ STYLE */}
//         <style>{`
//           * { box-sizing: border-box; }

//           .sidebar-glow { box-shadow: 4px 0 24px rgba(0,0,0,0.4); }

//           .nav-item { position: relative; overflow: hidden; }
//           .nav-item::before {
//             content: '';
//             position: absolute;
//             left: 0; top: 0; bottom: 0;
//             width: 3px;
//             background: #3b82f6;
//             transform: scaleY(0);
//             transition: transform 0.2s ease;
//             border-radius: 0 2px 2px 0;
//           }
//           .nav-item.active::before { transform: scaleY(1); }

//           .nav-item .nav-bg {
//             position: absolute;
//             inset: 0;
//             background: linear-gradient(90deg, rgba(59,130,246,0.15) 0%, transparent 100%);
//             opacity: 0;
//             transition: opacity 0.2s;
//           }
//           .nav-item.active .nav-bg,
//           .nav-item:hover .nav-bg { opacity: 1; }

//           @keyframes fadeInUp {
//             from { opacity: 0; transform: translateY(8px); }
//             to { opacity: 1; transform: translateY(0); }
//           }

//           .fade-up { animation: fadeInUp 0.35s ease both; }
//           .fade-up-1 { animation-delay: 0.05s; }
//           .fade-up-2 { animation-delay: 0.1s; }
//           .fade-up-3 { animation-delay: 0.15s; }
//         `}</style>

//         {/* ✅ SIDEBAR */}
//         <Sidebar />

//         {/* ✅ CONTENT */}
//         <main
//           style={{
//             marginLeft: "220px",
//             padding: "24px",
//             minHeight: "100vh",
//             background: "#f4f5f7",
//           }}
//         >
//           {children}
//         </main>
//       </body>
//     </html>
//   );
// }
// layout.tsx  →  app/layout.tsx  (Next.js root layout)
// ครอบทุกหน้าด้วย ThemeProvider และ inject CSS ทั้งหมด

import { ReactNode } from "react";
import { ThemeProvider, GLOBAL_CSS } from "./theme";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SalesPro</title>
        {/* Inject global CSS — ทำงานทั้ง dark/light mode ผ่าน [data-theme] */}
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

/*
  ── วิธีใช้งาน ──────────────────────────────────────────────────

  โครงสร้างไฟล์ที่ต้องการ:
  ├── app/
  │   ├── layout.tsx              ← ไฟล์นี้
  │   ├── theme.tsx               ← ThemeProvider + GLOBAL_CSS
  │   ├── layout-components.tsx   ← Sidebar + Topbar
  │   ├── page.tsx                ← page1-list.tsx
  │   ├── create/
  │   │   └── page.tsx            ← page2-create.tsx
  │   └── detail/
  │       └── [id]/
  │           └── page.tsx        ← page3-detail.tsx

  ── Dark / Light mode ───────────────────────────────────────────

  Dark/Light toggle ใช้งานได้จริงทุกหน้าผ่าน ThemeProvider
  ที่ใช้ [data-theme="dark"] / [data-theme="light"] attribute
  บน div ที่ครอบทุกหน้า

  CSS variables ทุกตัวจะ switch อัตโนมัติ ไม่ต้องทำอะไรเพิ่ม

  ── ปุ่ม toggle ─────────────────────────────────────────────────

  อยู่ใน Topbar ทุกหน้า (มุมขวาบน) — กดแล้ว switch ทันที
  ค่าจะถูก save ลง localStorage ด้วย key "qf-theme"
  รีเฟรชหน้าก็ยังจำ mode ที่เลือกไว้

  ── Font ────────────────────────────────────────────────────────

  Plus Jakarta Sans — อ่านง่าย มีความเป็นทางการพอดี ไม่แข็งไม่นุ่มเกิน
  JetBrains Mono    — สำหรับตัวเลข, doc number ให้ดูเป็น professional
*/