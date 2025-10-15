import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
// 1. Impor Toaster dari library react-hot-toast
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BeeRadius Admin",
  description: "RADIUS Management Panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        {/* 2. Tambahkan komponen Toaster di sini */}
        {/* Ini akan menjadi 'wadah' untuk semua notifikasi toast Anda */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* Komponen Providers Anda tetap di sini, membungkus children */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}