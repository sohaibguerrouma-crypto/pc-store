import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PC Store | متجر الكمبيوتر - Algeria #1 PC Parts",
  description: "أجهزة كمبيوتر، قطع غيار، وتجميعات من AMD, NVIDIA, Intel بأفضل الأسعار في الجزائر",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
