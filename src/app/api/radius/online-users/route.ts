import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/radius/online-users
 * Mengambil jumlah pengguna yang sedang online dari tabel radacct.
 */
export async function GET() {
  try {
    // Menghitung jumlah sesi yang belum memiliki acctstoptime (masih aktif)
    const onlineCount = await prisma.radacct.count({
      where: {
        acctstoptime: null, // Kuncinya di sini
      },
    });

    return NextResponse.json({ onlineCount }, { status: 200 });
  } catch (error) {
    console.error("[API Online Users Error]:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data pengguna online." },
      { status: 500 }
    );
  }
}

// Tambahkan baris ini agar Next.js tidak meng-cache hasilnya
// Kita ingin data ini selalu baru setiap kali diminta
export const dynamic = 'force-dynamic';