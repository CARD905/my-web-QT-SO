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
import { ThemeProvider } from "./theme";
import "./globals.css";

export const metadata = {
  title: "Wisdom",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
