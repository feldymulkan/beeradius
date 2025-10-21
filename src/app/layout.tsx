import type { Metadata } from "next"; // Pastikan ini ada
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

// [PERBAIKAN]: Menggunakan '=' untuk inisialisasi, bukan ':'
export const metadata: Metadata = {
  title: "BeeRadius Admin",
  description: "RADIUS Management Panel",
};

// Skrip ini akan berjalan sebelum React/Next.js
// untuk mencegah "flash" tema yang salah.
const ThemeLoaderScript = () => {
  const script = `
    (function() {
      const THEME_KEY = 'theme'; // Key yang Anda gunakan di ThemeSwitcher
      const savedTheme = localStorage.getItem(THEME_KEY);
      const fallbackTheme = 'dark'; // Tema default jika tidak ada
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', fallbackTheme);
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Skrip pemuat tema DITARUH DI SINI, di atas segalanya */}
        <ThemeLoaderScript />

        <Toaster position="top-center" reverseOrder={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}