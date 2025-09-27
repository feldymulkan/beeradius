import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers"; // <-- 1. TAMBAHKAN IMPOR INI

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Login to admin panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        {/* 2. BUNGKUS {children} DENGAN <Providers> */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}