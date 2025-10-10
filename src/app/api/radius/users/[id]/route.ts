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

    const initialUser = await prisma.radcheck.findUnique({ where: { id } });
    if (!initialUser) {
      return NextResponse.json({ message: `User dengan ID '${id}' tidak ditemukan.` }, { status: 404 });
    }
    
    const { username } = initialUser;
    const body: UpdateRequestBody = await request.json();
    
    // --- BAGIAN YANG DIPERBAIKI ---
    // Gunakan updateMany untuk mengubah password, ini akan menjaga ID tetap sama
    if (body.newPassword && body.newPassword.length > 0) {
      const passwordType = body.passwordType || 'cleartext';
      let attribute = 'Cleartext-Password';
      let hashedPassword = body.newPassword;

      if (passwordType === 'md5') {
        attribute = 'MD5-Password';
        hashedPassword = crypto.createHash('md5').update(body.newPassword).digest('hex');
      }
      
      await prisma.radcheck.updateMany({
        where: {
          username: username,
          attribute: { contains: "Password" } // Cari atribut password yang ada
        },
        data: {
          attribute: attribute, // Ganti tipe password jika perlu
          value: hashedPassword, // Ganti nilainya
          op: ':='
        }
      });
    }

    // --- Logika lain bisa digabung dalam satu transaction ---
    const otherOperations: Prisma.PrismaPromise<any>[] = [];
    if (body.groupname) {
      otherOperations.push(prisma.radusergroup.deleteMany({ where: { username } }));
      otherOperations.push(prisma.radusergroup.create({ data: { username, groupname: body.groupname, priority: 1 } }));
    }
    if (body.fullName !== undefined || body.department !== undefined) {
      otherOperations.push(prisma.userinfo.upsert({
        where: { username },
        update: { fullName: body.fullName, department: body.department },
        create: { username, fullName: body.fullName || "", department: body.department || "" }
      }));
    }

    if (otherOperations.length > 0) {
      await prisma.$transaction(otherOperations);
    }

    return NextResponse.json({ message: `Data untuk user ${username} berhasil diubah` }, { status: 200 });
    
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