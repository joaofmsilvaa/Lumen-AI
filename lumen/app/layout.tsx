import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Instrument Serif is not available in this Next.js version with weights other than 400,
// so we use system serif fallback and define font-family in CSS.

export const metadata: Metadata = {
  title: "Lumen — RAG Document Intelligence Platform",
  description:
    "Dark-themed SaaS landing page for Lumen: upload PDFs, build vector store and query with citations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0D1117] text-[#F0EDE6]">{children}</body>
    </html>
  );
}
