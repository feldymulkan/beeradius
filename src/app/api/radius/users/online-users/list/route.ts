import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/radius/online-users/list
 * Mengambil DAFTAR username yang sedang online dari tabel radacct.
 */
export async function GET() {
  try {
    // 1. Ambil daftar user unik yang sedang online
    const onlineUsers = await prisma.radacct.findMany({
      where: {
        acctstoptime: null, // Sesi yang masih aktif
      },
      select: {
        username: true, // Hanya ambil kolom username
         acctstarttime: true
      },
      distinct: ['username'], // Pastikan setiap username unik
      orderBy: {
        username: 'asc', 
      },
    });

    return NextResponse.json({ onlineUsers: onlineUsers }, { status: 200 });

  } catch (error) {
    console.error("[API Online Users List Error]:", error);
    return NextResponse.json(
      { message: "Gagal mengambil daftar pengguna online." },
      { status: 500 }
    );
  }
}

// Selalu gunakan ini agar data selalu baru
export const dynamic = 'force-dynamic';