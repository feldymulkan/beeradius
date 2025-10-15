// middleware.ts

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Pastikan ini adalah halaman login Anda
  },
});

// Konfigurasi matcher yang sudah diperbaiki
export const config = {
  matcher: [
    /*
     * Cocokkan semua path, KECUALI yang dimulai dengan:
     * - api (rute API)
     * - _next/static (file statis)
     * - _next/image (file optimasi gambar)
     * - favicon.ico (file ikon)
     * - login (halaman login Anda)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};