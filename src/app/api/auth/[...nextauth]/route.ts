import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Mengimpor 'aturan' dari lib/auth.ts

// Membuat handler NextAuth dengan konfigurasi yang sudah kita definisikan
const handler = NextAuth(authOptions);

// Mengekspor handler untuk menangani request GET dan POST
export { handler as GET, handler as POST };