import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Mengambil detail user RADIUS berdasarkan ID dari tabel radcheck
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Ambil ID dari parameter dan konversi ke integer
    const params = await context.params;
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
    }

    // 2. Gunakan ID untuk mencari data di radcheck untuk mendapatkan username
    const initialUser = await prisma.radcheck.findUnique({
      where: { id },
    });

    if (!initialUser) {
      return NextResponse.json({ message: `User dengan ID '${id}' tidak ditemukan.` }, { status: 404 });
    }
    
    // 3. Setelah username didapat, lanjutkan logika untuk mengambil data lengkap
    const { username } = initialUser;
    const [checkAttributes, userGroup, userInfo] = await Promise.all([
      prisma.radcheck.findMany({ where: { username }, select: { attribute: true, op: true, value: true } }),
      prisma.radusergroup.findFirst({ where: { username }, select: { groupname: true } }),
      prisma.userinfo.findUnique({ where: { username }, select: { fullName: true, department: true } }),
    ]);

    const userData = {
      username,
      group: userGroup?.groupname || "N/A",
      fullName: userInfo?.fullName || "N/A",
      department: userInfo?.department || "N/A",
      checkAttributes: checkAttributes.map((attr) => ({
        ...attr,
        value: attr.attribute.toLowerCase().includes("password") ? "********" : attr.value,
      })),
    };
    return NextResponse.json(userData, { status: 200 });

  } catch (error: unknown) {
    let errorMessage = "Terjadi kesalahan pada server.";
    if (error instanceof Error) { errorMessage = error.message; }
    console.error("GET Error:", errorMessage);
    return NextResponse.json({ message: "Gagal mengambil data user.", error: errorMessage }, { status: 500 });
  }
}

// Interface untuk body request PUT yang fleksibel
interface UpdateRequestBody {
  newUsername?: string;
  newPassword?: string;
  passwordType?: 'md5' | 'sha1' | 'cleartext';
  groupname?: string;
  fullName?: string;
  department?: string;
}

/**
 * Mengubah data user RADIUS (Edit) berdasarkan ID
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
    }

    // 1. Ambil username LAMA dari database untuk referensi
    const initialUser = await prisma.radcheck.findUnique({ where: { id } });
    if (!initialUser) {
      return NextResponse.json({ message: `User dengan ID '${id}' tidak ditemukan.` }, { status: 404 });
    }
    const oldUsername = initialUser.username;
    
    // 2. Ambil semua data BARU dari body request
    const body: UpdateRequestBody = await request.json();
    const { newUsername, fullName, department, groupname, newPassword, passwordType } = body;

    // 3. PENTING: Jika username diubah, cek dulu apakah nama baru sudah dipakai
    if (newUsername && oldUsername !== newUsername) {
      const existingUser = await prisma.radcheck.findFirst({
        where: { username: newUsername },
      });
      if (existingUser) {
        return NextResponse.json({ message: `Username '${newUsername}' sudah digunakan.` }, { status: 409 }); // 409 Conflict
      }
    }
    
    // Tentukan username final yang akan digunakan di semua operasi
    const finalUsername = newUsername || oldUsername;
    const prismaOperations: Prisma.PrismaPromise<any>[] = [];

    // --- Rangkai semua operasi dalam satu transaksi ---

    // 4. Logika untuk mengubah username di SEMUA tabel terkait
    if (newUsername && oldUsername !== newUsername) {
      // Perbarui username di tabel radcheck, radusergroup, dan userinfo
      prismaOperations.push(prisma.radcheck.updateMany({ where: { username: oldUsername }, data: { username: finalUsername } }));
      prismaOperations.push(prisma.radusergroup.updateMany({ where: { username: oldUsername }, data: { username: finalUsername } }));
      // Untuk userinfo, kita perlu upsert karena bisa jadi data belum ada
      // Kita hapus yang lama dan buat yang baru untuk menjaga konsistensi
      const oldUserInfo = await prisma.userinfo.findUnique({ where: { username: oldUsername } });
      if (oldUserInfo) {
          prismaOperations.push(prisma.userinfo.delete({ where: { username: oldUsername } }));
      }
    }

    // 5. Logika untuk mengubah info user (nama lengkap & departemen)
    prismaOperations.push(prisma.userinfo.upsert({
      where: { username: finalUsername },
      update: { fullName, department },
      create: { username: finalUsername, fullName: fullName || "", department: department || "" }
    }));

    // 6. Logika untuk mengubah grup
    if (groupname) {
      // Hapus keanggotaan grup lama dan buat yang baru
      prismaOperations.push(prisma.radusergroup.deleteMany({ where: { username: finalUsername } }));
      prismaOperations.push(prisma.radusergroup.create({ data: { username: finalUsername, groupname, priority: 1 } }));
    }

    // 7. Logika untuk mengubah password
    if (newPassword && newPassword.length > 0) {
      const passwordAttr = passwordType === 'md5' ? 'MD5-Password' : 'Cleartext-Password';
      let hashedPassword = newPassword;
      if (passwordType === 'md5') {
        hashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');
      }
      prismaOperations.push(prisma.radcheck.updateMany({
        where: { username: finalUsername, attribute: { contains: 'Password' } },
        data: { attribute: passwordAttr, op: ':=', value: hashedPassword }
      }));
    }

    // 8. Jalankan semua operasi dalam satu transaksi yang aman
    await prisma.$transaction(prismaOperations);

    return NextResponse.json({ message: `Data untuk user ${finalUsername} berhasil diubah` }, { status: 200 });
    
  } catch (error: unknown) {
    let errorMessage = "Terjadi kesalahan pada server.";
    if (error instanceof Error) { errorMessage = error.message; }
    console.error("[API PUT Error]:", errorMessage); 
    return NextResponse.json({ message: "Gagal mengupdate data user.", error: errorMessage }, { status: 500 });
  }
}

/**
 * Menghapus user RADIUS dari semua tabel berdasarkan ID
 */
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
    }

    const initialUser = await prisma.radcheck.findUnique({ where: { id } });
    if (!initialUser) {
      // Jika user tidak ada, anggap sudah terhapus, kembalikan 204
      return new NextResponse(null, { status: 204 });
    }
    
    const { username } = initialUser;
    
    await prisma.$transaction([
      prisma.radcheck.deleteMany({ where: { username } }),
      prisma.radusergroup.deleteMany({ where: { username } }),
      prisma.userinfo.deleteMany({ where: { username } }),
    ]);

    // INI BAGIAN YANG DIPERBAIKI
    return new NextResponse(null, { status: 204 });

  } catch (error: unknown) {
    let errorMessage = "Terjadi kesalahan pada server.";
    if (error instanceof Error) { errorMessage = error.message; }
    console.error("DELETE Error:", errorMessage);
    return NextResponse.json({ message: "Gagal menghapus user.", error: errorMessage }, { status: 500 });
  }
}