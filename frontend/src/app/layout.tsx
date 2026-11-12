import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PERIKSA — Platform Elektronik Rekam Integritas Kontrak Sistem Akuntabel",
  description:
    "Platform kontrak digital cerdas dan akuntabel untuk penyusunan, audit kepatuhan AI, penandatanganan elektronik, dan pengawasan publik.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
